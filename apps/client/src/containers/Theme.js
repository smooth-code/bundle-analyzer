import React from 'react'
import { theme as suiTheme } from '@smooth-ui/core-sc'
import { ThemeProvider } from 'styled-components'
import { rpxTransformers } from '@xstyled/system'

const theme = {
  ...suiTheme,
  colors: {
    ...suiTheme.colors,
    light: {
      green: '#53c79f',
      blue: '#64b0cc',
      violet: '#7a6fca',
      pink: '#ca6f96',
      orange: '#e58c72',
      yellow: '##e5c072',
    },
    blue: '#0a80cc',
    dark: '#424a52',
    gray900: '#242830',
    gray800: '#2c323e',
    gray600: '#8A94A7',
    primary: '#0a80cc',
  },
  space: {
    ...suiTheme.space,
    '0': 0,
    '1': 4,
    '2': 8,
    '3': 16,
    '4': 24,
    '5': 48,
    textFormControl: {
      y: {
        base: '0.25rem',
      },
    },
  },
  sizes: {
    ...suiTheme.sizes,
    container: 1040,
  },
  transformers: {
    ...rpxTransformers,
  },
}

export function ThemeInitializer({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
