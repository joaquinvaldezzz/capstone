# Plan 001: Fix Lint & Typecheck Verification Baseline and Critical Runtime Crashes

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 1968e3d..HEAD -- eslint.config.mjs prettier.config.js package.json next.config.js src/lib/actions.ts src/app/patient/result/[id]/page.tsx src/hooks/use-mail.ts src/types/nav.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `1968e3d`, 2026-09-12
- **Issue**: https://github.com/joaquinvaldezzz/capstone/issues/15
- **Status**: DONE (verified commit `5f33768` on branch `advisor/001-fix-verification-baseline`)

## Why this matters

Currently, the project has no working verification baseline: `npm run lint` crashes with `TypeError: a.startsWith is not a function`, and `tsc --noEmit` fails with over 300 type errors. Because of this, `next.config.js` enables `typescript: { ignoreBuildErrors: true }`, masking broken pages and compilation regressions in production. Furthermore, patients visiting `/patient/result/[id]` hit an immediate uncaught `ReferenceError: React is not defined` crash at runtime. Establishing a clean lint and typecheck gate is the prerequisite for all subsequent security and performance plans.

## Current state

The relevant files and current defects:

- `eslint.config.mjs`: Line 98 includes `eslint-plugin-prettier`, which conflicts with `prettier-plugin-embed` and `prettier-plugin-jsdoc` parser definitions.
- `package.json`: Line 11 specifies `"lint": "eslint . --ext .js,.jsx,.ts,.tsx"`. The `--ext` option is deprecated and invalid in ESLint 9 flat config.
- `prettier.config.js`: Lines 9-10 load `prettier-plugin-embed` and `prettier-plugin-jsdoc`, which wrap Babel parsers in ways that crash `eslint-plugin-prettier`.
- `src/app/patient/result/[id]/page.tsx`: Lines 78 and 86 use `<React.Fragment>`, but line 1 only imports `{ Fragment } from 'react'`, causing a runtime ReferenceError.
- `src/lib/actions.ts`: Lines 48, 123, 205, 265, 304, 345, 407, 480 attempt to read `parsedData.data` inside `if (!parsedData.success)` blocks. On parse failure, Zod returns a `SafeParseError` which does not contain `.data`.
- `src/hooks/use-mail.ts`: Line 1 imports `@/_app/(dashboards)/patient/data`, a non-existent path leftover from a shadcn example template.
- `src/types/nav.ts`: Line 6 references `JSX.IntrinsicElements` without importing the `React` namespace.
- `next.config.js`: Line 33 sets `typescript: { ignoreBuildErrors: true }`.

Exemplar excerpts:

`src/app/patient/result/[id]/page.tsx:77-86`:

```tsx
{result?.diagnosis === 'Infected' ? (
  <React.Fragment>
    Your test results are available. We have determined a{' '}
    <span className="font-semibold text-gray-900">{result.percentage}</span> chance of
    infection based on the ultrasound image provided. You have been diagnosed with an{' '}
    <span className="font-semibold text-gray-900">infection</span>. Please consult with
    your doctor for further information.
  </React.Fragment>
) : (
  <React.Fragment>
```

`src/lib/actions.ts:44-50`:

```typescript
// If the form data is invalid, return an error message
if (!parsedData.success) {
  return {
    message: 'Invalid form data.',
    fields: parsedData.data,
  }
}
```

## Commands you will need

| Purpose   | Command              | Expected on success |
| --------- | -------------------- | ------------------- |
| Lint      | `bun run lint`       | exit 0, no crashes  |
| Typecheck | `bun x tsc --noEmit` | exit 0, 0 errors    |
| Build     | `bun run build`      | exit 0, successful  |

## Scope

**In scope**:

