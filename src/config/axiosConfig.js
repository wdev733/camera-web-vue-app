import axios from 'axios'
import store from '../store'
import { tokenRefresh } from '../api/UsersEndpoints'
import Vue from 'vue'
import router from '../router'

// Axios Config
const axiosConfig = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 10000
})

const addToken = (config) => {
  let token = store.getters['UsersModule/getAccessToken']

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
}

// Request Interceptor
axiosConfig.interceptors.request.use(
  (config) => {
    addToken(config)
    return config
  },

  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosConfig.interceptors.response.use(
  async (response) => {
    return response
  },

  async (error) => {
    const { response } = error
    if (response.data.message === 'Unauthenticated.') {
      try {
        const newToken = await tokenRefresh()
        if (newToken) {
          await store.dispatch('UsersModule/setAccessToken', newToken)
          return await axiosConfig.request(error.config)
        }
      } catch (e) {
        await store.dispatch('UsersModule/logoutUser')
        router.replace({ name: 'LoginView' })
      }
    } else {
      Vue.prototype.$notify({
        group: 'notifications',
        text: response.data.message,
        type: 'error'
      })
      return Promise.reject(error)
    }
  }
)

export default axiosConfig
