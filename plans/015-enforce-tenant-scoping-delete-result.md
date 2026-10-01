# Plan 015: Enforce Doctor Ownership Checks on Result Deletion and Clinical Reviews

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 0726f2d..HEAD -- src/lib/actions.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/011-clean-lint-baseline-and-shadcn-rules.md
- **Category**: security
- **Planned at**: commit `0726f2d`, 2026-10-01
- **Issue**: —

## Why this matters

In `deleteResult` (`src/lib/actions.ts:707-735`) and `updateResultReview` (`src/lib/actions.ts:746-776`), the action checks only that the user has the `"doctor"` or `"admin"` role, but does not verify that the target diagnosis was created by the requesting physician. This represents an Insecure Direct Object Reference (IDOR) vulnerability where any physician could delete or alter clinical notes and diagnosis statuses belonging to other physicians' patients. Enforcing record ownership guarantees tenant isolation and data privacy.

## Current state

- `src/lib/actions.ts:707-735`:

```typescript
export async function deleteResult(
  _previousState: PreviousState,
  formData: FormData,
): Promise<Message> {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "doctor" && currentUser?.role !== "admin") {
    return {
      message: "Unauthorized: doctor access required.",
      success: false,
    };
  }

  const userId = formData.get("result-id");

  // Deletes result without checking results.doctor_id === currentUser.user_id!
  await db
    .delete(results)
    .where(eq(results.result_id, parseInt(String(userId), 10)))
    .execute();
```

## Commands you will need

| Purpose    | Command              | Expected on success |
| ---------- | -------------------- | ------------------- |
| Typecheck  | `bun x tsc --noEmit` | exit 0, no errors   |
| Lint Check | `bun run lint`       | exit 0, 0 errors    |

## Scope

**In scope** (the only files you should modify):

- `src/lib/actions.ts`

**Out of scope** (do NOT touch):

- Database schema (`src/lib/db-schema.ts`).
- UI delete button component (`src/app/doctor/results/[id]/delete-button.tsx`).

## Git workflow

- Branch: `feat/015-enforce-tenant-scoping-delete-result`
- Commit message: `security(actions): enforce physician ownership on result deletion and reviews`

## Steps

### Step 1: Add ownership verification to `deleteResult`

In `src/lib/actions.ts:deleteResult`:

1. Parse `resultId` safely:
   ```typescript
   const rawResultId = formData.get("result-id");
   const resultId = Number(rawResultId);
   if (!resultId || Number.isNaN(resultId)) {
     return { message: "Invalid result ID.", success: false };
   }
   ```
2. Fetch the existing result:
   ```typescript
   const [existingResult] = await db.select().from(results).where(eq(results.result_id, resultId));

   if (!existingResult) {
     return { message: "Result not found.", success: false };
   }
   ```
3. Enforce authorization check:
   ```typescript
   if (currentUser.role !== "admin" && existingResult.doctor_id !== currentUser.user_id) {
     return {
       message: "Unauthorized: you can only delete your own diagnostic records.",
       success: false,
     };
   }
   ```
4. Execute delete and revalidate paths.

**Verify**: `bun x tsc --noEmit` → exit 0

### Step 2: Add ownership verification to `updateResultReview`

In `src/lib/actions.ts:updateResultReview`:

1. After parsing `updateResultReviewSchema`, look up `existingResult` from `results` where `eq(results.result_id, parsed.data.result_id)`.
2. Verify `if (currentUser.role !== "admin" && existingResult.doctor_id !== currentUser.user_id)`:
   ```typescript
   return {
     message: "Unauthorized: you can only review records for your assigned patients.",
     success: false,
   };
   ```

**Verify**: `bun run lint` → exit 0

## Done criteria

- [ ] A doctor cannot delete another doctor's diagnostic records.
- [ ] A doctor cannot edit clinical notes or review status of another doctor's records.
- [ ] Admins retain full operational management permissions.
- [ ] `bun x tsc --noEmit` exits 0.
- [ ] `bun run lint` exits 0.

## STOP conditions

Stop and report back if:

- Shared practice collaboration requires multi-doctor review permissions without admin role (this would require a practice group or delegation schema).
