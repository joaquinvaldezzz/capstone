'use client'

import { Fragment } from 'react'

import { type Result } from '@/lib/dal'
import { useMail } from '@/hooks/use-mail'

import { mails } from '../data'
import { MailDisplay } from './mail-display'
import { MailList } from './mail-list'

export function Mail({ results }: { results: Result[] | undefined }) {
  const [mail] = useMail()

  return (
    <Fragment>
      {results != null && <MailList results={results} />}
      <MailDisplay mail={mails.find((item) => item.result_id === mail.selected) ?? undefined} />
    </Fragment>
  )
}
