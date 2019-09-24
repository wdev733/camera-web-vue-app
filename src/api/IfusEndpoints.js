import axiosConfig from '../config/axiosConfig'

const baseURL = '/ifus'

// Get all Interface Units
export const getAllIfus = async (siteId) => {
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
export const getIfu = async (ifuId) => {
  const url = `${baseURL}/${ifuId}`

  try {
    const { data } = await axiosConfig.get(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Change Interface Unit's Team
export const updateIfu = async (ifuId, payload) => {
  const url = `${baseURL}/${ifuId}`
  try {
    const { data } = await axiosConfig.put(url, { ...payload })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Disassociate Interface Unit From Team
export const disassociateIfuFromTeam = async (ifuId) => {
  const url = `${baseURL}/${ifuId}/disassociate`
  try {
    const { data } = await axiosConfig.post(url)
    return data
  } catch (e) {
    console.log(e)
  }
}
