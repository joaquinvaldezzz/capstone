'use client'

import Image from 'next/image'

import { type Result } from '@/lib/dal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

export function MailDisplay({ mail }: { mail: Result | undefined }) {
  return (
    <div className="flex h-screen flex-1 flex-col">
      <div className="flex w-full gap-4 border-b border-b-gray-200 bg-white px-6 py-5">
        <div className="flex gap-4">
          <Avatar className="size-14">
            <AvatarImage src="" />
            <AvatarFallback>
              {String(mail?.first_name[0].toUpperCase()) + String(mail?.last_name[0].toUpperCase())}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">
              {mail?.first_name} {mail?.last_name}
            </h3>
            <p className="text-sm text-gray-600">{mail?.email}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-8 text-gray-600">
        <div className="p-6">
          <p>Hi, {mail?.first_name}</p>

          <p className="mt-4">Your test results are in.</p>

          <p className="mt-4">
            {mail?.diagnosis === 'Infected' ? (
              <>
                Your test results are available. We have determined a{' '}
                <span className="font-semibold text-gray-900">{mail?.percentage}</span> chance of
                infection based on the ultrasound image provided. You have been diagnosed with an{' '}
                <span className="font-semibold text-gray-900">infection</span>. Please consult with
                your doctor for further information.
              </>
            ) : (
              <>
                Based on the ultrasound image provided, we have determined that you have a{' '}
                <span className="font-semibold text-gray-900">{mail?.percentage}</span> chance of
                being healthy. You have been diagnosed with{' '}
                <span className="font-semibold text-gray-900">{mail?.diagnosis}</span>. Please
                consult with your doctor for further information.
              </>
            )}
          </p>

          <p className="mt-4">
            <Image
              className="size-auto object-cover"
              src={`https://x5l8gkuguvp5hvw9.public.blob.vercel-storage.com/ultrasound-images/${String(mail?.ultrasound_image)}`}
              alt={String(mail?.ultrasound_image)}
              height={500}
              width={500}
              priority
            />
          </p>

          <p className="mt-4">Thank you.</p>
        </div>
      </ScrollArea>
    </div>
  )
}
