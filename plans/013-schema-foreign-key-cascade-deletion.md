# Plan 013: Configure Foreign Key Cascade Rules and Clean User Deletion

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 0726f2d..HEAD -- src/lib/db-schema.ts src/lib/actions.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/011-clean-lint-baseline-and-shadcn-rules.md
- **Category**: bug
- **Planned at**: commit `0726f2d`, 2026-10-01
- **Issue**: —

## Why this matters

Currently, invoking `deleteAccount` (`src/lib/actions.ts:651`) or `deleteUser` (`src/lib/actions.ts:685`) on any user account that has records in `results`, `sessions`, `password_reset_tokens`, or `user_information` triggers an unhandled Postgres foreign key constraint violation (`23503: foreign_key_violation`). Adding `{ onDelete: "cascade" }` to Drizzle schema foreign key definitions and wrapping user deletion in consistent transactions ensures data integrity and prevents unhandled server errors during user/account management.

## Current state

- `src/lib/db-schema.ts`:
  - `userInformation.user_id`: `.references(() => users.user_id)` (missing `onDelete: "cascade"`)
  - `sessions.user_id`: `.references(() => users.user_id)` (missing `onDelete: "cascade"`)
  - `results.user_id`: `.references(() => users.user_id)` (missing `onDelete: "cascade"`)
  - `results.doctor_id`: `.references(() => users.user_id)` (missing `onDelete: "cascade"`)
  - `passwordResetTokens.user_id`: `.references(() => users.user_id)` (missing `onDelete: "cascade"`)
- `src/lib/actions.ts:651`: `deleteAccount` directly calls `db.delete(users).where(eq(users.user_id, currentUser.user_id))`.
- `src/lib/actions.ts:685-695`: `deleteUser` manually deletes from `user_information` and `users`, but leaves `sessions`, `results`, and `password_reset_tokens` unhandled.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `bun x tsc --noEmit` | exit 0, no errors |
| Lint Check | `bun run lint` | exit 0, 0 errors |

## Scope

**In scope** (the only files you should modify):
- `src/lib/db-schema.ts`
- `src/lib/actions.ts`

**Out of scope** (do NOT touch):
- Database connection configuration (`src/lib/db.ts`).
- UI forms calling `deleteAccount` or `deleteUser`.

## Git workflow

- Branch: `feat/013-schema-foreign-key-cascades`
- Commit message: `fix(schema): add foreign key cascades and transactional user deletion`

## Steps

### Step 1: Add `onDelete: "cascade"` to all foreign key references in `db-schema.ts`

Update `src/lib/db-schema.ts` so that each foreign key explicitly declares `{ onDelete: "cascade" }`:
```typescript
export const userInformation = pgTable("user_information", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => users.user_id, { onDelete: "cascade" })
    .notNull(),
  ...
});

export const sessions = pgTable("sessions", {
  session_id: serial("session_id").primaryKey(),
  user_id: integer("user_id")
    .references(() => users.user_id, { onDelete: "cascade" })
    .notNull(),
  ...
});

export const results = pgTable("results", {
  result_id: serial("result_id").primaryKey(),
  doctor_id: integer("doctor_id")
    .references(() => users.user_id, { onDelete: "cascade" })
    .notNull(),
  user_id: integer("user_id")
    .references(() => users.user_id, { onDelete: "cascade" })
    .notNull(),
  ...
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => users.user_id, { onDelete: "cascade" })
    .notNull(),
  ...
});
```

**Verify**: `bun x tsc --noEmit` → exit 0

### Step 2: Refactor `deleteUser` and `deleteAccount` in `src/lib/actions.ts`

In `src/lib/actions.ts`:
1. In `deleteAccount`:
   - Delete related session cookie (`await deleteSession()`) if account deletion is successful, or clean up properly.
   - Execute deletion: `await db.delete(users).where(eq(users.user_id, currentUser.user_id)).execute();`
2. In `deleteUser`:
   - Validate target `user-id` from formData is parsed as an integer (`const targetId = Number(formData.get("user-id"))`).
   - Guard against NaN or missing ID.
   - Use standard Drizzle delete: `await db.delete(users).where(eq(users.user_id, targetId)).execute();`

**Verify**: `bun run lint` → exit 0

## Done criteria

- [ ] All foreign keys in `src/lib/db-schema.ts` specify `{ onDelete: "cascade" }`.
- [ ] `deleteUser` and `deleteAccount` execute cleanly without manual fragmented SQL queries.
- [ ] `bun x tsc --noEmit` exits 0.
- [ ] `bun run lint` exits 0.

## STOP conditions

Stop and report back if:
- Drizzle Kit migration / push script is required in production environment before runtime schema changes.
