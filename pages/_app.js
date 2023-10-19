import { useState, useEffect } from 'react'

import { AnimatePresence } from 'framer-motion'
import { ChakraProvider } from '@chakra-ui/react'

import Layout from '../components/layouts/main'
import Fonts from '../components/fonts'
import Theme from '../lib/theme'
import { colorScheme } from '../lib/theme'

import './styles.css'

const CardGame = ({ Component, pageProps, router }) => {
  const availableThemes = Object.keys(colorScheme || {})
  const [theme, setTheme] = useState('black')

  const themeObject = {
    theme,
    setTheme: targetThemeName => {
      setTheme(targetThemeName)
      localStorage.setItem('DIIPIKS-theme', targetThemeName)
    },
    colorScheme,
    availableThemes
  }

  useEffect(() => {
    const localTheme = localStorage.getItem('DIIPIKS-theme')

    if (availableThemes.includes(localTheme)) {
      setTheme(localTheme)
    } else {
      setTheme(availableThemes[0])
    }
  }, [])

  return (
    <ChakraProvider theme={Theme}>
      <Fonts />
      <Layout themeObject={themeObject}>
        <AnimatePresence>
          <Component
            key={router.route}
            themeObject={themeObject}
            {...pageProps}
          />
        </AnimatePresence>
      </Layout>
    </ChakraProvider>
  )
}

export default CardGame
