# Plan 008: Implement Clinician-in-the-Loop Diagnostic Review, Medical Notes, and Status Lifecycle

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 1fa458b..HEAD -- src/lib/db-schema.ts src/lib/form-schema.ts src/lib/actions.ts src/lib/dal.ts src/app/doctor/results/[id]/page.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/005-parameterize-dal-and-tenant-scoping.md
- **Category**: direction
- **Planned at**: commit `1fa458b`, 2026-09-13
- **Issue**: None

## Why this matters

In clinical software, an artificial intelligence inference output is decision support, not an automated final diagnosis. Under current behavior, when a doctor uploads an ultrasound image, `addPatient` immediately commits the raw model classification ("Healthy" vs "Infected") directly into `results.diagnosis`.

The doctor has no mechanism to:

1. Append clinical notes or remarks based on patient symptoms (e.g. Rotterdam criteria: menstrual irregularity, hirsutism, biochemical hyperandrogenism).
2. Override an incorrect or borderline neural network prediction.
3. Track the result lifecycle (e.g. `PENDING_REVIEW`, `VERIFIED`, `REVISED`).

This plan introduces a formal review lifecycle to `results`, provides doctor review actions, and renders a clinical review card with editable notes and status confirmation on the doctor's result page.

## Current state

The relevant files:

- `src/lib/db-schema.ts:64-76` — `results` table lacks `doctor_notes` and `status` columns.
- `src/lib/actions.ts:174-183` — Directly writes raw model `diagnosis` into `results` without an intermediate review state.
- `src/lib/dal.ts:239-270` — `getResultById` does not select or return doctor notes or verification status.
- `src/app/doctor/results/[id]/page.tsx:103-115` — Displays read-only `result.diagnosis` without any editing or review capability.

Exemplar excerpts:

`src/lib/db-schema.ts:64-76`:

```typescript
export const results = pgTable("results", {
  result_id: serial("result_id").primaryKey(),
  doctor_id: integer("doctor_id")
    .references(() => users.user_id)
    .notNull(),
  user_id: integer("user_id")
    .references(() => users.user_id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  ultrasound_image: text("ultrasound_image").notNull(),
  percentage: text("percentage").notNull(),
  diagnosis: text("diagnosis").notNull(),
});
```

`src/app/doctor/results/[id]/page.tsx:103-115`:

```typescript
<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
  <dt className="text-sm leading-6 font-medium">Diagnosis</dt>
  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
    {result.diagnosis}
  </dd>
</div>
<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
  <dt className="text-sm leading-6 font-medium">Percentage</dt>
  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
    {result.percentage}
  </dd>
</div>
```

## Commands you will need

| Purpose             | Command                | Expected on success |
| ------------------- | ---------------------- | ------------------- |
| Typecheck           | `bun x tsc --noEmit`   | exit 0, no errors   |
| Build check         | `bun run build`        | exit 0              |
| Drizzle schema push | `bun run drizzle:push` | exit 0              |

## Scope

**In scope**:

- `src/lib/db-schema.ts` — Add `status: text("status").default("PENDING_REVIEW").notNull()` and `doctor_notes: text("doctor_notes")` to `results`.
- `src/lib/form-schema.ts` — Add `updateResultReviewSchema` with validation for `result_id`, `diagnosis`, `status` (`PENDING_REVIEW` | `VERIFIED` | `REVISED`), and `doctor_notes`.
- `src/lib/actions.ts` — Add server action `updateResultReview` to update clinical notes, status, and diagnosis with doctor role authorization.
- `src/lib/dal.ts` — Add `status` and `doctor_notes` to `Result` and `PatientResult` types.
- `src/app/doctor/results/[id]/review-form.tsx` — Create client form dialog allowing the physician to edit clinical notes, adjust diagnosis, and set status to `VERIFIED`.
- `src/app/doctor/results/[id]/page.tsx` — Display the status badge, doctor's notes, and review action button.

**Out of scope**:

- Do NOT delete existing data in the `results` table.
- Do NOT alter patient login or session handling.

## Git workflow

- Branch: `feat/008-clinician-review-lifecycle`
- Commits: Conventional commits (e.g. `feat(results): add clinician notes and verification status lifecycle`).

## Steps

### Step 1: Update Drizzle Schema (`src/lib/db-schema.ts`)

