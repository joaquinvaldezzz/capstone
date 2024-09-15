import { atom, useAtom } from 'jotai'

import { type Result } from '@/lib/dal'
import { mails } from '@/app/(dashboards)/patient/data'

interface Config {
  selected: Result['result_id'] | null
}

const configAtom = atom<Config>({
  selected: mails[0].result_id,
})

export function useMail() {
  return useAtom(configAtom)
}
