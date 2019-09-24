// Get Ifus List
import Janus from './janus'
import Vue from 'vue'
import store from '../../store'

const getIfusList = (streams) => {
  let result = []
  for (let i = 0; i < streams.length; i++) {
    if (!result.includes(streams[i].ifuId)) {
      result.push(streams[i].ifuId)
    }
  }
  return result
}

const generateServerURL = (ifuId) => {
  const proxyUrl = process.env.VUE_APP_PROXY_URL
  return proxyUrl.replace(/{id}/, ifuId)
}

// Parse Streams
export const parseStreams = (streams) => {
  let result = []
  const ifusList = getIfusList(streams)
  for (let i = 0; i < ifusList.length; i++) {
    let ifuId = ifusList[i]
    result.push({
      ifu: ifuId,
      ifuServer: generateServerURL(ifuId)
    })
  }
  return result
}

export const generateIfuHandle = (ifu) => {
  return new Janus(
    {
      iceServers: [{
        urls: 'turn:52.213.27.209:3478',
        username: 'onvp',
        credential: 'onvp'
      }],
      server: generateServerURL(ifu),
      success: () => {},
      error: (cause) => {
        Vue.prototype.$notify({
          text: 'Error connecting to WebRTC Server on IFU ' + ifu,
          type: 'error',
          group: 'notifications'
        })
        store.commit('JanusModule/REMOVE_JANUS_HANDLE', ifu)
      },
      destroyed: () => {
        console.log('Destroyed from inside janus handle')
      }
    })
}
