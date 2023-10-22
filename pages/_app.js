import { useState, useEffect } from 'react'

import { AnimatePresence } from 'framer-motion'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'

import Layout from 'layouts/main'
import AuthWrapper from 'layouts/auth-wrapper'
import Fonts from 'components/fonts'
import Theme from 'lib/theme'

import 'lib/styles.css'

const CardGame = ({ Component, pageProps: { session, ...pageProps } }) => {
  const [availableThemes, setAvailableThemes] = useState([])
  const [theme, setTheme] = useState('default')

  const themeObject = {
    theme,
    setTheme: selectedTheme => {
      setTheme(selectedTheme)
      localStorage.setItem('DIIPIKS-theme-data', JSON.stringify(selectedTheme))
    },
    availableThemes,
    setAvailableThemes
  }

  useEffect(() => {
    const localTheme = localStorage.getItem('DIIPIKS-theme-data')

    if (localTheme) {
      setTheme(JSON.parse(localTheme))
    }
  }, [])

  return (
    <ChakraProvider theme={Theme}>
      <Fonts />
      <Layout themeObject={themeObject}>
        <AnimatePresence>
          {Component.auth ? (
            <SessionProvider session={session}>
              <AuthWrapper args={Component.auth}>
                <Component themeObject={themeObject} {...pageProps} />
              </AuthWrapper>
            </SessionProvider>
          ) : (
            <Component themeObject={themeObject} {...pageProps} />
          )}
        </AnimatePresence>
      </Layout>
    </ChakraProvider>
  )
}

export default CardGame
