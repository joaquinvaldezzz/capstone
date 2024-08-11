import { type Message } from '~/models/Messages'

interface MailListProps {
  items: Message[]
}

export function MailList({ items }: MailListProps): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <button
          className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
          type="button"
          key={item._id as string}
        >
          <div className="font-semibold">{item.sender}</div>
          <div className="text-sm font-medium">{item.subject}</div>
          <p className="line-clamp-2 text-xs text-muted-foreground">{item.message}</p>
        </button>
      ))}
    </div>
  )
}
