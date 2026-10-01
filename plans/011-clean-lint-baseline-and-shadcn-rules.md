# Plan 011: Restore Clean ESLint Verification Baseline for UI Primitives

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 0726f2d..HEAD -- eslint.config.mjs src/components/ui/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `0726f2d`, 2026-10-01
- **Issue**: —

## Why this matters

Currently, `bun run lint` fails with over 200 errors across shadcn UI component primitives and helper files. These errors stem from strict Airbnb/TypeScript rules (such as banning namespace imports, requiring `defaultProps` in React 19 / TypeScript, and forbidding non-declaration component definitions) conflicting with Radix UI patterns. Restoring a clean `bun run lint` baseline (exit code 0) is required so that automated linters can function as CI verification gates for all future plans without masking real application bugs.

## Current state

- `eslint.config.mjs` — Flat ESLint configuration file defining base, stylistic, Next.js, and TypeScript rule sets.
- `src/components/ui/*.tsx` — shadcn UI component primitives (e.g. `sidebar.tsx`, `sheet.tsx`, `toast.tsx`, `tooltip.tsx`, `switch.tsx`) utilizing Radix UI namespace imports and TypeScript optional props without `defaultProps`.
- `src/hooks/use-toast.ts` — Toast dispatcher hook flagging `use-before-define` and `consistent-return`.

Current `eslint.config.mjs:100-119`:
```javascript
export default defineConfig([
  // Ignore .gitignore files/folder in eslint
  includeIgnoreFile(gitignorePath),
  // Javascript Config
  ...jsConfig,
  // Next Config
  ...nextConfig,
  // TypeScript Config
  ...typescriptConfig,
  // Prettier Config
  ...prettierConfig,
  // Custom rule overrides
  {
    name: "custom/overrides",
    rules: {
      // Disable problematic rule that causes crashes
      "@typescript-eslint/unified-signatures": "off",
    },
  },
]);
```

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `bun x tsc --noEmit` | exit 0, no errors |
| Lint Check | `bun run lint` | exit 0, 0 errors |
| Lint Fix | `bun run lint:fix` | exit 0 |

## Scope

**In scope** (the only files you should modify):
- `eslint.config.mjs`
- `src/hooks/use-toast.ts`
- `src/lib/session.ts`
- `svgr.d.ts`

**Out of scope** (do NOT touch):
- Do NOT rewrite or remove application logic or pages under `src/app/`.
- Do NOT disable security rules or core syntax checking.

## Git workflow

- Branch: `feat/011-clean-lint-baseline`
- Commit message: `fix(lint): configure rule overrides for ui primitives and clean baseline`

## Steps

### Step 1: Configure tailored rule overrides in `eslint.config.mjs`

In `eslint.config.mjs`, update the `custom/overrides` configuration or add a targeted override block for `src/components/ui/**` and general TypeScript/React rules that conflict with modern React 19 and Radix UI:
1. Set `"react/require-default-props": "off"` (in React 19 with TypeScript, default parameters in destructuring replace `defaultProps`).
2. Set `"import-x/no-namespace": "off"` or configure it to allow Radix UI namespace imports (e.g., `* as ToastPrimitives`, `* as TooltipPrimitives`).
3. Set `"@typescript-eslint/no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }]`.
4. Ensure no missing rule definitions (e.g. `tailwindcss/no-custom-classname` should be omitted or registered if plugin exists).

**Verify**: `bun run lint` → significantly reduced problem count.

### Step 2: Fix remaining code-level lint errors in helper files

1. In `src/lib/session.ts:112`, ensure `updateSession` returns `Promise<void>` or `null` consistently.
2. In `src/hooks/use-toast.ts`, resolve function hoisting or reordering for `dispatch` and add default branches in reducer switches.
3. In `svgr.d.ts:9`, replace `any` with `unknown` or `React.FC<React.SVGProps<SVGSVGElement>>`.

**Verify**: `bun run lint` → exit code 0, 0 errors.

### Step 3: Run full typecheck and build validation

Confirm that lint adjustments maintain TypeScript validity.

**Verify**:
- `bun x tsc --noEmit` → exit code 0
- `bun run lint` → exit code 0

## Done criteria

- [ ] `bun run lint` exits 0 with 0 errors.
- [ ] `bun x tsc --noEmit` exits 0.
- [ ] `src/components/ui/` components retain full Radix UI functionality.
- [ ] `plans/README.md` status row updated to DONE.

## STOP conditions

Stop and report back if:
- Fixing a lint issue requires removing Radix UI components or altering public component interfaces.
- `bun run build` fails as a result of lint config changes.