- `prettier.config.js`
- `package.json`
- `src/app/patient/result/[id]/page.tsx`
- `src/lib/actions.ts`
- `src/hooks/use-mail.ts`
- `src/types/nav.ts`
- `src/components/ui/calendar.tsx`
- `src/components/add-patient-form.tsx`
- `src/components/confusion-matrix-button.tsx`
- `src/components/log-out-button.tsx`
- `next.config.js`

**Out of scope**:

- Do NOT rewrite authentication logic or session management in this plan (covered in Plan 002).
- Do NOT alter database schemas or migrations.
- Do NOT touch `index.py`.

## Git workflow

- Branch: `advisor/001-fix-verification-baseline`
- Commit style: Conventional Commits, e.g. `fix(dx): resolve eslint crash and typescript compiler errors`
- Do NOT push or open a PR unless instructed by the operator.

## Steps

### Step 1: Fix ESLint CLI script and remove conflicting Prettier plugins

1. In `package.json`, update line 11:
   Change `"lint": "eslint . --ext .js,.jsx,.ts,.tsx"` to `"lint": "eslint ."`.
2. In `prettier.config.js`, remove `'prettier-plugin-embed'` and `'prettier-plugin-jsdoc'` from the `plugins` array.

**Verify**: `bun run lint` → does not throw `TypeError: a.startsWith is not a function`.

### Step 2: Fix runtime Fragment crash in patient result page

In `src/app/patient/result/[id]/page.tsx`:
Replace `<React.Fragment>` at lines 78 and 86 with `<Fragment>` (already imported at line 1) or standard `<>` and `</>` fragments.

**Verify**: `grep -rn "React.Fragment" src/app/patient/result/` → returns no matches.

### Step 3: Fix parsedData.data error access in server actions

In `src/lib/actions.ts`:
At all 8 failure branches where `!parsedData.success` is checked (lines 48, 123, 205, 265, 304, 345, 407, 480):
Replace `fields: parsedData.data` with `fields: formValues as Record<string, string | number | Date>` or omit `fields`.

**Verify**: `grep -rn "parsedData.data" src/lib/actions.ts` → only appears AFTER `if (!parsedData.success)` return checks, never inside.

### Step 4: Remove orphaned hook and fix type declarations

1. Delete dead file `src/hooks/use-mail.ts`.
2. In `src/types/nav.ts`, import `React` and update `JSX.IntrinsicElements` to `React.JSX.IntrinsicElements`.
3. In `src/components/ui/calendar.tsx`, adjust react-day-picker v9 icon/chevron component types to match the installed library props.
4. In `src/components/add-patient-form.tsx`, `src/components/confusion-matrix-button.tsx`, and `src/components/log-out-button.tsx`, resolve invalid prop typings (`hierarchy`, `icon`, size `"md"`).

**Verify**: `bun x tsc --noEmit` → completes with 0 errors.

### Step 5: Enable strict TypeScript checking during Next.js builds

In `next.config.js`, remove `typescript: { ignoreBuildErrors: true }` or set `ignoreBuildErrors: false`.

**Verify**: `bun run build` → builds cleanly with TypeScript validation enabled.

## Test plan

- Verify lint passes: `bun run lint`
- Verify typecheck passes: `bun x tsc --noEmit`
- Verify production build succeeds: `bun run build`

## Done criteria

- [ ] `bun run lint` exits 0 without error
- [ ] `bun x tsc --noEmit` exits 0 with 0 type errors
- [ ] `next.config.js` does NOT contain `ignoreBuildErrors: true`
- [ ] `grep -rn "React.Fragment" src/app/patient/result/` returns 0 results
- [ ] `plans/README.md` status updated to DONE

## STOP conditions

- If fixing calendar or button component types requires breaking public component API contracts used across many routes, STOP and report.
- If removing `prettier-plugin-embed` or `prettier-plugin-jsdoc` alters formatting across more than 5 files during `bun run format`, STOP and report.

## Maintenance notes

- Any future Next.js or React 19 upgrade must keep `typescript.ignoreBuildErrors: false` to ensure type errors fail CI builds immediately.
