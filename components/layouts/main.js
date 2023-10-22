import Head from 'next/head'
import { Container } from '@chakra-ui/react'

const Main = ({ themeObject, children }) => {
  const { theme } = themeObject

  return (
    <Container
      as="main"
      maxW="8xl"
      position="relative"
      display="flex"
      flexDirection="column"
      h="100dvh"
      backgroundColor={(theme?.colors && theme.colors[200]) || 'default.200'}
      transition=".2s"
      overflow="hidden"
    >
      <Head>
        <title>:DIIPIKS - Card game</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content=":DIIPIKS - Card game" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#333333" />
        <meta name="msapplication-TileColor" content="#333333" />
        <meta name="theme-color" content="#333333" />
        <meta property="og:url" content="https://diipiks.fi/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content=":DIIPIKS - Card game" />
      </Head>

      {children}
    </Container>
  )
}

export default Main
