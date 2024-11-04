'use client'

import { Fragment, type ReactNode } from 'react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

export const ProgressBarProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      {children}
      <ProgressBar color="hsl(var(--primary))" height="2px" options={{ showSpinner: false }} />
    </Fragment>
  )
}
