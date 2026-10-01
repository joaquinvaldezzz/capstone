# Plan 017: Centralize Vercel Blob Storage URL Construction and Environment Configuration

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 0726f2d..HEAD -- src/lib/utils.ts src/components/medical-report-template.tsx src/app/doctor/columns.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/011-clean-lint-baseline-and-shadcn-rules.md
- **Category**: tech-debt
- **Planned at**: commit `0726f2d`, 2026-10-01
- **Issue**: —

## Why this matters

The Vercel Blob storage host URL (`https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com`) is hardcoded across 20 separate React components and pages. If blob store tokens rotate, new environments (preview, staging, local MinIO/mock) are provisioned, or the domain format changes, all medical images and avatars across the application fail to render. Centralizing URL construction behind a utility helper and environment variable ensures maintainability and multi-environment portability.

## Current state

- Hardcoded string `https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com` found in 20 locations, including:
  - `src/components/medical-report-template.tsx:26`
  - `src/app/doctor/columns.tsx:33,57`
  - `src/app/doctor/results/[id]/page.tsx:114,170`
  - `src/app/patient/result/[id]/page.tsx:47,106`
  - `src/app/patient/_components/nav-user.tsx:41,64`
  - `src/app/doctor/_components/nav-user.tsx:49,72`
  - `src/app/admin/users/columns.tsx:24`
- `src/lib/actions.ts:422`: Profile picture uploads pass `addRandomSuffix: false`, causing file overwrites.

## Commands you will need

| Purpose     | Command                            | Expected on success |
| ----------- | ---------------------------------- | ------------------- |
| Typecheck   | `bun x tsc --noEmit`               | exit 0, no errors   |
| Lint Check  | `bun run lint`                     | exit 0, 0 errors    |
| Code Search | `grep -rn "x5l8gkuguvp5hvw9" src/` | 0 matches           |

## Scope

**In scope** (the only files you should modify):

- `src/lib/utils.ts`
- `src/lib/actions.ts`
- All files referencing the hardcoded blob domain under `src/app/` and `src/components/`
- `.env.example`

**Out of scope** (do NOT touch):

- `next.config.js` remotePatterns (keep wildcard `**.vercel-storage.com`).

## Git workflow

- Branch: `feat/017-centralize-blob-storage-urls`
- Commit message: `refactor(blob): centralize storage url helper and configure environment base`

## Steps

### Step 1: Add `getBlobUrl` helper in `src/lib/utils.ts`

In `src/lib/utils.ts`, export a centralized helper:

```typescript
const BLOB_BASE_URL =
  process.env.NEXT_PUBLIC_BLOB_BASE_URL ??
  "https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com";

export function getBlobUrl(
  folder: "ultrasound-images" | "profile-pictures",
  pathOrFilename: string | null | undefined,
): string {
  if (!pathOrFilename) return "";
  if (pathOrFilename.startsWith("http://") || pathOrFilename.startsWith("https://")) {
    return pathOrFilename;
  }
  const cleanPath = pathOrFilename.replace(/^\/+/, "");
  return `${BLOB_BASE_URL}/${folder}/${cleanPath}`;
}
```

Also document `NEXT_PUBLIC_BLOB_BASE_URL` in `.env.example`.

**Verify**: `bun x tsc --noEmit` → exit 0

### Step 2: Replace hardcoded strings across all 20 files

Replace raw template literals with `getBlobUrl("profile-pictures", ...)` and `getBlobUrl("ultrasound-images", ...)` in:

1. `src/components/medical-report-template.tsx`
2. `src/app/doctor/columns.tsx`
3. `src/app/doctor/results/[id]/page.tsx`
4. `src/app/doctor/_components/nav-user.tsx`
5. `src/app/patient/result/[id]/page.tsx`
6. `src/app/patient/_components/nav-user.tsx`
7. `src/app/admin/columns.tsx`
8. `src/app/admin/users/columns.tsx`
9. `src/app/admin/users/[id]/profile-form.tsx`
10. `src/app/admin/users/[id]/forms.tsx`
11. `src/app/doctor/settings/profile/profile-form.tsx`
12. `src/app/patient/settings/profile/profile-form.tsx`
13. `src/app/admin/settings/profile/profile-form.tsx`
14. `src/components/nav-user.tsx`

### Step 3: Enable `addRandomSuffix: true` for profile pictures in `actions.ts`

In `src/lib/actions.ts:updateProfile`, change `addRandomSuffix: false` to `addRandomSuffix: true` and save the resulting pathname to avoid collisions.

**Verify**:

- `grep -rn "x5l8gkuguvp5hvw9" src/` → only exists as fallback in `src/lib/utils.ts`
- `bun run lint` → exit 0

## Done criteria

- [ ] All components utilize `getBlobUrl` instead of inline domain literals.
- [ ] Profile picture uploads avoid file collision via random suffix.
- [ ] `bun x tsc --noEmit` exits 0.
- [ ] `bun run lint` exits 0.

## STOP conditions

Stop and report back if:

- Next.js image optimization throws domain errors with the dynamic URL.
