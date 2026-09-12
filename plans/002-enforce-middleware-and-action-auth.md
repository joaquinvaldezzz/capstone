# Plan 002: Enforce Next.js Middleware Route Protection and Server Action Authorization

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 1968e3d..HEAD -- src/proxy.ts src/app/admin/layout.tsx src/app/doctor/layout.tsx src/app/patient/layout.tsx src/lib/actions.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-fix-verification-baseline.md
- **Category**: security
- **Planned at**: commit `1968e3d`, 2026-09-12
- **Issue**: https://github.com/joaquinvaldezzz/capstone/issues/16

## Why this matters

The application relies on `src/proxy.ts` for route protection, but Next.js only executes `src/middleware.ts` or `middleware.ts`. Because of this, middleware is completely bypassed in production. Furthermore, the route check `['/admin', '/doctor', '/patient'].includes(currentPath)` only tests exact matches, leaving all nested subpaths (e.g. `/admin/users`, `/doctor/results`, `/patient/result/[id]`) unauthenticated. Lastly, mutating server actions in `src/lib/actions.ts` (`updateUser`, `deleteUser`, `deleteResult`) trust client-supplied form IDs without verifying caller authentication or role privileges.

## Current state

The relevant files:

- `src/proxy.ts` — contains the middleware implementation but is misnamed and uses exact path comparison instead of prefix matching.
- `src/app/admin/layout.tsx` — verifies user is authenticated but does not verify `currentUser.role === 'admin'`.
- `src/app/doctor/layout.tsx` — verifies user is authenticated but does not verify `currentUser.role === 'doctor'`.
- `src/app/patient/layout.tsx` — verifies user is authenticated but does not verify `currentUser.role === 'patient'`.
- `src/lib/actions.ts` — `updateUser` (line 254), `updateAccount` (line 293), `updateProfile` (line 334), `deleteAccount` (line 522), `deleteUser` (line 551), and `deleteResult` (line 580) execute mutations directly from `formData.get('id')` without verifying `verifySession()`.

Exemplar excerpts:

`src/proxy.ts:15-25`:

```typescript
export default async function proxy(request: NextRequest) {
  // Specify protected and public routes
  const protectedRoutes = ['/admin', '/doctor', '/patient']
  const publicRoutes = ['/']

  // Get the current path from the request
  const currentPath = request.nextUrl.pathname

  // Check if the current route is protected or public
  const isProtectedRoute = protectedRoutes.includes(currentPath)
```

`src/lib/actions.ts:551-569`:

```typescript
export async function deleteUser(
  _previousState: PreviousState,
  formData: FormData,
): Promise<Message> {
  const userId = formData.get('user-id')

  // Delete the user from the database
  await db.execute(sql`
    DELETE FROM "user_information"
    WHERE
      "user_id" = ${userId};
  `)
```

## Commands you will need

| Purpose   | Command              | Expected on success |
| --------- | -------------------- | ------------------- |
| Lint      | `bun run lint`       | exit 0, no errors   |
| Typecheck | `bun x tsc --noEmit` | exit 0, no errors   |
| Build     | `bun run build`      | exit 0, successful  |

## Scope

**In scope**:

- `src/middleware.ts` (create by migrating `src/proxy.ts`)
- `src/proxy.ts` (delete)
- `src/app/admin/layout.tsx`
- `src/app/doctor/layout.tsx`
- `src/app/patient/layout.tsx`
- `src/lib/actions.ts`

**Out of scope**:

- Password reset token verification (covered in Plan 003).
- Ultrasound file storage access mode (covered in Plan 004).

## Git workflow

- Branch: `advisor/002-enforce-middleware-and-action-auth`
- Commit style: Conventional Commits, e.g. `feat(auth): migrate proxy to middleware and enforce subpath authorization`
- Do NOT push or open a PR unless instructed by the operator.

## Steps

### Step 1: Migrate `src/proxy.ts` to `src/middleware.ts` with prefix route matching

1. Rename `src/proxy.ts` to `src/middleware.ts`.
2. Update the default export function name to `middleware`.
3. Update route matching logic so protected routes match the path or any subpath:
   ```typescript
   const protectedRoutes = ["/admin", "/doctor", "/patient"];
   const isProtectedRoute = protectedRoutes.some(
     (route) => currentPath === route || currentPath.startsWith(`${route}/`),
   );
   ```
4. Verify role isolation:
   If `session.userRole === 'admin'`, redirect when `!currentPath.startsWith('/admin')`.
   If `session.userRole === 'doctor'`, redirect when `!currentPath.startsWith('/doctor')`.
   If `session.userRole === 'patient'`, redirect when `!currentPath.startsWith('/patient')`.

**Verify**: `test -f src/middleware.ts && ! test -f src/proxy.ts` exits 0.

### Step 2: Add defensive role checks in server layouts

1. In `src/app/admin/layout.tsx`:
   Check `if (currentUser.role !== 'admin') redirect('/')`.
2. In `src/app/doctor/layout.tsx`:
   Check `if (currentUser.role !== 'doctor') redirect('/')`.
3. In `src/app/patient/layout.tsx`:
   Check `if (currentUser.role !== 'patient') redirect('/')`.

**Verify**: `bun x tsc --noEmit` exits 0.

### Step 3: Enforce session and authorization in mutating server actions

In `src/lib/actions.ts`:

1. In `updateAccount`, `updateProfile`, `deleteAccount`:
   Call `const currentUser = await getCurrentUser(); if (!currentUser) return { message: 'Unauthorized.', success: false };`
   Use `currentUser.user_id` as the target ID instead of blindly trusting `formData.get('id')` for self-updates.
2. In `updateUser` and `deleteUser`:
   Call `const currentUser = await getCurrentUser(); if (!currentUser || currentUser.role !== 'admin') return { message: 'Unauthorized: admin access required.', success: false };`
3. In `deleteResult`:
   Call `const currentUser = await getCurrentUser(); if (!currentUser || (currentUser.role !== 'doctor' && currentUser.role !== 'admin')) return { message: 'Unauthorized: doctor access required.', success: false };`

**Verify**: `bun run lint && bun x tsc --noEmit` exits 0.

## Test plan

- Test unauthenticated visit to `/admin/users` &rarr; redirects to `/`.
- Test doctor accessing `/admin` &rarr; redirects to `/doctor`.
- Test patient accessing `/doctor/results` &rarr; redirects to `/patient`.
- Test invoking `deleteUser` without admin session &rarr; returns `{ message: 'Unauthorized: admin access required.', success: false }`.

## Done criteria

- [x] `src/middleware.ts` exists and `src/proxy.ts` is deleted
- [x] Nested subpaths under `/admin`, `/doctor`, and `/patient` require authentication
- [x] Mutating server actions verify `currentUser` and role before writing to the database
- [x] `bun run lint && bun x tsc --noEmit` exits 0
- [x] `plans/README.md` status updated to DONE

## STOP conditions

- If Next.js middleware fails during build due to edge runtime imports, ensure all imports in `src/middleware.ts` are edge-compatible (`jose`, `next/server`, `next/headers`).
- If existing integration tests or seeds fail due to auth restrictions, STOP and report.

## Maintenance notes

- Any newly introduced dashboard route or server action must declare required role checks explicitly.
