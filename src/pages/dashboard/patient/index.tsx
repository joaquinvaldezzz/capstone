import { type GetServerSidePropsResult } from 'next'

import connectToDatabase from '~/lib/connectToDatabase'
import Messages, { type Message } from '~/models/Messages'
import { MailList } from '~/components/ui/main-list'
import PatientLayout from '~/components/layout/patient'

interface MessageProps {
  messages: Message[]
}

export default function Patient({ messages }: MessageProps): JSX.Element {
  return (
    <PatientLayout>
      <h1 className="text-2xl font-semibold">Inbox</h1>
      <MailList items={messages} />
    </PatientLayout>
  )
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<Message>> {
  await connectToDatabase()

  const query = await Messages.find({})
  const messages = query.map((data) => JSON.parse(JSON.stringify(data)))

  return {
    props: { messages },
  } as unknown as GetServerSidePropsResult<Message>
}
