# Plan 007: Complete the Patient Portal (Inbox Landing, Responsive Navigation, and Scan Imagery)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 1fa458b..HEAD -- src/app/patient/page.tsx src/app/patient/result/[id]/page.tsx src/app/patient/_components/app-sidebar.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/005-parameterize-dal-and-tenant-scoping.md
- **Category**: direction
- **Planned at**: commit `1fa458b`, 2026-09-13
- **Issue**: None

## Why this matters

The patient user experience is currently incomplete:

1. When a patient logs in, the default `/patient` landing page renders `<h2 />;` — a completely blank page.
2. In the patient sidebar (`src/app/patient/_components/app-sidebar.tsx:121`), the second column containing the list of diagnostic result messages is set to `hidden md:flex`. On mobile devices or tablets, the sidebar hides the messages list entirely, leaving mobile patients with no way to navigate to or view their results.
3. The result detail page (`src/app/patient/result/[id]/page.tsx`) refers to Polycystic Ovary Syndrome as an "infection" (`result?.diagnosis === "Infected"` &rarr; `"chance of infection"`), which is clinically inaccurate and distressing to patients.
4. The patient result detail page completely omits the patient's ultrasound image, even though the doctor's page displays it.

This plan builds out the patient dashboard with a responsive inbox overview, ensures mobile navigation functions properly, provides access to the ultrasound image with appropriate health literacy copy, and corrects terminology from "infection" to clinically accurate PCOS indicators.

## Current state

The relevant files:

- `src/app/patient/page.tsx:9-11` — Returns an empty stub `<h2 />;`.
- `src/app/patient/_components/app-sidebar.tsx:121` — Uses `className="hidden flex-1 md:flex"` for message items, concealing messages on mobile screens without a fallback.
- `src/app/patient/result/[id]/page.tsx:58-84` — Renders plain text only without the ultrasound scan; text describes PCOS diagnosis as an "infection".
- `src/lib/dal.ts:210-237` — `getResultsByPatientId(userId: number)` already retrieves all results for the patient including doctor details.

Exemplar excerpts:

`src/app/patient/page.tsx:9-11`:

```typescript
export default async function Page() {
  return <h2 />;
}
```

`src/app/patient/result/[id]/page.tsx:64-72`:

```typescript
{result?.diagnosis === "Infected" ? (
  <Fragment>
    Your test results are available. We have determined a{" "}
    <span className="font-semibold text-gray-900">{result.percentage}</span> chance of
    infection based on the ultrasound image provided. You have been diagnosed with an{" "}
    <span className="font-semibold text-gray-900">infection</span>. Please consult with
    your doctor for further information.
  </Fragment>
) : ...
```

## Commands you will need

| Purpose     | Command              | Expected on success |
| ----------- | -------------------- | ------------------- |
| Typecheck   | `bun x tsc --noEmit` | exit 0, no errors   |
| Build check | `bun run build`      | exit 0              |

## Scope

**In scope**:

- `src/app/patient/page.tsx` — Build a patient inbox dashboard showing summary metrics (total test results, latest test date, attending physician) and a responsive list of results with links to view details.
- `src/app/patient/_components/app-sidebar.tsx` — Ensure mobile users have access to the results list (e.g. by enabling responsive navigation or drawer view).
- `src/app/patient/result/[id]/page.tsx` — Display the ultrasound image attachment, correct alarmist "infection" copy to "PCOS Indicators Detected" / "Consistent with Normal Ovarian Morphology", and add physician guidance notes.

**Out of scope**:

- Do NOT touch doctor (`src/app/doctor/*`) or admin (`src/app/admin/*`) pages.
- Do NOT alter authentication or session cookies (`src/lib/session.ts`).

## Git workflow

- Branch: `feat/007-patient-portal-inbox`
- Commits: Conventional commits (e.g. `feat(patient): implement responsive inbox dashboard and ultrasound scan view`).

## Steps

### Step 1: Implement Patient Dashboard (`src/app/patient/page.tsx`)

