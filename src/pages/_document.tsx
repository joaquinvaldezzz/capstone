import { Head, Html, Main, NextScript } from 'next/document'

export default function Document(): JSX.Element {
  return (
    <Html className="h-full" lang="en">
      <Head />
      <body className="h-full min-w-80 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
