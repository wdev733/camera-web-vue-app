// Imports
import { getAllSites } from '../../api/SitesEndpoints'

// Initial State
const initialState = () => {
  return {
    userSites: [],
    selectedSite: {},
    currentSite: {}
  }
}

export const SitesModule = {
  namespaced: true,
  state: initialState,
  getters: {
    userSites: state => state.userSites,
    selectedSite: state => state.selectedSite,
    currentSite: state => state.currentSite
  },
  mutations: {
    // Set User's Sites Mutation
    SET_USER_SITES (state, sites) {
      state.userSites = [ ...sites ]
    },
    // Select Site for Edit Mutation
    SELECT_SITE (state, site) {
      state.selectedSite = { ...site }
    },
    // Set User's Current Site Mutation
    SET_CURRENT_SITE (state, site) {
      state.currentSite = { ...site }
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
    // Get All User's Sites
    async getUserSites ({ commit }) {
      const sites = await getAllSites()
      commit('SET_USER_SITES', sites)
      commit('SET_CURRENT_SITE', sites[0])
    },
    // Select Site for Edit
    selectSite ({ commit }, site) {
      commit('SELECT_SITE', site)
    },
    // Set User's Current Site
    setCurrentSite ({ commit }, site) {
      commit('SET_CURRENT_SITE', site)
    }
  }
}
