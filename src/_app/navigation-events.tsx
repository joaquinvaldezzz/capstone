'use client'

import { Fragment, type ReactNode } from 'react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

export function NavigationEvents({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      {children}
      <ProgressBar
        color="#3c704e"
        options={{
          showSpinner: false,
        }}
      />
    </Fragment>
  )
}
