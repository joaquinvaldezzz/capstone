# Plan 016: Remove Build-Time Static Params from Authenticated Dynamic Dashboards

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 0726f2d..HEAD -- src/app/doctor/results/[id]/page.tsx src/app/admin/users/[id]/page.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/011-clean-lint-baseline-and-shadcn-rules.md
- **Category**: architecture
- **Planned at**: commit `0726f2d`, 2026-10-01
- **Issue**: —

## Why this matters

`src/app/doctor/results/[id]/page.tsx:41` and `src/app/admin/users/[id]/page.tsx:13` export `generateStaticParams()`, forcing Next.js to query the database during `next build`. In continuous integration (CI) or deployment environments without a populated database, this causes build failures or bakes stale user/result IDs into static manifests. These are authenticated, personalized routes that must be rendered dynamically at runtime.

## Current state

- `src/app/doctor/results/[id]/page.tsx:41-51`:
```typescript
export async function generateStaticParams() {
  const id = await getPatientResults();
  if (id == null) return [];
  return id.map((item) => ({ id: String(item.result_id) }));
}
```
- `src/app/admin/users/[id]/page.tsx:13-19`:
```typescript
export async function generateStaticParams() {
  const id = await db.select().from(users);
  return id.map((item) => ({ id: String(item.user_id) }));
}
```
- In `src/app/admin/users/[id]/page.tsx`, `params` is incorrectly typed as `{ params: Promise<{ id: number }> }` even though Next.js dynamic segment parameters are strings (`{ id: string }`).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `bun x tsc --noEmit` | exit 0, no errors |
| Build Check | `bun run build` | exit 0 |
| Lint Check | `bun run lint` | exit 0 |

## Scope

**In scope** (the only files you should modify):
- `src/app/doctor/results/[id]/page.tsx`
- `src/app/admin/users/[id]/page.tsx`

**Out of scope** (do NOT touch):
- Other dashboard pages or components.

## Git workflow

- Branch: `feat/016-dynamic-authenticated-routes`
- Commit message: `fix(routes): remove generateStaticParams from authenticated dashboards`

## Steps

### Step 1: Remove `generateStaticParams` from `src/app/doctor/results/[id]/page.tsx`

1. Remove `export async function generateStaticParams() { ... }`.
2. Ensure `dynamic = "force-dynamic"` is exported if required, or let Next.js infer dynamic rendering from `cookies()` / `verifySession()`.
3. In `generateMetadata` and `Page`, ensure `Number(id)` is used cleanly for `getResultById`.

**Verify**: `bun x tsc --noEmit` → exit 0

### Step 2: Clean up `src/app/admin/users/[id]/page.tsx`

1. Remove `export async function generateStaticParams() { ... }`.
2. Fix parameter type signature:
   ```typescript
   export async function generateMetadata({
     params,
   }: {
     params: Promise<{ id: string }>;
   }): Promise<Metadata> {
     const { id } = await params;
     const user = await getUserById(Number(id));
     ...
   }

   export default async function Page({
     params,
   }: {
     params: Promise<{ id: string }>;
   }) {
     const { id } = await params;
     const user = await getUserById(Number(id));
     ...
   }
   ```

**Verify**: `bun run build` → exit 0

## Done criteria

- [ ] Neither dynamic route file exports `generateStaticParams`.
- [ ] Next.js build runs cleanly without database dependency during SSG extraction.
- [ ] Route parameter types use `{ id: string }` and convert via `Number(id)`.
- [ ] `bun x tsc --noEmit` exits 0.
- [ ] `bun run lint` exits 0.

## STOP conditions

Stop and report back if:
- Next.js build produces static generation errors for other dynamic routes.
