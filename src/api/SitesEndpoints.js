import axiosConfig from '../config/axiosConfig'

const baseURL = '/sites'

// Get all Sites
export const getAllSites = async () => {
  try {
    const { data } = await axiosConfig.get(baseURL)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Get a Singular Site
export const getSite = async (siteId) => {
  const url = `${baseURL}/${siteId}`
  try {
    const { data } = await axiosConfig.get(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Update a Site
export const updateSite = async (siteId, siteUpdate) => {
  const url = `${baseURL}/${siteId}`
  try {
    const { data } = await axiosConfig.put(url, { ...siteUpdate })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Create a Site
export const createSite = async (siteInfo) => {
  try {
    const { data } = await axiosConfig.post(baseURL, { ...siteInfo })
    return data
  } catch (e) {
    console.log(e)
  }
}