1. In `src/app/patient/page.tsx`:
   - Fetch the current user via `getCurrentUser()`.
   - Fetch the patient's diagnostic results using `getResultsByPatientId(currentUser.user_id)`.
   - If no results exist, render an empty state card: _"No ultrasound results yet. When your doctor uploads your ultrasound scan, your report will appear here."_
   - If results exist, display:
     - Header: _"Welcome back, {currentUser.first_name}"_
     - Quick overview cards: Total Scans, Latest Scan Date, Primary Physician.
     - A list/table of results with Date, Attending Physician, Status / Clinical Summary, and a button to _"View Full Report"_.

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0

### Step 2: Ensure Mobile Access in `src/app/patient/_components/app-sidebar.tsx`

1. In `src/app/patient/_components/app-sidebar.tsx`:
   - Review mobile sidebar behavior. The first sidebar contains icons and links. Ensure that on mobile, clicking the "Inbox" icon opens the message list or navigates directly to `/patient` where all results are displayed in the main content area.
   - Update `data.navMain`:
     ```typescript
     const data = {
       navMain: [
         {
           title: "Inbox",
           url: "/patient",
           icon: Inbox,
           isActive: true,
         },
       ],
     };
     ```
   - Ensure the Link wraps `url` properly so mobile users tapping "Inbox" navigate to `/patient`.

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0

### Step 3: Upgrade Patient Result Detail Page (`src/app/patient/result/[id]/page.tsx`)

1. In `src/app/patient/result/[id]/page.tsx`:
   - Add the ultrasound scan image display:
     ```tsx
     <div className="mt-6">
       <h3 className="mb-2 text-sm font-medium text-muted-foreground">Ultrasound Scan</h3>
       <div className="max-w-sm overflow-hidden rounded-lg border">
         <Image
           src={
             result.ultrasound_image.startsWith("http")
               ? result.ultrasound_image
               : `https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com/ultrasound-images/${result.ultrasound_image}`
           }
           alt="Ultrasound scan"
           width={320}
           height={320}
           className="w-full object-cover"
           priority
         />
       </div>
     </div>
     ```
   - Replace "infection" terminology with clinically appropriate PCOS wording:
     - For `result.diagnosis === "Infected"`:
       _"Your ultrasound scan indicates features consistent with Polycystic Ovary Syndrome (PCOS), with an AI confidence score of {result.percentage}. Polycystic ovaries typically show multiple small follicles arranged peripherally. Please discuss these findings with Dr. {result.doctor_first_name} {result.doctor_last_name} to review comprehensive symptoms, hormonal evaluations, and personalized management plans."_
     - For `result.diagnosis === "Healthy"`:
       _"Your ultrasound scan indicates normal ovarian morphology, with an AI confidence score of {result.percentage}. No significant polycystic features were identified. Continue following your routine health guidance with Dr. {result.doctor_first_name} {result.doctor_last_name}."_
   - Add a clinical disclaimer banner:
     _"Note: This ultrasound analysis is generated with algorithmic assistance. Formal medical diagnosis requires correlation with clinical symptoms and laboratory tests by your healthcare provider."_

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0
`bun run build` &rarr; exit 0

## Done criteria

- [ ] `src/app/patient/page.tsx` renders a populated dashboard when results exist, and an informative empty state when none exist.
- [ ] Mobile users can navigate to and view their results.
- [ ] `src/app/patient/result/[id]/page.tsx` renders the ultrasound image attachment.
- [ ] All references to "infection" are replaced with accurate PCOS terminology ("PCOS Indicators Detected" / "Normal Ovarian Morphology").
- [ ] `bun x tsc --noEmit` exits 0.
- [ ] `bun run build` exits 0.
- [ ] No files outside the in-scope list are modified (`git status`).
- [ ] Status updated in `plans/README.md`.

## STOP conditions

- If `getResultsByPatientId` returns null, check `getCurrentUser()` session validation.
- If ultrasound image fails to load, ensure image URL format matches the Vercel Blob public path conventions used in `src/app/doctor/results/[id]/page.tsx`.

## Maintenance notes

- When Plan 008 (Clinician Review) lands, patient result views can display the physician's verified status badge and clinical notes.
- When Plan 010 (PDF Reports) lands, a "Download PDF Report" button can be placed on this page.
