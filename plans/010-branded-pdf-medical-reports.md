# Plan 010: Standardize Branded PDF Clinical Diagnostic Reports for Doctors and Patients

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 1fa458b..HEAD -- src/app/doctor/results/[id]/page.tsx src/app/patient/result/[id]/page.tsx src/app/doctor/results/[id]/print-button.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/007-complete-patient-portal-and-inbox.md, plans/008-clinician-review-and-status-lifecycle.md
- **Category**: direction
- **Planned at**: commit `1fa458b`, 2026-09-13
- **Issue**: None

## Why this matters

Patients and attending physicians frequently need to share ultrasound findings with outside specialists (e.g. reproductive endocrinologists, gynecologists, geneticists) or maintain personal physical medical records.

Currently, report generation is limited to a primitive `window.print()` trigger on the doctor's page (`src/app/doctor/results/[id]/print-button.tsx`). When printed, the browser captures the unformatted web page with sidebar remnants and no pagination controls. Patients have no print or export button at all.

This plan builds a dedicated, standardized clinical medical report template with the hospital letterhead (`public/images/hospital-logo.jpg`), patient demographics, ultrasound image, AI evaluation metrics, attending physician notes, and a digital sign-off block. It styles it via print CSS stylesheets (`@media print`) and adds an export/print trigger for both doctors and patients.

## Current state

The relevant files:

- `src/app/doctor/results/[id]/print-button.tsx:7-17` — Simple button calling `window.print()`.
- `src/app/doctor/results/[id]/page.tsx:66-70` — Places the print button with basic `print:hidden` utility classes on parent elements, but prints the raw web UI without medical report letterhead or standardized margins.
- `src/app/patient/result/[id]/page.tsx` — Contains zero print or export capability for patients.
- `public/images/hospital-logo.jpg` — Existing hospital logo asset, currently only used in sidebar navigation.

## Commands you will need

| Purpose     | Command              | Expected on success |
| ----------- | -------------------- | ------------------- |
| Typecheck   | `bun x tsc --noEmit` | exit 0, no errors   |
| Build check | `bun run build`      | exit 0              |

## Scope

**In scope**:

- `src/components/medical-report-template.tsx` — Create a clean, printable medical report component structured for standard 8.5" x 11" (A4/Letter) paper:
  - Hospital letterhead (Logo, Clinic Name, Address, Contact Info).
  - Patient demographic card (Full Name, Age, DOB, Gender, Date of Examination).
  - Diagnostic Examination summary (Ultrasound scan, AI confidence percentage, Clinical Diagnosis).
  - Attending Physician block (Doctor Name, License/Role, Clinical Observations, Signature line).
  - Official Medical Disclaimer.
- `src/app/doctor/results/[id]/page.tsx` — Integrate the report template into the print view.
- `src/app/patient/result/[id]/page.tsx` — Integrate the report template and add a patient print button.
- `src/app/patient/result/[id]/print-button.tsx` — Create client print button for patients.
- `src/styles/globals.css` (or print styles) — Add `@page` print rules to suppress browser URL headers/footers and set clean print margins.

**Out of scope**:

- Do NOT alter database models or server actions.
- Do NOT modify admin user management pages.

## Git workflow

- Branch: `feat/010-branded-pdf-reports`
- Commits: Conventional commits (e.g. `feat(reports): standardize printable clinical report for doctors and patients`).

## Steps

### Step 1: Create Reusable Medical Report Component (`src/components/medical-report-template.tsx`)

1. Create `src/components/medical-report-template.tsx`:
   - Props: `result: PatientResult`.
   - Layout:
     - Header:
       - Hospital Logo (`/images/hospital-logo.jpg`), "National Children's Hospital", Department of Obstetrics & Gynecology / Ultrasound Diagnostics.
       - Report ID, Examination Date.
     - Section 1: Patient Information:
       - Patient Name, Age, Date of Birth, Gender, Patient ID.
     - Section 2: Ultrasound Scan & Image Analysis:
       - Displays the ultrasound scan image (and Grad-CAM heatmap if available).
       - Modality: Pelvic / Transvaginal Ultrasound.
       - AI Decision Support: Classification ("Features consistent with PCOS" / "Normal Ovarian Morphology"), Confidence Score.
     - Section 3: Clinical Impression & Physician Remarks:
       - Attending Physician Name.
       - Doctor Notes (from `result.doctor_notes` if present, or "Routine examination completed").
       - Verification Status (Verified / Approved).
     - Section 4: Regulatory Medical Disclaimer:
       - _"This report is generated for medical documentation. AI metrics are assistive tools; final clinical determination has been verified by the attending physician."_
     - Signature block with line for physician signature and date.
   - Styling: Use clean typography, borders, and `print:block hidden` / `print:visible` classes so it formats like an official hospital document.

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0

### Step 2: Add Print Styles in `src/styles/globals.css`

1. In `src/styles/globals.css`, add print optimization:
   ```css
   @media print {
     @page {
       margin: 15mm;
       size: portrait;
     }
     body {
       background: white !important;
       color: black !important;
     }
     .no-print {
       display: none !important;
     }
   }
   ```

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0

### Step 3: Embed Report Template in Doctor Result Page (`src/app/doctor/results/[id]/page.tsx`)

1. In `src/app/doctor/results/[id]/page.tsx`:
   - Wrap interactive controls (Delete, Print, Review) and standard web layout in a wrapper with `print:hidden`.
   - Render `<div className="hidden print:block"><MedicalReportTemplate result={result} /></div>`.
   - Verify that clicking "Print" opens the browser print dialog displaying only the clean medical report.

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0

### Step 4: Add Print Capability to Patient Result Page (`src/app/patient/result/[id]/page.tsx`)

1. Create `src/app/patient/result/[id]/print-button.tsx`:
   - Simple client button with Printer icon: _"Download / Print Medical Report"_.
2. In `src/app/patient/result/[id]/page.tsx`:
   - Render the print button in the header action area.
   - Render `<div className="hidden print:block"><MedicalReportTemplate result={result} /></div>`.
   - Mark web navigation bars and headers as `print:hidden`.

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0
`bun run build` &rarr; exit 0

## Done criteria

- [ ] `src/components/medical-report-template.tsx` created with hospital letterhead, patient demographics, scan image, doctor notes, and signature block.
- [ ] Global print styles configure page margins and suppress extraneous browser elements.
- [ ] Doctors can print a clean, branded clinical report from `src/app/doctor/results/[id]`.
- [ ] Patients have a "Print / Download Report" button on `src/app/patient/result/[id]` and receive the same official document.
- [ ] `bun x tsc --noEmit` exits 0.
- [ ] `bun run build` exits 0.
- [ ] Status updated in `plans/README.md`.

## STOP conditions

- If image elements fail to render when printing, ensure Next.js images use unoptimized or standard `<img>` tags in the print template if the browser print engine fails to load Next.js srcset.
