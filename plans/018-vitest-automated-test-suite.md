# Plan 018: Establish Automated Test Suite for Auth, Schemas, and Utilities

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 0726f2d..HEAD -- package.json src/lib/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/011-clean-lint-baseline-and-shadcn-rules.md
- **Category**: tests
- **Planned at**: commit `0726f2d`, 2026-10-01
- **Issue**: —

## Why this matters

The project currently has zero automated tests. Critical domain logic — including Zod form validation rules, JWT cryptographic session generation/decryption, email template rendering, and utility URL construction — must be manually regression-tested. Configuring a fast test runner (Vitest or Bun test) and creating initial unit tests for pure domain functions establishes a regression safety net for all future changes.

## Current state

- `package.json` scripts:

```json
"scripts": {
  "build": "next build",
  "dev": "concurrently 'npm run next:dev' 'npm run drizzle:studio'",
  "drizzle:push": "drizzle-kit push",
  "drizzle:studio": "drizzle-kit studio",
  "format": "prettier --write .",
  "lint": "eslint .",
  "lint:fix": "eslint --fix .",
  "next:dev": "next dev --turbo",
  "preview": "npm run build && npm run start",
  "start": "next start"
}
```

- Core pure libraries needing test suites:
  - `src/lib/form-schema.ts` (validation rules for registration, password strength, results)
  - `src/lib/session.ts` (JWT token signing, expiration, and payload decryption)
  - `src/lib/utils.ts` (CSS class merging, badge mappings, blob URLs)
  - `src/lib/email.ts` (Email body generation and parameterization)

## Commands you will need

| Purpose    | Command              | Expected on success    |
| ---------- | -------------------- | ---------------------- |
| Run Tests  | `bun test`           | all tests pass, exit 0 |
| Typecheck  | `bun x tsc --noEmit` | exit 0, no errors      |
| Lint Check | `bun run lint`       | exit 0, 0 errors       |

## Scope

**In scope** (the only files you should modify):

- `package.json`
- `src/lib/__tests__/form-schema.test.ts` (create)
- `src/lib/__tests__/session.test.ts` (create)
- `src/lib/__tests__/utils.test.ts` (create)
- `src/lib/__tests__/email.test.ts` (create)

**Out of scope** (do NOT touch):

- Application routes or UI components.

## Git workflow

- Branch: `feat/018-automated-test-suite`
- Commit message: `test(unit): add bun test runner and unit tests for core libraries`

## Steps

### Step 1: Add `"test": "bun test"` script to `package.json`

Add the test command to `package.json`:

```json
"scripts": {
  "test": "bun test",
  ...
}
```

**Verify**: `bun test` → runs runner cleanly.

### Step 2: Create unit tests for form schemas (`src/lib/__tests__/form-schema.test.ts`)

Write comprehensive tests using `describe` and `it` / `test`:

- Validates password complexity regex (min 8 chars, letter, number, special char).
- Validates password confirmation equality refinement.
- Validates patient result and review schemas (`PENDING_REVIEW`, `VERIFIED`, `REVISED`).
- Validates invalid inputs return structured errors.

**Verify**: `bun test src/lib/__tests__/form-schema.test.ts` → all pass.

### Step 3: Create unit tests for session, utils, and email

1. `src/lib/__tests__/session.test.ts`: Test `encrypt` and `decrypt` roundtrip with mock JWT secret, and confirm expired/tampered tokens return `null`.
2. `src/lib/__tests__/utils.test.ts`: Test `cn`, `determineBadgeColor`, and `getBlobUrl`.
3. `src/lib/__tests__/email.test.ts`: Test `sendPasswordResetEmail` and `sendResultReadyEmail` output HTML and text formatting.

**Verify**: `bun test` → all unit test suites pass.

## Done criteria

- [ ] `bun test` runs and passes with exit code 0.
- [ ] Schema validation, session encryption, and utility helpers have full unit coverage.
- [ ] `bun x tsc --noEmit` exits 0.
- [ ] `bun run lint` exits 0.
- [ ] `plans/README.md` updated.

## STOP conditions

Stop and report back if:

- Bun test runner has environment incompatibilities with Node.js crypto / jose modules in this runtime.
