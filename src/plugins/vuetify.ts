/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

const defaultTheme =
  window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    : 'dark';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme,
    themes: {
      'dark': {
        colors: {
          background: '#09060c',
          surface: '#17101e',
          primary: '#452d8f'
        }
      },
      'light': {
        colors: {
          background: '#f8fafc',
          surface: '#fff',
          primary: '#452d8f'
        }
      }
    }
  },
})
