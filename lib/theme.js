import { extendTheme } from '@chakra-ui/react'

export const colorScheme = {
  Lime: {
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
  },
  Lavender: {
    50: '#f3e5f5',
    100: '#e1bee7',
    200: '#ce93d8',
    300: '#ba68c8',
    400: '#ab47bc',
    500: '#9c27b0',
    600: '#8e24aa',
    700: '#7b1fa2',
    800: '#6a1b9a',
    900: '#4a136c'
  }
  // a: {
  //   50: '#f3e5f5',
  //   100: '#e1bee7',
  //   200: '#ce93d8',
  //   300: '#ba68c8',
  //   400: '#ab47bc',
  //   500: '#9c27b0',
  //   600: '#8e24aa',
  //   700: '#7b1fa2',
  //   800: '#6a1b9a',
  //   900: '#4a148c'
  // },
  // b: {
  //   50: '#f3e5f5',
  //   100: '#e1bee7',
  //   200: '#ce93d8',
  //   300: '#ba68c8',
  //   400: '#ab47bc',
  //   500: '#9c27b0',
  //   600: '#8e24aa',
  //   700: '#7b1fa2',
  //   800: '#6a1b9a',
  //   900: '#4a148c'
  // },
  // c: {
  //   50: '#f3e5f5',
  //   100: '#e1bee7',
  //   200: '#ce93d8',
  //   300: '#ba68c8',
  //   400: '#ab47bc',
  //   500: '#9c27b0',
  //   600: '#8e24aa',
  //   700: '#7b1fa2',
  //   800: '#6a1b9a',
  //   900: '#4a148c'
  // },
  // d: {
  //   50: '#f3e5f5',
  //   100: '#e1bee7',
  //   200: '#ce93d8',
  //   300: '#ba68c8',
  //   400: '#ab47bc',
  //   500: '#9c27b0',
  //   600: '#8e24aa',
  //   700: '#7b1fa2',
  //   800: '#6a1b9a',
  //   900: '#4a148c'
  // },
  // e: {
  //   50: '#f3e5f5',
  //   100: '#e1bee7',
  //   200: '#ce93d8',
  //   300: '#ba68c8',
  //   400: '#ab47bc',
  //   500: '#9c27b0',
  //   600: '#8e24aa',
  //   700: '#7b1fa2',
  //   800: '#6a1b9a',
  //   900: '#4a148c'
  // },
  // f: {
  //   50: '#f3e5f5',
  //   100: '#e1bee7',
  //   200: '#ce93d8',
  //   300: '#ba68c8',
  //   400: '#ab47bc',
  //   500: '#9c27b0',
  //   600: '#8e24aa',
  //   700: '#7b1fa2',
  //   800: '#6a1b9a',
  //   900: '#4a148c'
  // },
  // g: {
  //   50: '#f3e5f5',
  //   100: '#e1bee7',
  //   200: '#ce93d8',
  //   300: '#ba68c8',
  //   400: '#ab47bc',
  //   500: '#9c27b0',
  //   600: '#8e24aa',
  //   700: '#7b1fa2',
  //   800: '#6a1b9a',
  //   900: '#4a148c'
  // },
  // h: {
  //   50: '#f3e5f5',
  //   100: '#e1bee7',
  //   200: '#ce93d8',
  //   300: '#ba68c8',
  //   400: '#ab47bc',
  //   500: '#9c27b0',
  //   600: '#8e24aa',
  //   700: '#7b1fa2',
  //   800: '#6a1b9a',
  //   900: '#4a148c'
  // },
  // i: {
  //   50: '#f3e5f5',
  //   100: '#e1bee7',
  //   200: '#ce93d8',
  //   300: '#ba68c8',
  //   400: '#ab47bc',
  //   500: '#9c27b0',
  //   600: '#8e24aa',
  //   700: '#7b1fa2',
  //   800: '#6a1b9a',
  //   900: '#4a148c'
  // },
  // j: {
  //   50: '#f3e5f5',
  //   100: '#e1bee7',
  //   200: '#ce93d8',
  //   300: '#ba68c8',
  //   400: '#ab47bc',
  //   500: '#9c27b0',
  //   600: '#8e24aa',
  //   700: '#7b1fa2',
  //   800: '#6a1b9a',
  //   900: '#4a148c'
  // }
}

const styles = {
  global: {
    body: {
      bg: '#333'
    }
  }
}

const components = {
  Button: {
    variants: {
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
      }
    }
  }
}

const theme = extendTheme({ styles, components, colors: colorScheme })
export default theme