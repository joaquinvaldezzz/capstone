import { Fragment } from "react";
import { redirect } from "next/navigation";

import { formatDistanceToNow } from "date-fns";

import { getCurrentUser, getResultById } from "@/lib/dal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { Metadata } from "next";

interface Params {
  id: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Your ultrasound result is here! - Result ${id}`,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const result = await getResultById(Number(id));

  if (!result || result.user_id !== currentUser?.user_id) {
    redirect("/patient");
  }

  return (
    <Fragment>
      <h2 className="mb-4 text-2xl font-semibold">Your ultrasound result is here!</h2>
      <div className="mb-6 flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarImage
            src={`https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com/profile-pictures/${result.doctor_profile_picture}`}
            alt={`${result.doctor_first_name} ${result.doctor_last_name}'s profile picture`}
          />
          <AvatarFallback>
            {result.doctor_first_name[0]}
            {result.doctor_last_name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {result.doctor_first_name} {result.doctor_last_name}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(result.created_at), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>

      <div className="max-w-(--breakpoint-md)">
        <p>Hi, {result.user_first_name}</p>

        <p className="mt-4">Your test results are in.</p>

        <p className="mt-4">
          {result?.diagnosis === "Infected" ? (
            <Fragment>
              Your test results are available. We have determined a{" "}
              <span className="font-semibold text-gray-900">{result.percentage}</span> chance of
              infection based on the ultrasound image provided. You have been diagnosed with an{" "}
              <span className="font-semibold text-gray-900">infection</span>. Please consult with
              your doctor for further information.
            </Fragment>
          ) : (
            <Fragment>
              Based on the ultrasound image provided, we have determined that you have a{" "}
              <span className="font-semibold text-gray-900">{result.percentage}</span> chance of
              being healthy. You have been diagnosed with{" "}
              <span className="font-semibold text-gray-900">{result.diagnosis.toLowerCase()}</span>.
              Please consult with your doctor for further information.
            </Fragment>
          )}
        </p>

        <p className="mt-4">Thank you.</p>
      </div>
    </Fragment>
  );
}
