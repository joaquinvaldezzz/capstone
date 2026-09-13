import Image from "next/image";

import { format } from "date-fns";

import type { PatientResult } from "@/lib/dal";
import HospitalLogo from "@/public/images/hospital-logo.jpg";

export interface MedicalReportTemplateProps {
  result: PatientResult & {
    age?: number;
    birth_date?: string | Date;
    gender?: string;
  };
}

export function MedicalReportTemplate({ result }: MedicalReportTemplateProps) {
  const patientName =
    result.name ??
    `${result.first_name || result.user_first_name || ""} ${
      result.last_name || result.user_last_name || ""
    }`.trim() ??
    "Patient";

  const scanSrc = result.ultrasound_image.startsWith("http")
    ? result.ultrasound_image
    : `https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com/ultrasound-images/${result.ultrasound_image}`;

  const isPCOS = result.diagnosis === "Infected";
  const diagnosisTitle = isPCOS ? "Features consistent with PCOS" : "Normal Ovarian Morphology";

  const formattedDate = result.created_at
    ? format(new Date(result.created_at), "MMMM dd, yyyy hh:mm a")
    : "—";

  const signDate = result.created_at
    ? format(new Date(result.created_at), "MMMM dd, yyyy")
    : format(new Date(), "MMMM dd, yyyy");

  let statusLabel = "Pending Review";
  if (result.status === "VERIFIED") {
    statusLabel = "Verified";
  } else if (result.status === "REVISED") {
    statusLabel = "Revised";
  }

  return (
    <div className="medical-report-document mx-auto w-full max-w-[800px] bg-white p-8 text-neutral-900 print:max-w-none print:p-0 print:text-black">
      {/* Hospital Letterhead Header */}
      <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-4">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center overflow-hidden rounded-full border border-neutral-300">
            <Image
              src={HospitalLogo}
              alt="National Children's Hospital Logo"
              width={64}
              height={64}
              unoptimized
              className="size-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-950 uppercase">
              National Children&apos;s Hospital
            </h1>
            <p className="text-xs font-semibold text-neutral-700">
              Department of Obstetrics &amp; Gynecology / Ultrasound Diagnostics
            </p>
            <p className="text-[11px] text-neutral-600">
              264 E. Rodriguez Sr. Ave, Quezon City, Metro Manila &bull; Tel: (02) 8724-0656
            </p>
          </div>
        </div>

        <div className="text-right text-xs">
          <p className="font-semibold text-neutral-900">
            Report ID:{" "}
            <span className="font-mono font-bold">
              REP-{String(result.result_id).padStart(6, "0")}
            </span>
          </p>
          <p className="text-neutral-600">Date: {formattedDate}</p>
        </div>
      </div>

      <div className="my-3 text-center">
        <h2 className="text-sm font-extrabold tracking-widest text-neutral-900 uppercase">
          Clinical Ultrasound Diagnostic Report
        </h2>
      </div>

      {/* Section 1: Patient Demographic Card */}
      <section className="mb-6 rounded-md border border-neutral-300 p-4">
        <h3 className="mb-2 text-xs font-bold tracking-wider text-neutral-500 uppercase">
          Patient Information
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-4">
          <div>
            <span className="block text-[11px] text-neutral-500">Full Name</span>
            <span className="font-semibold text-neutral-900">{patientName}</span>
          </div>
          <div>
            <span className="block text-[11px] text-neutral-500">Patient ID</span>
            <span className="font-mono font-semibold text-neutral-900">
              PID-{String(result.user_id).padStart(5, "0")}
            </span>
          </div>
          <div>
            <span className="block text-[11px] text-neutral-500">Age / Gender</span>
            <span className="font-semibold text-neutral-900">
              {result.age ? `${result.age} yrs` : "—"} / {result.gender ?? "Female"}
            </span>
          </div>
          <div>
            <span className="block text-[11px] text-neutral-500">Date of Birth</span>
            <span className="font-semibold text-neutral-900">
              {result.birth_date ? format(new Date(result.birth_date), "MMMM dd, yyyy") : "—"}
            </span>
          </div>
        </div>
      </section>

      {/* Section 2: Diagnostic Examination Summary */}
      <section className="mb-6 rounded-md border border-neutral-300 p-4">
        <h3 className="mb-3 text-xs font-bold tracking-wider text-neutral-500 uppercase">
          Diagnostic Examination &amp; AI Analysis
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
          {/* Ultrasound scan image */}
          <div className="flex flex-col items-center sm:col-span-5">
            <div className="relative overflow-hidden rounded-md border border-neutral-300 bg-neutral-900">
              <Image
                src={scanSrc}
                alt="Ultrasound Diagnostic Scan"
                width={280}
                height={280}
                unoptimized
                className="aspect-square object-cover"
              />
            </div>
            <p className="mt-1 text-[11px] text-neutral-500">
              Transvaginal / Pelvic Ultrasound Scan
            </p>
          </div>

          {/* Metrics & Classification */}
          <div className="flex flex-col justify-between sm:col-span-7">
            <div className="space-y-3 text-xs">
              <div>
                <span className="block text-[11px] text-neutral-500">Examination Modality</span>
                <span className="font-semibold text-neutral-900">
                  Pelvic / Transvaginal Ultrasound
                </span>
              </div>

              <div>
                <span className="block text-[11px] text-neutral-500">Clinical Diagnosis</span>
                <span className="inline-block font-semibold text-neutral-950">
                  {diagnosisTitle}
                </span>
              </div>

              <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
                <span className="block text-[11px] font-medium text-neutral-600">
                  AI Decision Support Evaluation
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-medium text-neutral-800">
                    Classification: {diagnosisTitle}
                  </span>
                  <span className="font-mono text-sm font-bold text-neutral-950">
                    {result.percentage}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Model algorithm analyzed follicular distribution and stromal ovarian echogenicity.
                </p>
              </div>

              <div>
                <span className="block text-[11px] text-neutral-500">Verification Status</span>
                <span className="inline-block font-semibold text-neutral-900">{statusLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Clinical Impression & Attending Physician Remarks */}
      <section className="mb-6 rounded-md border border-neutral-300 p-4">
        <h3 className="mb-2 text-xs font-bold tracking-wider text-neutral-500 uppercase">
          Clinical Impression &amp; Physician Remarks
        </h3>
        <div className="text-xs">
          <div className="mb-2">
            <span className="block text-[11px] text-neutral-500">Attending Physician</span>
            <span className="font-semibold text-neutral-900">
              Dr. {result.doctor_first_name} {result.doctor_last_name}
            </span>
            <span className="ml-1 text-[11px] text-neutral-500">
              (Department of Obstetrics &amp; Gynecology)
            </span>
          </div>
          <div>
            <span className="block text-[11px] text-neutral-500">
              Doctor Notes &amp; Observations
            </span>
            <p className="mt-1 rounded border border-neutral-200 bg-neutral-50 p-2.5 whitespace-pre-wrap text-neutral-800">
              {result.doctor_notes ??
                "Routine examination completed. Clinical correlation advised."}
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Regulatory Medical Disclaimer */}
      <section className="mb-6 rounded border border-amber-300 bg-amber-50/50 p-3 text-[11px] leading-relaxed text-amber-950 print:border-neutral-300 print:bg-white print:text-neutral-700">
        <p className="font-medium">
          <strong>Official Medical Disclaimer:</strong> This report is generated for medical
          documentation. AI metrics are assistive tools; final clinical determination has been
          verified by the attending physician. Formal diagnosis must be correlated with patient
          symptoms, physical examination, and hormonal laboratory assays.
        </p>
      </section>

      {/* Physician Sign-Off Block */}
      <div className="mt-8 border-t border-neutral-300 pt-4">
        <div className="flex items-end justify-between text-xs">
          <div>
            <p className="text-[11px] text-neutral-500">Hospital System Verification ID</p>
            <p className="font-mono text-xs text-neutral-700">
              NCH-V-{result.result_id}-{result.doctor_id}
            </p>
          </div>

          <div className="w-64 text-center">
            <div className="mb-2 border-b border-neutral-900 pb-8">
              <span className="font-serif text-neutral-400 italic">Electronically signed</span>
            </div>
            <p className="font-bold text-neutral-900">
              Dr. {result.doctor_first_name} {result.doctor_last_name}, MD
            </p>
            <p className="text-[11px] text-neutral-600">Attending Physician / Sonologist</p>
            <p className="mt-1 text-[11px] text-neutral-500">Date: {signDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
