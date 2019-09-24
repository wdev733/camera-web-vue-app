import { getAllViews } from '../../api/ViewsEndpoints'

// Initial State
const initialState = () => {
  return {
    userViews: [],
    selectedView: {}
  }
}

export const ViewsModule = {
  namespaced: true,
  state: initialState,
  getters: {
    userViews: state => state.userViews,
    selectedView: state => state.selectedView,
    // Get Team Views
    getTeamViews: state => state.userViews.filter(v => v.type === 'team'),
    // Get Personal Views
    getPersonalViews: state => state.userViews.filter(v => v.type === 'user')
  },
  mutations: {
    // Set User Views Mutation
    SET_USER_VIEWS (state, views) {
      state.userViews = views
    },
    // Set Current View Mutation
    SET_CURRENT_VIEW (state, view) {
      state.selectedView = view
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
    // Get User Views
    async getUserViews ({ commit, state, getters }, type) {
      try {
        const views = await getAllViews()
        if (views) {
          commit('SET_USER_VIEWS', views)
          switch (type) {
            case 'delete':
              commit('SET_CURRENT_VIEW', views[views.length - 1])
              break
            case 'loadLive':
              break
            case 'loadSetup':
              if (!state.selectedView.id) {
                commit('SET_CURRENT_VIEW', views[0])
              }
              break
            case 'new':
              if (views.length === 1) {
                commit('SET_CURRENT_VIEW', views[0])
              } else {
                commit('SET_CURRENT_VIEW', views[views.length - 1])
              }
              break
            default:
              const foundView = views.find(v => v.id === state.selectedView.id)
              commit('SET_CURRENT_VIEW', foundView)
              break
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // Set Selected View
    setSelectedView ({ commit }, view) {
      commit('SET_CURRENT_VIEW', view)
    }
  }
}
