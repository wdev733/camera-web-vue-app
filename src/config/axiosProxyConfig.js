import axios from 'axios'
import store from '../store'

// Axios Config
const axiosProxyConfig = axios.create({
  baseURL: '',
  timeout: 10000
})

const addPermissionsToken = (config) => {
  let token = store.getters['UsersModule/getPermissionsToken']

  if (token) {
    config.headers['permissions'] = token
  }
}

// Request Interceptor
axiosProxyConfig.interceptors.request.use(
  (config) => {
    addPermissionsToken(config)
    return config
  },

  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosProxyConfig.interceptors.response.use(
  async (response) => {
    return response
  },

  async (error) => {
    return Promise.reject(error)
  }
)

export default axiosProxyConfig
