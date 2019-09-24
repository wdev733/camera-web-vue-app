import axiosConfig from '../config/axiosConfig'

const baseURL = '/transmitters'

// Get all Transmitters
export const getAllTransmitters = async (siteId) => {
  const queryParams = `?site=${siteId}`
  const url = baseURL + queryParams

  try {
    const { data } = await axiosConfig.get(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Get a Single Interface Unit
export const getTransmitter = async (transmitterId) => {
  const url = `${baseURL}/${transmitterId}`

  try {
    const { data } = await axiosConfig.get(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Change Transmitter's Team
export const updateTransmitter = async (transmitterId, payload) => {
  const url = `${baseURL}/${transmitterId}`
  try {
    const { data } = await axiosConfig.put(url, { ...payload })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Disassociate Transmitter From Team
export const disassociateTransmitterFromTeam = async (transmitterId) => {
  const url = `${baseURL}/${transmitterId}/disassociate`
  try {
    const { data } = await axiosConfig.post(url)
    return data
  } catch (e) {
    console.log(e)
  }
}
