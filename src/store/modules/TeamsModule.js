// Imports
import { getAllTeams, getTeam } from '../../api/TeamsEndpoints'

// Initial State
const initialState = () => {
  return {
    userTeams: [],
    currentTeam: {},
    selectedTeam: {}
  }
}

export const TeamsModule = {
  namespaced: true,
  state: initialState,
  getters: {
    userTeams: state => state.userTeams,
    currentTeam: state => state.currentTeam,
    selectedTeam: state => state.selectedTeam,
    teamMembers: state => state.currentTeam.users
  },
  mutations: {
    // Set User's Teams Mutation
    SET_USER_TEAMS (state, teams) {
      state.userTeams = [ ...teams ]
    },
    // Set User's Current Team Mutation
    SET_CURRENT_TEAM (state, team) {
      state.currentTeam = team
    },
    // Select Team for Edit Mutation
    SELECT_TEAM (state, team) {
      state.selectedTeam = { ...team }
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
    // Get All User's Teams
    async getUserTeams ({ commit }) {
      const teams = await getAllTeams()
      await commit('SET_USER_TEAMS', teams)
      const currentTeam = teams.find(t => t.current_team)
      if (currentTeam.role.id !== 3) {
        const myTeam = await getTeam(currentTeam.id)
        commit('SET_CURRENT_TEAM', myTeam)
      } else {
        commit('SET_CURRENT_TEAM', currentTeam)
      }
    },
    // Set User's Current Team
    setCurrentTeam ({ commit }, team) {
      commit('SET_CURRENT_TEAM', team)
    },
    // Select Team for Edit
    selectTeam ({ commit }, team) {
      commit('SELECT_TEAM', team)
    }
  }
}
