import axiosConfig from '../config/axiosConfig'

const baseURL = '/views'

// Get all Sites
export const getAllViews = async () => {
  try {
    const { data } = await axiosConfig.get(baseURL)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Get a Single View
export const getView = async (viewId) => {
  const url = `${baseURL}/${viewId}`

  try {
    const { data } = await axiosConfig.get(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Create a View
export const createView = async (viewData) => {
  try {
    const { data } = await axiosConfig.post(baseURL, { ...viewData })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Update a View
export const updateView = async (viewId, viewData) => {
  const url = `${baseURL}/${viewId}`

  try {
    const { data } = await axiosConfig.put(url, { ...viewData })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Delete a View
export const deleteView = async (viewId) => {
  const url = `${baseURL}/${viewId}`

  try {
    const { data } = await axiosConfig.delete(url)
    return data
  } catch (e) {
    console.log(e)
  }
}