1. In `src/lib/db-schema.ts`, add `status` and `doctor_notes` to `results`:
   ```typescript
   export const results = pgTable("results", {
     result_id: serial("result_id").primaryKey(),
     doctor_id: integer("doctor_id")
       .references(() => users.user_id)
       .notNull(),
     user_id: integer("user_id")
       .references(() => users.user_id)
       .notNull(),
     created_at: timestamp("created_at").defaultNow().notNull(),
     ultrasound_image: text("ultrasound_image").notNull(),
     percentage: text("percentage").notNull(),
     diagnosis: text("diagnosis").notNull(),
     status: text("status").default("PENDING_REVIEW").notNull(),
     doctor_notes: text("doctor_notes"),
   });
   ```

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0

### Step 2: Add Zod Validation Schema (`src/lib/form-schema.ts`)

1. In `src/lib/form-schema.ts`, export:
   ```typescript
   export const updateResultReviewSchema = z.object({
     result_id: z.coerce.number().int().positive(),
     diagnosis: z.string().min(1, { error: "Diagnosis cannot be empty." }),
     status: z.enum(["PENDING_REVIEW", "VERIFIED", "REVISED"]),
     doctor_notes: z
       .string()
       .max(2000, { error: "Notes cannot exceed 2000 characters." })
       .optional(),
   });

   export type UpdateResultReviewSchema = z.infer<typeof updateResultReviewSchema>;
   ```

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0

### Step 3: Implement Server Action (`src/lib/actions.ts`)

1. In `src/lib/actions.ts`, implement `updateResultReview`:
   ```typescript
   export async function updateResultReview(
     _previousState: PreviousState,
     formData: FormData,
   ): Promise<Message> {
     const currentUser = await getCurrentUser();
     if (currentUser?.role !== "doctor" && currentUser?.role !== "admin") {
       return { message: "Unauthorized: only physicians may review results.", success: false };
     }

     const formValues = Object.fromEntries(formData);
     const parsed = updateResultReviewSchema.safeParse(formValues);
     if (!parsed.success) {
       return { message: "Invalid review data.", success: false };
     }

     await db
       .update(results)
       .set({
         diagnosis: parsed.data.diagnosis,
         status: parsed.data.status,
         doctor_notes: parsed.data.doctor_notes ?? null,
       })
       .where(eq(results.result_id, parsed.data.result_id))
       .execute();

     revalidatePath(`/doctor/results/${parsed.data.result_id}`);
     revalidatePath("/doctor/results");
     revalidatePath(`/patient/result/${parsed.data.result_id}`);

     return { message: "Clinical review updated successfully.", success: true };
   }
   ```

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0

### Step 4: Update DAL Queries & Types (`src/lib/dal.ts`)

1. In `src/lib/dal.ts`:
   - Add `status: string;` and `doctor_notes: string | null;` to `Result` and `PatientResult` interfaces.
   - Verify all SQL queries selecting `"results".*` properly expose these fields.

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0

### Step 5: Build Review Component & Embed in Doctor Result Page

1. Create `src/app/doctor/results/[id]/review-form.tsx`:
   - Dialog with form inputs:
     - Diagnosis (select or text: "Healthy" | "Infected" / "PCOS" with ability to override).
     - Status: "PENDING_REVIEW" | "VERIFIED" | "REVISED".
     - Doctor Clinical Notes: Textarea for clinical commentary, follicle counts, or treatment suggestions.
     - Submit button using `useActionState(updateResultReview, ...)`.
2. In `src/app/doctor/results/[id]/page.tsx`:
   - Display a Status badge (e.g. amber badge for `PENDING_REVIEW`, green badge for `VERIFIED`, blue for `REVISED`).
   - Display Doctor Notes section under Diagnosis.
   - Render the `<ReviewForm result={result} />` button in the action bar next to Print and Delete.

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0
`bun run build` &rarr; exit 0

## Done criteria

- [ ] `results` table schema contains `status` and `doctor_notes`.
- [ ] `updateResultReviewSchema` validates review inputs.
- [ ] `updateResultReview` server action requires `doctor` or `admin` role and updates the database record.
- [ ] `src/lib/dal.ts` includes `status` and `doctor_notes` in `Result` and `PatientResult`.
- [ ] `src/app/doctor/results/[id]/page.tsx` renders the status badge, doctor notes, and review trigger.
- [ ] `bun x tsc --noEmit` exits 0.
- [ ] `bun run build` exits 0.
- [ ] No files outside the in-scope list are modified (`git status`).
- [ ] Status updated in `plans/README.md`.

## STOP conditions

- If database migration fails, check if existing rows require default status (`PENDING_REVIEW`).
- If authorization checks fail, verify that `getCurrentUser()` returns the authenticated user's session role.

## Maintenance notes

- In Plan 010 (PDF Reports), doctor notes and the verified status badge should be included in the exported diagnostic PDF.
