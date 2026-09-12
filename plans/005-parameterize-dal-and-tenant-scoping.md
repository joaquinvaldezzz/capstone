# Plan 005: Parameterize Database Queries and Enforce Tenant Data Scoping

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 1968e3d..HEAD -- src/lib/dal.ts src/app/patient/layout.tsx src/app/patient/result/[id]/page.tsx src/app/doctor/results/[id]/page.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/001-fix-verification-baseline.md, plans/002-enforce-middleware-and-action-auth.md
- **Category**: perf
- **Planned at**: commit `1968e3d`, 2026-09-12
- **Issue**: https://github.com/joaquinvaldezzz/capstone/issues/19

## Why this matters

The data access layer in `src/lib/dal.ts` currently fetches entire database tables without `WHERE` clauses, streaming all patient and doctor medical records into Node.js memory where individual pages perform client-side `.filter()` and `.find()`. In `src/app/patient/result/[id]/page.tsx`, `generateStaticParams` pre-renders all patient medical records at build time, and any patient can view any other patient's diagnosis by manipulating the ID parameter. Furthermore, `SELECT *` on `users` bundles bcrypt password hashes into result objects and logs them via `console.log`.

## Current state

The relevant files:

- `src/lib/dal.ts:185-206` — `getPatientResult()` runs an unparameterized query joining all results, users, and profiles across the entire system.
- `src/app/patient/layout.tsx:19-21` — loads the entire database results table and runs an in-memory `.filter((item) => item.user_id === currentUser.user_id)`.
- `src/app/patient/layout.tsx:27-38` — directly indexes `avatar.rows[0].profile_picture` without checking if `avatar.rows` has any entries, causing null pointer crashes on fresh accounts.
- `src/app/patient/result/[id]/page.tsx:16-25` — contains `generateStaticParams` pre-rendering all patient medical results as static HTML.
- `src/app/patient/result/[id]/page.tsx:37-39` — loads all results into memory and checks `data.find((item) => item.result_id === Number(id))` without checking if `item.user_id === currentUser.user_id`.
- `src/app/doctor/results/[id]/page.tsx:54` — executes `console.log(result)`, dumping patient password hashes and PII into server log streams.

Exemplar excerpts:

`src/app/patient/layout.tsx:19-21`:

```typescript
const results = await getPatientResult().then((data) =>
  data?.filter((item) => item.user_id === currentUser.user_id),
)
```

`src/app/doctor/results/[id]/page.tsx:46-54`:

```typescript
const result = await getPatientResults().then((data) =>
  data?.find((item) => item.result_id === Number(id)),
)

if (result == null) {
  return null
}

console.log(result)
```

## Commands you will need

| Purpose   | Command              | Expected on success |
| --------- | -------------------- | ------------------- |
| Lint      | `bun run lint`       | exit 0, no errors   |
| Typecheck | `bun x tsc --noEmit` | exit 0, no errors   |
| Build     | `bun run build`      | exit 0, successful  |

## Scope

**In scope**:

- `src/lib/dal.ts`
- `src/app/patient/layout.tsx`
- `src/app/patient/result/[id]/page.tsx`
- `src/app/doctor/results/[id]/page.tsx`
- `src/app/admin/page.tsx`

**Out of scope**:

- Do NOT alter table definitions or migrations in `src/lib/db-schema.ts`.
- Do NOT change Next.js middleware (covered in Plan 002).

## Git workflow

- Branch: `advisor/005-parameterize-dal-and-tenant-scoping`
- Commit style: Conventional Commits, e.g. `perf(dal): parameterize database queries and enforce patient scoping`
- Do NOT push or open a PR unless instructed by the operator.

## Steps

### Step 1: Add parameterized queries and exclude password hashes in DAL

In `src/lib/dal.ts`:

1. Modify queries in `getUsers`, `getAllPatientResults`, and `getPatientResults` to explicitly select only needed columns, omitting `users.password`.
2. Add a parameterized function `getResultsByPatientId(userId: number)`:
   ```typescript
   export const getResultsByPatientId = cache(
     async (userId: number): Promise<PatientResult[] | null> => {
       try {
         const { rows } = await db.execute(sql`
           SELECT
             "results".*,
             "users"."first_name" AS "user_first_name",
             "users"."last_name" AS "user_last_name",
             "doctor"."first_name" AS "doctor_first_name",
             "doctor"."last_name" AS "doctor_last_name",
             "profile"."profile_picture" AS "doctor_profile_picture"
           FROM
             "results"
             JOIN "users" ON "results"."user_id" = "users"."user_id"
             JOIN "users" AS "doctor" ON "results"."doctor_id" = "doctor"."user_id"
             LEFT JOIN "user_information" AS "profile" ON "doctor"."user_id" = "profile"."user_id"
           WHERE
             "results"."user_id" = ${userId}
           ORDER BY
             "results"."created_at" DESC;
         `)
         return rows as unknown as PatientResult[]
       } catch (error) {
         console.error('Failed to fetch patient results')
         return null
       }
     },
   )
   ```
3. Add a parameterized function `getResultById(resultId: number)`:
   Queries only the single row matching `results.result_id = ${resultId}` with a `LIMIT 1`.

**Verify**: `bun x tsc --noEmit` exits 0.

### Step 2: Update patient layout and fix avatar null check

In `src/app/patient/layout.tsx`:

1. Replace `const results = await getPatientResult().then(...)` with:
   ```typescript
   const results = await getResultsByPatientId(currentUser.user_id)
   ```
2. Safeguard avatar extraction:
   ```typescript
   const avatarUrl = avatar.rows?.[0]?.profile_picture ? String(avatar.rows[0].profile_picture) : ''
   ```

**Verify**: `bun run lint` exits 0.

### Step 3: Enforce ownership and remove static generation in patient result view

In `src/app/patient/result/[id]/page.tsx`:

1. Remove `generateStaticParams` completely — medical records must not be pre-rendered into static build assets.
2. In `Page`:
   - Retrieve `const currentUser = await getCurrentUser()`.
   - Call `const result = await getResultById(Number(id))`.
   - Verify ownership: `if (!result || result.user_id !== currentUser?.user_id) redirect('/patient')`.

**Verify**: `bun x tsc --noEmit` exits 0.

### Step 4: Remove in-memory search and server console.log in doctor result view

In `src/app/doctor/results/[id]/page.tsx`:

1. Replace `getPatientResults().then(...)` with `await getResultById(Number(id))`.
2. Delete `console.log(result)` on line 54 to prevent leaking PII and diagnostic records into server logs.

**Verify**: `bun run build` exits 0.

## Test plan

- Test logging in as patient A and accessing `/patient/result/<patient_B_result_id>` &rarr; redirects to `/patient` (unauthorized).
- Test patient layout &rarr; only fetches results for current patient with `WHERE results.user_id = ...`.
- Test doctor result view &rarr; loads single record via `getResultById`, no console logging.

## Done criteria

- [ ] Unbounded `getPatientResult()` without `WHERE` is replaced by `getResultsByPatientId`
- [ ] `generateStaticParams` removed from `patient/result/[id]/page.tsx`
- [ ] No `users.password` selected in DAL queries
- [ ] `console.log(result)` removed
- [ ] `plans/README.md` status updated to DONE

## STOP conditions

- If changing column selection breaks tanstack react-table columns in admin or doctor views, explicitly add the missing non-sensitive column to the SELECT clause.

## Maintenance notes

- Any future route displaying results must use parameterized DAL queries scoped to the authenticated caller's identity or role.
