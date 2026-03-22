import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary:   '#1565C0',
          secondary: '#42A5F5',
          success:   '#2E7D32',
          warning:   '#F57F17',
          error:     '#C62828',
          surface:   '#FFFFFF',
          background:'#F5F7FA',
        },
      },
    },
  },
})

createApp(App).use(vuetify).mount('#app')
