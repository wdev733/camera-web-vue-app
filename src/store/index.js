import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import Cookies from 'js-cookie'

// Import Modules
import { UsersModule } from './modules/UsersModule'
import { TeamsModule } from './modules/TeamsModule'
import { SitesModule } from './modules/SitesModule'
import { DevicesModule } from './modules/DevicesModule'
import { ViewsModule } from './modules/ViewsModule'

Vue.use(Vuex)

// Store Persistence in Cookies
const vuexCookie = new VuexPersist({
  restoreState: (key, storage) => Cookies.getJSON('app'),
  saveState: (key, state, storage) =>
    Cookies.set('app', state, {
      expires: 3
    }),
  modules: ['UsersModule']
})

// Store Persistence in Local Storage
const vuexLocal = new VuexPersist({
  storage: window.localStorage,
  key: 'app',
  modules: ['TeamsModule', 'SitesModule', 'DevicesModule', 'ViewsModule']
})

export default new Vuex.Store({
  plugins: [vuexCookie.plugin, vuexLocal.plugin],
  modules: {
    UsersModule,
    TeamsModule,
    SitesModule,
    DevicesModule,
    ViewsModule
  },
  state: {
    loadingData: false
  },
  getters: {
    loadingData: state => state.loadingData
  },
  mutations: {
    // Set Global Loading Mutation
    LOADING_DATA (state, visible) {
      state.loadingData = visible
    }
  },
  actions: {
    // Global Reset Data When Team Changes
    async reloadData ({ commit, dispatch }) {
      commit('LOADING_DATA', true)
      await dispatch('UsersModule/getUser', null, { root: true })
      await dispatch('TeamsModule/getUserTeams', null, { root: true })
      await dispatch('SitesModule/getUserSites', null, { root: true })
      await dispatch('DevicesModule/getUserDevices', null, { root: true })
      commit('LOADING_DATA', false)
    },
    // Set Global Loading
    setDataLoading ({ commit }, visible) {
      commit('LOADING_DATA', visible)
    }
  }
})
