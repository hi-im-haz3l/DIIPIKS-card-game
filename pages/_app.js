import { AnimatePresence } from 'framer-motion'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'

import Layout from 'layouts/main'
import AuthWrapper from 'layouts/auth-wrapper'
import Fonts from 'components/fonts'
import Theme from 'lib/theme'

import 'lib/styles.css'

const CardGame = ({ Component, pageProps: { session, ...pageProps } }) => {
  let baseURL
  if (typeof window !== 'undefined') {
    baseURL = window.location.origin
  }

  return (
    <ChakraProvider theme={Theme}>
      <Fonts />
      <Layout>
        <AnimatePresence>
          {Component.auth ? (
            <SessionProvider session={session}>
              <AuthWrapper args={Component.auth}>
                <Component baseURL={baseURL} {...pageProps} />
              </AuthWrapper>
            </SessionProvider>
          ) : (
            <Component baseURL={baseURL} {...pageProps} />
          )}
        </AnimatePresence>
      </Layout>
    </ChakraProvider>
  )
}

export default CardGame
