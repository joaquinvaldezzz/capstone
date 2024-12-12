'use client'

import { useEffect } from 'react'

export function CalendlyEmbed({ url }: { url: string }) {
  useEffect(() => {
    const head = document.querySelector('head')
    const link = document.createElement('link')
    const script = document.createElement('script')

    link.rel = 'stylesheet'
    link.href = 'https://assets.calendly.com/assets/external/widget.css'

    script.setAttribute('src', 'https://assets.calendly.com/assets/external/widget.js')

    if (head == null) return

    head.appendChild(link)
    head.appendChild(script)
  }, [])

  return (
    <div className="calendly-inline-widget size-full max-w-(--breakpoint-md)" data-url={url}></div>
  )
}
