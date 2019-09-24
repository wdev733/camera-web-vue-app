import { getAllDevices } from '../../api/DevicesEndpoints'

// Initial State
const initialState = () => {
  return {
    userDevices: [],
    selectedCamera: {}
  }
}

export const DevicesModule = {
  namespaced: true,
  state: initialState,
  getters: {
    userDevices: state => state.userDevices,
    getUserCameras: state => state.userDevices.filter(device => device.type === 'cameras'),
    getUserIfus: state => state.userDevices.filter(device => device.type === 'ifus'),
    // Get Devices By Site
    getDevicesBySite: (state, getters, rootState, rootGetters) => {
      const currentSiteID = rootGetters['SitesModule/currentSite'].id
      return state.userDevices.filter(device => device.site_id === currentSiteID)
    },
    // Get User Cameras By Site
    userCamerasBySite: (state, getters, rootState, rootGetters) => {
      const currentSiteID = rootGetters['SitesModule/currentSite'].id
      return state.userDevices.filter(device => device.type === 'cameras' && device.site_id === currentSiteID)
    },
    getSelectedCamera: state => state.selectedCamera
  },
  mutations: {
    // Set User Devices Mutation
    SET_USER_DEVICES (state, devices) {
      state.userDevices = devices
    },
    // Set Selected Camera Mutation
    SET_SELECTED_CAMERA (state, camera) {
      state.selectedCamera = camera
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
    // Get User Devices
    async getUserDevices ({ commit }) {
      const devicesList = await getAllDevices()
      let allDevices = []

      // Iterate Through the Response Object and Add the Devices List
      for (const key in devicesList) {
        if (devicesList.hasOwnProperty(key)) {
          let list = devicesList[key].map(s => {
            return { ...s, type: key }
          })
          allDevices.push(...list)
        }
      }
      commit('SET_USER_DEVICES', allDevices)
    },
    // Select Camera for Edit
    setSelectedCamera ({ commit }, camera) {
      commit('SET_SELECTED_CAMERA', camera)
    }
  }
}
