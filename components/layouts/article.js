import Head from 'next/head'
import { Container } from '@chakra-ui/react'

const Layout = ({ title, children }) => (
  <Container
    as="main"
    maxW="8xl"
    position="relative"
    display="flex"
    flexDirection="column"
    h="100dvh"
    transition=".2s"
    overflow="hidden"
  >
    {title && (
      <Head>
        <title>{`${title} - :DIIPIKS`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="og:title" content={title} />
      </Head>
    )}
    {children}
  </Container>
)

export default Layout
