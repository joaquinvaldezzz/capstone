'use client'

import { formatDistanceToNow } from 'date-fns'

import { type Result } from '@/lib/dal'
import { useMail } from '@/hooks/use-mail'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

export function MailList({ results }: { results: Result[] }) {
  const [mail, setMail] = useMail()

  return (
    <div className="flex h-screen w-full max-w-[360px] flex-col border-r border-gray-200">
      <div className="px-6 py-5">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col divide-y divide-gray-200">
          {results?.length === 0 ? (
            <p className="p-4">No results found</p>
          ) : (
            results?.map((result, index) => (
              <button
                className="p-4 text-left hover:bg-gray-25 data-active:bg-gray-25"
                data-state={mail.selected === result.result_id && 'active'}
                type="button"
                key={index}
                onClick={() => {
                  setMail({
                    selected: result.result_id,
                  })
                }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex min-w-0 flex-1 gap-3">
                    {/* <div className="my-auto size-2 shrink-0 rounded-full bg-brand-600"></div> */}
                    <div className="flex min-w-0 flex-1 gap-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {result.first_name[0].toUpperCase() + result.last_name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold">
                          {result.first_name} {result.last_name}
                        </h3>
                        <p className="truncate text-sm text-gray-600">{result.email}</p>
                      </div>
                    </div>

                    <div className="min-w-0 text-sm text-gray-600">
                      {formatDistanceToNow(new Date(result.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>

                  <div className="">
                    <p className="line-clamp-2 text-sm text-gray-600">Your test results are in.</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
