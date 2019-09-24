import { getUser, getUserPermissions, loginUser } from '../../api/UsersEndpoints'
import router from '../../router'
import Cookies from 'js-cookie'

// Initial State
const initialState = () => {
  return {
    user: {
      role: {}
    },
    access_token: '',
    permissions_token: '',
    isUserLoggedIn: false,
    rememberMe: false
  }
}

export const UsersModule = {
  namespaced: true,
  state: initialState,
  getters: {
    user: state => state.user,
    isUserLoggedIn: state => state.isUserLoggedIn,
    isMegaAdmin: state => state.user.is_admin,
    isUserAdmin: state => state.user.role ? state.user.role.id !== 3 : null,
    getAccessToken: state => state.access_token,
    getPermissionsToken: state => JSON.stringify(state.permissions_token),
    rememberMe: state => state.rememberMe,
    userEmail: state => state.user.email,
    getTheme: state => state.user.dark_theme,
    userHasTeam: state => state.user.current_team
  },
  mutations: {
    // Set User Mutation
    SET_USER (state, user) {
      state.user = user
    },
    // Login User Mutation
    LOGIN_USER (state, token) {
      state.isUserLoggedIn = true
      state.access_token = token.access_token
    },
    // Logout User Mutation
    async LOGOUT_USER () {
      await this.commit('LOADING_DATA', true, { root: true })
      await this.commit('JanusModule/RESET_STATE', null, { root: true })
      await this.commit('TeamsModule/RESET_STATE', null, { root: true })
      await this.commit('SitesModule/RESET_STATE', null, { root: true })
      await this.commit('DevicesModule/RESET_STATE', null, { root: true })
      await this.commit('ViewsModule/RESET_STATE', null, { root: true })

      // Wait for 3 seconds for Janus to unload
      await new Promise((resolve, reject) => setTimeout(resolve, 3000))
      await this.commit('UsersModule/RESET_STATE', null, { root: true })
      await router.replace({ name: 'LoginView' })
      await this.commit('LOADING_DATA', false, { root: true })
    },
    SET_ACCESS_TOKEN (state, token) {
      state.access_token = token.access_token
    },
    SET_PERMISSIONS_TOKEN (state, token) {
      state.permissions_token = token
    },
    SET_REMEMBER_ME (state) {
      state.rememberMe = true
    },
    // Reset State
    RESET_STATE (state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    }
  },
  actions: {
    // Login User
    async loginUser ({ commit, dispatch, getters }, loginInfo) {
      const token = await loginUser(loginInfo)

      if (token) {
        commit('LOADING_DATA', true, { root: true })
        await commit('LOGIN_USER', token)
        await dispatch('getUser')

        // Check if the user set Remember Me to true
        if (loginInfo.rememberMe) {
          await commit('SET_REMEMBER_ME')
          await Cookies.set('rememberMe', 'true', { expires: 180 })
        } else {
          await Cookies.set('rememberMe', 'true')
        }

        // Get Permissions Token
        await dispatch('getPermissionsToken')
        if (getters.userHasTeam) {
          await router.replace({ name: 'LiveView' })
          await dispatch('reloadData', null, { root: true })
        } else {
          await commit('LOADING_DATA', false, { root: true })
          await router.replace({ name: 'LiveView' })
        }
      }
    },
    // Get Permissions Token
    async getPermissionsToken ({ commit }) {
      try {
        const permissionsToken = await getUserPermissions()
        commit('SET_PERMISSIONS_TOKEN', permissionsToken)
      } catch (e) {
        console.log(e)
      }
    },
    // Get User
    async getUser ({ commit }) {
      try {
        const user = await getUser()
        commit('SET_USER', user)
      } catch (e) {
        console.log(e)
      }
    },
    // Logout User
    async logoutUser ({ commit }) {
      commit('LOGOUT_USER')
    },
    setAccessToken ({ commit }, newToken) {
      commit('SET_ACCESS_TOKEN', newToken)
    }
  }
}
