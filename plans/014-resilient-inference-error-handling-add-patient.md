# Plan 014: Add Resilient Error Handling and Validation to Diagnostic Inference

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 0726f2d..HEAD -- src/lib/actions.ts src/app/doctor/results/patient-form.tsx`
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

In `addPatient` (`src/lib/actions.ts:115-217`), if the Python Flask ML service is offline or throws an error, the `catch (error)` block simply prints `console.error` and continues execution. This causes corrupted database rows with empty string values (`diagnosis: ""`, `percentage: ""`), wastes Vercel Blob storage, and sends misleading result notifications to patients. Failing fast with clear user-facing feedback ensures only valid, verified diagnostic predictions are saved and shared.

## Current state

- `src/lib/actions.ts:145-186`:
```typescript
  let percentage = "";
  let diagnosis = "";

  try {
    const predictionResponse = await fetch("http://127.0.0.1:5000/api/predict", {
      body: formData,
      method: "POST",
    });

    const data = await predictionResponse.json();
    percentage = data.percentage;
    diagnosis = data.result;
  } catch (error) {
    console.error(error);
  }

  // Upload the ultrasound image to the server
  const blob = await put(...);
  // Inserts into results with empty percentage & diagnosis!
```

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `bun x tsc --noEmit` | exit 0, no errors |
| Lint Check | `bun run lint` | exit 0, 0 errors |

## Scope

**In scope** (the only files you should modify):
- `src/lib/actions.ts`

**Out of scope** (do NOT touch):
- Python Flask backend (`index.py`).
- Frontend UI components (`patient-form.tsx`).

## Git workflow

- Branch: `feat/014-resilient-inference-error-handling`
- Commit message: `fix(actions): fail fast on inference errors and validate diagnostic prediction`

## Steps

### Step 1: Implement robust error checking in `addPatient`

In `src/lib/actions.ts:addPatient`:
1. Verify doctor authorization:
   ```typescript
   const currentDoctor = await getCurrentUser();
   if (!currentDoctor || currentDoctor.role !== "doctor") {
     return {
       message: "Unauthorized: only attending physicians can submit scans.",
       success: false,
     };
   }
   ```
2. Validate the uploaded file before dispatching to Flask or Vercel Blob:
   - Verify `parsedData.data.ultrasound_image instanceof File && parsedData.data.ultrasound_image.size > 0`.
   - If invalid, return `{ message: "Please provide a valid ultrasound image file.", success: false }`.
3. Wrap Flask API call with HTTP response verification:
   ```typescript
   let percentage = "";
   let diagnosis = "";

   try {
     const flaskUrl = process.env.FLASK_API_URL ?? "http://127.0.0.1:5000/api/predict";
     const predictionResponse = await fetch(flaskUrl, {
       body: formData,
       method: "POST",
     });

     if (!predictionResponse.ok) {
       return {
         message: "The diagnostic analysis service returned an error. Please try again.",
         success: false,
       };
     }

     const data = await predictionResponse.json();
     if (!data?.percentage || !data?.result || data.result === "Invalid") {
       return {
         message: "The uploaded image could not be verified as a valid ultrasound scan.",
         success: false,
       };
     }

     percentage = data.percentage;
     diagnosis = data.result;
   } catch (error) {
     return {
       message: "Unable to connect to diagnostic analysis service.",
       success: false,
     };
   }
   ```
4. Only if `percentage` and `diagnosis` are non-empty and valid, proceed to upload to Vercel Blob and insert into database.

**Verify**: `bun x tsc --noEmit` → exit 0

### Step 2: Ensure structured error messaging

Verify that any downstream database or email failures are handled without crashing the action response.

**Verify**: `bun run lint` → exit 0

## Done criteria

- [ ] Unreachable Flask API returns `{ success: false, message: "..." }` immediately without creating database records.
- [ ] Non-doctor callers cannot invoke `addPatient`.
- [ ] No empty `percentage` or `diagnosis` strings can be inserted into the database.
- [ ] `bun x tsc --noEmit` exits 0.
- [ ] `bun run lint` exits 0.

## STOP conditions

Stop and report back if:
- Next.js rewrite configuration in `next.config.js` conflicts with `process.env.FLASK_API_URL`.
