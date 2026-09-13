# Plan 009: Integrate Transactional Email for Password Recovery and Diagnostic Result Notifications

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 1fa458b..HEAD -- src/lib/actions.ts .env.example package.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/003-secure-password-reset-workflow.md
- **Category**: direction
- **Planned at**: commit `1fa458b`, 2026-09-13
- **Issue**: None

## Why this matters

In Plan 003, a tokenized password reset flow was created with the `passwordResetTokens` table and `/reset-password` route. However, `forgotPassword` currently prints the reset link to `console.info` on the server terminal and sends no actual email to the user. In production, users who forget their password have no way to access the reset link and are permanently locked out of their accounts.

Similarly, when doctors upload and evaluate ultrasound scans, patients receive no notification that their medical results are ready for review.

This plan integrates a lightweight, robust email delivery utility (`src/lib/email.ts`) using Nodemailer (with support for standard SMTP or development console mode), wires it to `forgotPassword` to deliver the secure reset link, and adds an email alert when a new diagnostic result is posted.

## Current state

The relevant files:

- `src/lib/actions.ts:518-530` — In `forgotPassword`, the raw token is logged to `console.info` rather than dispatched via email:
  ```typescript
  if (existingUser) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    await db.insert(passwordResetTokens).values({
      user_id: existingUser.user_id,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
    });

    // eslint-disable-next-line no-console
    console.info("Password reset link:", `/reset-password?token=${rawToken}`);
  }
  ```
- `src/lib/actions.ts:184-192` — `addPatient` commits the new result to the database but dispatches no notification to the patient.
- `.env.example` — Lacks SMTP / email configuration variables.

## Commands you will need

| Purpose      | Command                                              | Expected on success |
| ------------ | ---------------------------------------------------- | ------------------- |
| Install deps | `bun add nodemailer && bun add -d @types/nodemailer` | exit 0              |
| Typecheck    | `bun x tsc --noEmit`                                 | exit 0, no errors   |
| Build check  | `bun run build`                                      | exit 0              |

## Scope

**In scope**:

- `package.json` — Add `nodemailer` and `@types/nodemailer`.
- `src/lib/email.ts` — Create a modular email delivery utility with HTML/text templates for:
  1. Password reset instructions (containing the secure token link).
  2. Diagnostic result notification (informing the patient that a new ultrasound report is available).
  - Include graceful development mode: if `SMTP_HOST` is unset, log a formatted email preview to console without throwing.
- `src/lib/actions.ts` — Connect `sendPasswordResetEmail` inside `forgotPassword` and `sendResultReadyNotification` inside `addPatient`.
- `.env.example` — Document email environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`, `APP_URL`).

**Out of scope**:

- Never hardcode or commit real credentials or secrets to any file (Hard Rule 4).
- Do NOT alter token generation or validation logic in `forgotPassword` / `resetPassword`.

## Git workflow

- Branch: `feat/009-transactional-email`
- Commits: Conventional commits (e.g. `feat(email): add transactional email transport and password reset delivery`).

## Steps

### Step 1: Install Nodemailer Dependency

1. Add `nodemailer` and `@types/nodemailer`:
   ```bash
   bun add nodemailer
   bun add -d @types/nodemailer
   ```

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0

### Step 2: Implement Email Utility (`src/lib/email.ts`)

1. Create `src/lib/email.ts`:
   - Read configuration from environment variables:
     - `SMTP_HOST`: string
     - `SMTP_PORT`: number (default 587)
     - `SMTP_USER`: string
     - `SMTP_PASSWORD`: string
     - `EMAIL_FROM`: string (default `"National Children's Hospital <no-reply@hospital.example>"`)
     - `APP_URL`: string (default `"http://localhost:3000"`)
   - Create a transport using `nodemailer.createTransport`.
   - If `SMTP_HOST` is not configured, implement a fallback that logs the email subject, recipient, and body in development, returning `{ success: true, simulated: true }`.
   - Implement and export:
     ```typescript
     export async function sendPasswordResetEmail({
       to,
       resetToken,
     }: {
       to: string;
       resetToken: string;
     }): Promise<{ success: boolean; error?: string }>;
     ```
     Template: Professional hospital branded message with a clear call-to-action button linking to `${APP_URL}/reset-password?token=${resetToken}` and notice that the link expires in 15 minutes.
   - Implement and export:
     ```typescript
     export async function sendResultReadyEmail({
       to,
       patientName,
       resultId,
     }: {
       to: string;
       patientName: string;
       resultId: number;
     }): Promise<{ success: boolean; error?: string }>;
     ```
     Template: Notification stating a new ultrasound diagnostic report from the attending physician is available to view in the patient portal at `${APP_URL}/patient/result/${resultId}`.

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0

### Step 3: Wire Email Dispatch in `src/lib/actions.ts`

1. In `src/lib/actions.ts`:
   - Import `sendPasswordResetEmail` and `sendResultReadyEmail` from `./email`.
   - In `forgotPassword`:
     ```typescript
     if (existingUser) {
       const rawToken = crypto.randomBytes(32).toString("hex");
       const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

       await db.insert(passwordResetTokens).values({
         user_id: existingUser.user_id,
         token_hash: tokenHash,
         expires_at: new Date(Date.now() + 15 * 60 * 1000),
       });

       await sendPasswordResetEmail({
         to: existingUser.email,
         resetToken: rawToken,
       });
     }
     ```
   - In `addPatient`:
     After inserting the result row into `results`:
     Query the patient's email and name from `users`, and dispatch `sendResultReadyEmail({ to: patient.email, patientName: patient.first_name, resultId })`. Wrap in `try/catch` so email transport hiccups never block the database transaction.

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0
`bun run build` &rarr; exit 0

### Step 4: Update `.env.example`

1. Append sample configuration in `.env.example`:
   ```bash
   # Email Configuration (Nodemailer / SMTP)
   SMTP_HOST="smtp.example.com"
   SMTP_PORT=587
   SMTP_USER="apikey"
   SMTP_PASSWORD="your-smtp-password"
   EMAIL_FROM="National Children's Hospital <no-reply@hospital.example>"
   APP_URL="http://localhost:3000"
   ```

**Verify**:
`git diff .env.example` &rarr; only shows documentation additions, zero secrets.

## Done criteria

- [ ] `nodemailer` installed and typed.
- [ ] `src/lib/email.ts` provides `sendPasswordResetEmail` and `sendResultReadyEmail`.
- [ ] Development fallback simulates email sending when SMTP is unconfigured.
- [ ] `forgotPassword` dispatches `sendPasswordResetEmail` with the unhashed raw token.
- [ ] `addPatient` dispatches `sendResultReadyEmail` asynchronously without failing if SMTP is unavailable.
- [ ] `.env.example` documents all required email environment keys.
- [ ] No secrets are committed anywhere.
- [ ] `bun x tsc --noEmit` exits 0.
- [ ] `bun run build` exits 0.
- [ ] Status updated in `plans/README.md`.

## STOP conditions

- Never print password reset tokens in production logs.
- If email sending fails, do not expose internal SMTP errors or stack traces to the client in `actions.ts`.
