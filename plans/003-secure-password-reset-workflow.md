# Plan 003: Replace Unauthenticated Password Reset with Verified Token Workflow

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 1968e3d..HEAD -- src/lib/actions.ts src/lib/form-schema.ts src/components/forgot-password-form.tsx src/app/forgot-password/page.tsx src/lib/db-schema.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/001-fix-verification-baseline.md
- **Category**: security
- **Planned at**: commit `1968e3d`, 2026-09-12
- **Issue**: https://github.com/joaquinvaldezzz/capstone/issues/17

## Why this matters

The current password reset implementation in `src/lib/actions.ts:469-520` allows any unauthenticated user to submit an email and a new password, immediately overwriting that account's password in the database without any token, email verification, or identity check. This allows immediate, unauthenticated account takeover of any administrator, doctor, or patient account. A cryptographically secure, time-limited tokenized reset flow is necessary to protect user accounts.

## Current state

The relevant files:

- `src/lib/actions.ts:469-520` — `forgotPassword` takes email and new password directly from client form data and executes an immediate password update in PostgreSQL.
- `src/lib/form-schema.ts:167-200` — `forgotPasswordFormSchema` couples email and new password into a single initial form submission.
- `src/components/forgot-password-form.tsx` — renders both email and new password inputs together on the initial forgot password page.
- `src/lib/db-schema.ts` — contains `users`, `userInformation`, `sessions`, `results`, but no `password_reset_tokens` table.

Exemplar excerpts:

`src/lib/actions.ts:488-511`:

```typescript
// Check if the email exists in the database
const existingAccount = await db.select().from(users).where(eq(users.email, email))

// If the email does not exist in the database, return an error message
if (existingAccount.length === 0) {
  return {
    message: 'That email address does not exist.',
    success: false,
    fields: parsedData.data,
  }
}

// If the email exists in the database, hash the new password before storing it
const hashedPassword = await bcrypt.hash(newPassword, 10)

// Then update the user's password in the database
await db
  .update(users)
  .set({
    password: hashedPassword,
    date_modified: new Date(),
  })
  .where(eq(users.email, email))
  .execute()
```

## Commands you will need

| Purpose     | Command                | Expected on success |
| ----------- | ---------------------- | ------------------- |
| Push schema | `bun run drizzle:push` | schema synced       |
| Lint        | `bun run lint`         | exit 0, no errors   |
| Typecheck   | `bun x tsc --noEmit`   | exit 0, no errors   |

## Scope

**In scope**:

- `src/lib/db-schema.ts`
- `src/lib/form-schema.ts`
- `src/lib/actions.ts`
- `src/components/forgot-password-form.tsx`
- `src/app/forgot-password/page.tsx`
- `src/app/reset-password/page.tsx` (create)

**Out of scope**:

- Do NOT change session authentication logic or cookie expiration (covered in Plan 002).
- Do NOT modify user registration or profile updating actions.

## Git workflow

- Branch: `advisor/003-secure-password-reset-workflow`
- Commit style: Conventional Commits, e.g. `feat(auth): implement tokenized password reset flow`
- Do NOT push or open a PR unless instructed by the operator.

## Steps

### Step 1: Add password reset tokens table to Drizzle schema

In `src/lib/db-schema.ts`, define and export a new table:

```typescript
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .references(() => users.user_id)
    .notNull(),
  token_hash: text('token_hash').notNull(),
  expires_at: timestamp('expires_at').notNull(),
  used: timestamp('used'),
})
```

**Verify**: `bun run drizzle:push` → completes successfully.

### Step 2: Separate schemas for request reset and confirm reset

In `src/lib/form-schema.ts`:

1. Refactor `forgotPasswordFormSchema` to validate ONLY the `email` field.
2. Create `resetPasswordFormSchema` validating `token`, `password`, and `confirmPassword`.

**Verify**: `bun x tsc --noEmit` exits 0.

### Step 3: Implement requestReset and resetPassword server actions

In `src/lib/actions.ts`:

1. Refactor `forgotPassword` to:
   - Accept email only.
   - Look up user. (To avoid email enumeration, return a generic message "If an account exists, instructions have been sent.")
   - Generate high-entropy token via `crypto.randomBytes(32).toString('hex')`.
   - Store SHA-256 hash of token in `passwordResetTokens` with a 15-minute expiration.
   - In development/demo environments, log or send the reset link: `/reset-password?token=<token>`.
2. Add `resetPassword`:
   - Hash incoming token with SHA-256 and look up unexpired, unused token in `passwordResetTokens`.
   - If invalid or expired, return an error message.
   - Hash the new password with `bcrypt.hash(newPassword, 10)` and update `users.password`.
   - Mark token as `used = new Date()`.

**Verify**: `bun run lint && bun x tsc --noEmit` exits 0.

### Step 4: Update UI forms

1. In `src/components/forgot-password-form.tsx`, remove the new password field, displaying only the email input and a success confirmation message.
2. Create `src/app/reset-password/page.tsx` accepting `token` from search params and rendering a password reset confirmation form.

**Verify**: `bun run build` exits 0.

## Test plan

- Test submitting `forgotPassword` with valid email &rarr; token hash stored in `passwordResetTokens` with 15m expiration.
- Test visiting `/reset-password?token=invalid` &rarr; rejected with error.
- Test completing password reset with valid token &rarr; updates password, marks token used, and subsequent reuse attempt is rejected.

## Done criteria

- [x] `forgotPassword` no longer accepts `newPassword` or directly mutates `users.password`
- [x] Reset tokens are cryptographically generated and single-use
- [x] `bun run lint && bun x tsc --noEmit && bun run build` all exit 0
- [x] `plans/README.md` status updated to DONE

## STOP conditions

- If external email provider integration is required before landing this plan, configure a local logging fallback for token delivery rather than blocking the security fix.

## Maintenance notes

- Add a scheduled cleanup cron in the future to purge expired rows from `password_reset_tokens`.
