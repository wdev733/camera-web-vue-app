import axiosProxyConfig from '../config/axiosProxyConfig'

const generateProxyURL = (ifuId) => `https://ifu-${ifuId}.proxy.onvp.io/`

// Absolute Move Camera
export const absoluteMove = async (cameraId, ifuId, moveData) => {
  axiosProxyConfig.defaults.baseURL = generateProxyURL(ifuId)
  const url = `/camera/${cameraId}/ptz/onvif/absolute-move`

  try {
    const { data } = await axiosProxyConfig.post(url, { ...moveData })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Relative Move Camera
export const relativeMove = async (cameraId, ifuId, moveData) => {
  axiosProxyConfig.defaults.baseURL = generateProxyURL(ifuId)
  const url = `/camera/${cameraId}/ptz/onvif/relative-move`

  try {
    const { data } = await axiosProxyConfig.post(url, { ...moveData })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Continuous Move Camera
export const continuousMove = async (cameraId, moveData) => {
  const url = `/camera/${cameraId}/ptz/onvif/continuous-move`

  try {
    const { data } = await axiosProxyConfig.post(url, { ...moveData })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Stop Camera
export const stopCamera = async (cameraId, stopData) => {
  const url = `/camera/${cameraId}/ptz/onvif/stop`

  try {
    const { data } = await axiosProxyConfig.post(url, { ...stopData })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Get Snapshot from Camera
export const getSnapshot = async (cameraId) => {
  const url = `/camera/${cameraId}/onvif/get-snapshot`

  try {
    const { data } = await axiosProxyConfig.get(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Get Camera Status
export const getCameraStatus = async (cameraId) => {
  const url = `/camera/${cameraId}/admin/onvif/get-status`

  try {
    const { data } = await axiosProxyConfig.get(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Reboot Camera
export const rebootCamera = async (cameraId) => {
  const url = `/camera/${cameraId}/admin/onvif/reboot`

  try {
    const { data } = await axiosProxyConfig.post(url)
    return data
  } catch (e) {
    console.log(e)
  }
}
