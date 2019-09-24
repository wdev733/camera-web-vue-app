import Janus from './janus'
import { generateIfuHandle } from './JanusVueUtils'
import Vue from 'vue'

export default {
  install (Vue, { store }) {
    // Register module when installing the plugin
    store.registerModule('JanusModule', JanusModule)

    // Init Janus
    Vue.prototype.$initJanus = (ifusList) => {
      store.dispatch('JanusModule/initJanus', ifusList)
    }

    // Attach Streams
    Vue.prototype.$attachStreams = async (cameras) => {
      // Attach each camera
      for (let i = 0; i < cameras.length; i++) {
        await store.dispatch('JanusModule/attachCamera', cameras[i])
      }
    }

    // Reset Ifu
    Vue.prototype.$resetIfu = async (ifuId) => {
      const ifuHandle = generateIfuHandle(ifuId)
      store.dispatch('JanusModule/resetIfu', { ifuId, handle: ifuHandle })
    }

    // Reset camera
    Vue.prototype.$resetCamera = async (camera) => {
      const ifuHandle = generateIfuHandle(camera.ifu_id)
      store.dispatch('JanusModule/resetCamera', { camera, handle: ifuHandle })
    }

    // Clear Streams
    Vue.prototype.$clearStreams = () => {
      store.dispatch('JanusModule/clearPlugins')
    }
  }
}

// Initial State
const initialState = () => {
  return {
    janusHandles: [],
    currentStreams: [],
    actualStreams: [],
    loadingStreams: false
  }
}

const JanusModule = {
  namespaced: true,
  state: initialState,
  getters: {
    getJanusHandles: state => state.janusHandles,
    getCurrentStreams: state => state.currentStreams,
    getActualStreams: state => state.actualStreams
  },
  mutations: {
    SET_NEW_JANUS_HANDLE (state, { ifu, handle }) {
      state.janusHandles = [ ...state.janusHandles, { ifu, handle } ]
    },
    ADD_NEW_STREAM (state, stream) {
      const foundStream = state.actualStreams.find(s => s.id === stream.id)
      const foundIndex = state.actualStreams.indexOf(foundStream)
      if (foundStream) {
        state.currentStreams.splice(foundIndex, 1, stream)
      } else {
        state.currentStreams.push(stream)
      }
    },
    SET_ACTUAL_STREAM (state, stream) {
      const foundStream = state.actualStreams.find(s => s.id === stream.id)
      const foundIndex = state.actualStreams.indexOf(foundStream)
      if (foundStream) {
        state.actualStreams.splice(foundIndex, 1, stream)
      } else {
        state.actualStreams.push(stream)
      }
    },
    CLEAR_HANDLES (state) {
      state.currentStreams = []
      state.actualStreams = []
    },
    REMOVE_JANUS_HANDLE (state, handleIfu) {
      const foundJanusHandle = state.janusHandles.find(h => h.ifu === handleIfu)
      const indexOfJanusHandle = state.janusHandles.indexOf(foundJanusHandle)
      if (foundJanusHandle) {
        foundJanusHandle.handle.destroy()
        state.janusHandles.splice(indexOfJanusHandle, 1)
      }
    },
    // Reset State
    async RESET_STATE (state) {
      for (let i = 0; i < state.janusHandles.length; i++) {
        await state.janusHandles[i].handle.destroy()
      }
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    }
  },
  actions: {
    initJanus ({ commit }, ifusList) {
      Janus.init({
        debug: process.env.NODE_ENV === 'development' ? 'all' : null,
        callback: () => {
          for (let i = 0; i < ifusList.length; i++) {
            const ifuHandle = generateIfuHandle(ifusList[i].id)
            commit('SET_NEW_JANUS_HANDLE', { ifu: ifusList[i].id, handle: ifuHandle })
          }
        }
      })
    },
    attachCamera ({ commit, getters }, camera) {
      const janusHandle = getters.getJanusHandles.find(h => h.ifu === camera.ifu_id)

      if (janusHandle) {
        // TODO: This is wank, it would be better if we waited for the actual session to be created.
        // Without the timeout we try and attach the plugin to the session before the session is created with Janus.
        setTimeout(() => {
          janusHandle.handle.attach(
            {
              opaqueId: 'test-' + camera.id,
              plugin: 'janus.plugin.streaming',
              success: (pluginHandle) => {
                commit('ADD_NEW_STREAM', { id: camera.id, plugin: pluginHandle })
                let body = { 'request': 'watch', id: parseInt(`${camera.id}1`) }
                pluginHandle.send({ 'message': body })
              },
              error: () => {
                Vue.prototype.$notify({
                  text: 'Error connecting to WebRTC Server on IFU ' + janusHandle.ifu,
                  type: 'error',
                  group: 'notifications'
                })
                commit('REMOVE_JANUS_HANDLE', janusHandle.ifu)
              },
              onmessage: (msg, jsep) => {
                if (msg.error) {
                  commit('REMOVE_JANUS_HANDLE', janusHandle.ifu)
                }
                Janus.log('message', msg)
                if (jsep !== undefined && jsep !== null) {
                  // Offer from the plugin, let's answer
                  const foundStream = getters.getCurrentStreams.find(s => s.id === camera.id)

                  if (foundStream) {
                    if (jsep.type === 'offer') {
                      foundStream.plugin.createAnswer(
                        {
                          jsep,
                          media: { audioSend: false, videoSend: false },
                          success: (jsep) => {
                            const body = { 'request': 'start' }
                            foundStream.plugin.send({ 'message': body, 'jsep': jsep })
                          },
                          error: (error) => {
                            Janus.error('WebRTC error:', error)
                          }
                        }
                      )
                    } else {
                      foundStream.plugin.handleRemoteJsep({ jsep: jsep })
                    }
                  }
                }
              },
              onremotestream: async (stream) => {
                await commit('SET_ACTUAL_STREAM', { id: camera.id, stream })
              }
            })
        }, 2000)
      }
    },
    async clearPlugins ({ commit, getters }) {
      for (let i = 0; i < getters.getCurrentStreams.length; i++) {
        if (getters.getCurrentStreams[i].plugin) {
          await getters.getCurrentStreams[i].plugin.detach()
        }
      }
      commit('CLEAR_HANDLES')
    },
    resetIfu ({ commit, dispatch, rootGetters }, { ifuId, handle }) {
      commit('REMOVE_JANUS_HANDLE', ifuId)
      commit('SET_NEW_JANUS_HANDLE', { ifu: ifuId, handle })
      const camerasList = rootGetters['DevicesModule/getUserCameras']

      for (let i = 0; i < camerasList.length; i++) {
        dispatch('attachCamera', camerasList[i])
      }
    }
  }
}
