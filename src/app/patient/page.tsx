import { Fragment } from 'react'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inbox',
}

export default async function Page() {
  return (
    <Fragment>
      {/* <div className="flex flex-1 flex-col">
        <div className="flex items-start p-4">
          <div className="flex items-start gap-4 text-sm">
            <Avatar>
              <AvatarImage alt={mail.name} />
              <AvatarFallback>
                {mail.name
                  .split(' ')
                  .map((chunk) => chunk[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="font-semibold">{mail.name}</div>
              <div className="line-clamp-1 text-xs">{mail.subject}</div>
              <div className="line-clamp-1 text-xs">
                <span className="font-medium">Reply-To:</span> {mail.email}
              </div>
            </div>
          </div>
          {mail.date && (
            <div className="ml-auto text-xs text-muted-foreground">
              {format(new Date(mail.date), 'PPpp')}
            </div>
          )}
        </div>
      </div> */}
      <h2>Hello</h2>
    </Fragment>
  )
}
