import { extendTheme } from '@chakra-ui/react'

export const colorScheme = {
  default: {
    50: '#f9fbe7',
    100: '#f0f4c3',
    200: '#e6ee9c',
    300: '#dce775',
    400: '#d4e157',
    500: '#cddc39',
    600: '#c0ca33',
    700: '#afb42b',
    800: '#9e9d24',
    900: '#827717'
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
