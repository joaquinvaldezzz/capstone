'use client'

import { Fragment } from 'react'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

import type { ReactNode } from 'react'

const ProgressBarProvider = ({ children }: { children: ReactNode }) => (
  <Fragment>
    {children}
    <ProgressBar color="hsl(var(--primary))" height="2px" options={{ showSpinner: false }} />
  </Fragment>
)

export default ProgressBarProvider
