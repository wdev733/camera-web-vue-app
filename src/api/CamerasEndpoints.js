import axiosConfig from '../config/axiosConfig'

const baseURL = '/cameras'

// Get All Cameras
export const getAllCameras = async (siteId) => {
  const queryParams = `?site=${siteId}`
  try {
    const { data } = await axiosConfig.get(baseURL + queryParams)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Get a Single Camera
export const getCamera = async (cameraId) => {
  const url = baseURL + `/${cameraId}`
  try {
    const { data } = await axiosConfig.get(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Update a Camera
export const updateCamera = async (cameraId, cameraData) => {
  const url = baseURL + `/${cameraId}`

  try {
    const { data } = await axiosConfig.put(url, { ...cameraData })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Disassociate a Camera
export const disassociateCamera = async (cameraId) => {
  const url = baseURL + `/${cameraId}/disassociate`

  try {
    const { data } = await axiosConfig.post(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Get Camera Permissions
export const getCameraPermissions = async (cameraId, userId) => {
  const url = baseURL + `/${cameraId}/permissions`
  const queryParams = `?user=${userId}`

  try {
    const { data } = await axiosConfig.get(url + queryParams)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Change Camera Permissions
export const changeCameraPermissions = async (cameraId, cameraData) => {
  const url = baseURL + `/${cameraId}/permissions`

  try {
    const { data } = await axiosConfig.put(url, { ...cameraData })
    return data
  } catch (e) {
    console.log(e)
  }
}
