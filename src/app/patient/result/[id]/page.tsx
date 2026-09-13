import { Fragment } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";

import { formatDistanceToNow } from "date-fns";
import { Info } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser, getResultById } from "@/lib/dal";

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
              Your ultrasound scan indicates features consistent with Polycystic Ovary Syndrome
              (PCOS), with an AI confidence score of{" "}
              <span className="font-semibold text-gray-900">{result.percentage}</span>. Polycystic
              ovaries typically show multiple small follicles arranged peripherally. Please discuss
              these findings with Dr. {result.doctor_first_name} {result.doctor_last_name} to review
              comprehensive symptoms, hormonal evaluations, and personalized management plans.
            </Fragment>
          ) : (
            <Fragment>
              Your ultrasound scan indicates normal ovarian morphology, with an AI confidence score
              of <span className="font-semibold text-gray-900">{result.percentage}</span>. No
              significant polycystic features were identified. Continue following your routine
              health guidance with Dr. {result.doctor_first_name} {result.doctor_last_name}.
            </Fragment>
          )}
        </p>

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

        <Alert className="mt-6">
          <Info className="size-4" />
          <AlertDescription className="text-xs text-muted-foreground">
            Note: This ultrasound analysis is generated with algorithmic assistance. Formal medical
            diagnosis requires correlation with clinical symptoms and laboratory tests by your
            healthcare provider.
          </AlertDescription>
        </Alert>

        <p className="mt-6">Thank you.</p>
      </div>
    </Fragment>
  );
}
