# Plan 012: Enforce Authenticated Session Scoping on Password Updates

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 0726f2d..HEAD -- src/lib/actions.ts src/app/doctor/settings/password/ src/app/patient/settings/password/ src/app/admin/settings/password/`
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

In `updatePassword` (`src/lib/actions.ts:450-509`), the target account is identified via `Number(formData.get("id"))` without checking the caller's authenticated session (`getCurrentUser()`). In contrast to `updateAccount` and `updateProfile`, which strictly verify `currentUser`, an attacker or tampering client could manipulate the form payload. Binding password modification directly to the authenticated session prevents privilege escalation and IDOR attacks.

## Current state

- `src/lib/actions.ts:449-509`:
```typescript
export async function updatePassword(
  _previousState: PreviousState,
  formData: FormData,
): Promise<Message> {
  const formValues = Object.fromEntries(formData);
  const parsedData = updatePasswordFormSchema.safeParse(formValues);
  ...
  const existingAccount = await db
    .select()
    .from(users)
    .where(eq(users.user_id, Number(formData.get("id"))));
  ...
  await db
    .update(users)
    .set({
      password: hashedPassword,
      date_modified: new Date(),
    })
    .where(eq(users.user_id, Number(formData.get("id"))))
    .execute();
```
- Exemplar: `updateAccount` in `src/lib/actions.ts:330-362` checks `const currentUser = await getCurrentUser(); if (!currentUser) return { message: "Unauthorized.", success: false };` and scopes queries to `currentUser.user_id`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `bun x tsc --noEmit` | exit 0, no errors |
| Lint Check | `bun run lint` | exit 0, 0 errors |

## Scope

**In scope** (the only files you should modify):
- `src/lib/actions.ts`

**Out of scope** (do NOT touch):
- `src/lib/actions.ts:signUp` or public `resetPassword` flows.
- Password form UI components unless hidden `id` removal is required.

## Git workflow

- Branch: `feat/012-secure-password-update`
- Commit message: `security(actions): enforce session authentication on updatePassword`

## Steps

### Step 1: Add session verification to `updatePassword`

In `src/lib/actions.ts:updatePassword`:
1. Call `const currentUser = await getCurrentUser();` at the beginning of the function.
2. If `currentUser == null`, immediately return:
   ```typescript
   if (!currentUser) {
     return {
       message: "Unauthorized.",
       success: false,
     };
   }
   ```
3. Look up existing password hash strictly using `currentUser.user_id`:
   ```typescript
   const [existingAccount] = await db
     .select()
     .from(users)
     .where(eq(users.user_id, currentUser.user_id));

   if (!existingAccount) {
     return {
       message: "User account not found.",
       success: false,
     };
   }
   ```
4. Perform the update strictly where `eq(users.user_id, currentUser.user_id)`.
5. Remove any reliance on untrusted `formData.get("id")`.

**Verify**: `bun x tsc --noEmit` → exit 0

### Step 2: Ensure correct path revalidation

Update `revalidatePath` to revalidate the appropriate settings routes:
```typescript
revalidatePath("/admin/settings/password");
revalidatePath("/doctor/settings/password");
revalidatePath("/patient/settings/password");
```

**Verify**: `bun run lint` → exit 0

## Done criteria

- [ ] `updatePassword` rejects unauthenticated requests with `{ success: false, message: "Unauthorized." }`.
- [ ] Password updates are strictly scoped to `currentUser.user_id`.
- [ ] No occurrences of `formData.get("id")` in `updatePassword`.
- [ ] `bun x tsc --noEmit` exits 0.
- [ ] `bun run lint` exits 0.

## STOP conditions

Stop and report back if:
- An admin requires changing other users' passwords through `updatePassword` (if so, a separate `adminUpdateUserPassword` action should be created with role verification).
