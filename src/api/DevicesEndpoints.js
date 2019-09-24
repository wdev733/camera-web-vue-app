import axiosConfig from '../config/axiosConfig'

const baseURL = '/license-keys'

// Get All Devices
export const getAllDevices = async () => {
  const url = '/devices'

  try {
    const { data } = await axiosConfig.get(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Validate a Device
export const validateDevice = async (licenseId) => {
  const url = `${baseURL}/validate/${licenseId}`

  try {
    const { data } = await axiosConfig.post(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Associate a Device
export const associateDevice = async (licenseId, siteID) => {
  const url = `${baseURL}/associate/${licenseId}`

  try {
    const { data } = await axiosConfig.post(url, { site_id: siteID })
    return data
  } catch (e) {
    console.log(e)
  }
}
