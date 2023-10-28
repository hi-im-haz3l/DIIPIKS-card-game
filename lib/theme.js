import { extendTheme } from '@chakra-ui/react'

export const colorScheme = {
  default: {
    50: '#eceff1',
    100: '#cfd8dc',
    200: '#b0bec5',
    300: '#90a4ae',
    400: '#78909c',
    500: '#607d8b',
    600: '#546e7a',
    700: '#455a64',
    800: '#37474f',
    900: '#263238'
  }
}

const styles = {
  global: {
    body: {
      bg: '#333',
      color: '#333'
    }
  }
}

const components = {
  Button: {
    variants: {
      transparent: {
        bg: '#00000000',
        transition: '300ms',
        _hover: {
          bg: 'blackAlpha.200'
        },
        _active: {
          bg: 'blackAlpha.300'
        }
      },
      transparent_rounded: {
        bg: '#00000000',
        borderRadius: 'full',
        transition: '300ms',
        _hover: {
          bg: 'blackAlpha.200'
        },
        _active: {
          bg: 'blackAlpha.300'
        }
      },
      white: {
        bg: '#fff',
        color: '#000',
        transition: '300ms',
        _hover: {
          bg: 'whiteAlpha.900'
        },
        _active: {
          bg: 'whiteAlpha.800'
        }
      }
    }
  }
}

const theme = extendTheme({ styles, components, colors: colorScheme })
export default theme
