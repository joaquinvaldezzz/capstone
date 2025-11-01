import { mails } from '@/_app/(dashboards)/patient/data'
import { atom, useAtom } from 'jotai'

import type { Result } from '@/lib/dal'

interface Config {
  selected: Result['result_id'] | null
}

const configAtom = atom<Config>({
  selected: mails[0].result_id,
})

export function useMail() {
  return useAtom(configAtom)
}
