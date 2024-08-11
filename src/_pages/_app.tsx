import type { AppProps } from 'next/app'
import Head from 'next/head'

import '~/styles/main.css'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/images/logo.png" sizes="48x48" />
      </Head>

      <Component {...pageProps} />
    </>
  )
}
