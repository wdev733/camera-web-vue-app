// Imports
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import Notifications from 'vue-notification'
import Fullscreen from 'vue-fullscreen'
import VueTheMask from 'vue-the-mask'
import Gravatar from 'vue-gravatar'
import JanusVue from './plugins/JanusPlugin/JanusVue'
import * as VueGoogleMaps from 'vue2-google-maps'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

// CSS Imports
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@dattn/dnd-grid/dist/dnd-grid.css'

require('dotenv').config()

// Plugins Installation
Vue.use(BootstrapVue)
Vue.use(Vuelidate)
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAPS_API,
    libraries: 'places, geocode'
  }
})
Vue.use(Notifications)
Vue.use(Fullscreen)
Vue.use(VueTheMask)
Vue.use(JanusVue, { store })
Vue.component('v-gravatar', Gravatar)

if (process.env.NODE_ENV === 'production') {
  // Sentry Config
  Sentry.init({
    environment: process.env.NODE_ENV,
    dsn: process.env.VUE_APP_SENTRY_URL,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })]
  })
}

Vue.config.productionTip = false

// Check for Theme and Render Vue App Accordingly
const checkDarkTheme = async () => {
  if (store.getters['UsersModule/getTheme']) {
    await import('@/assets/theme/dist/assets/css/theme-dark.min.css')
  } else {
    await import('@/assets/theme/dist/assets/css/theme.min.css')
  }
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

checkDarkTheme().catch(err => console.log(err))
