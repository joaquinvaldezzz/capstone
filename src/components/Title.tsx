import Head from 'next/head'

interface TitleProps {
  children: string
}

export default function Title({ children }: TitleProps): JSX.Element {
  return (
    <Head>
      <title>{children}</title>
    </Head>
  )
}
