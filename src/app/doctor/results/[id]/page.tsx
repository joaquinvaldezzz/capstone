import { Fragment } from "react";
import Image from "next/image";

import { format } from "date-fns";

import { getPatientResults, getResultById } from "@/lib/dal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MedicalReportTemplate } from "@/components/medical-report-template";

import type { Metadata } from "next";

import { DeleteButton } from "./delete-button";
import { PrintButton } from "./print-button";
import { ReviewForm } from "./review-form";

function StatusBadge({ status = "PENDING_REVIEW" }: { status?: string }) {
  switch (status) {
    case "VERIFIED":
      return (
        <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
          Verified
        </Badge>
      );
    case "REVISED":
      return (
        <Badge className="border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100">
          Revised
        </Badge>
      );
    case "PENDING_REVIEW":
    default:
      return (
        <Badge className="border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-100">
          Pending Review
        </Badge>
      );
  }
}

export async function generateStaticParams() {
  const id = await getPatientResults();

  if (id == null) {
    return [];
  }

  return id.map((item) => ({
    id: String(item.result_id),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await getResultById(Number(id));

  if (user == null) {
    return {
      title: "User not found",
    };
  }

  return {
    title: `${user.first_name} ${user.last_name}'s Result`,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getResultById(Number(id));

  if (result == null) {
    return <div>Failed to fetch data</div>;
  }

  return (
    <Fragment>
      <div className="print:hidden">
        <div className="mx-auto flex max-w-(--breakpoint-md) flex-col gap-5">
          <div className="flex justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-semibold">Result #{result.result_id}</h2>
                <StatusBadge status={result.status} />
              </div>
              <div className="mt-1 flex gap-4">
                <span className="text-gray-600">
                  {format(result.created_at, "MMMM dd, yyyy hh:mm a")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ReviewForm result={result} />
              <DeleteButton resultId={result.result_id} />
              <PrintButton />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 w-full max-w-(--breakpoint-md)">
          <div className="border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm leading-6 font-medium">Patient</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={`https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com/profile-pictures/${result.profile_picture}`}
                        alt={result.name}
                      />
                      <AvatarFallback>
                        {result.first_name[0]}
                        {result.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {result.first_name} {result.last_name}
                    </span>
                  </div>
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm leading-6 font-medium">Email address</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {result.email}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm leading-6 font-medium">Status</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <StatusBadge status={result.status} />
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm leading-6 font-medium">Diagnosis</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {result.diagnosis}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm leading-6 font-medium">Doctor Clinical Notes</dt>
                <dd className="mt-1 text-sm leading-6 whitespace-pre-wrap text-gray-700 sm:col-span-2 sm:mt-0">
                  {result.doctor_notes ?? (
                    <span className="text-gray-400 italic">No clinical notes recorded.</span>
                  )}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm leading-6 font-medium">Percentage</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {result.percentage}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm leading-6 font-medium">Attachment</dt>
                <dd className="mt-2 text-sm sm:col-span-2 sm:mt-0">
                  <Image
                    className="w-64 rounded-lg object-cover"
                    src={
                      result.ultrasound_image.startsWith("http")
                        ? result.ultrasound_image
                        : `https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com/ultrasound-images/${result.ultrasound_image}`
                    }
                    alt={result.ultrasound_image}
                    height={256}
                    width={256}
                    priority
                  />
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="hidden print:block">
        <MedicalReportTemplate result={result} />
      </div>
    </Fragment>
  );
}
