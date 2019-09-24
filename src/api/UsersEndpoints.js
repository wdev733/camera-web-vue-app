import axiosConfig from '../config/axiosConfig'

const baseURL = '/users'

// Login User
export const loginUser = async (loginInfo) => {
  const url = baseURL + '/login'

  try {
    const { data } = await axiosConfig.post(url, { ...loginInfo })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Logout User
export const logoutUser = async () => {
  const url = baseURL + '/logout'

  try {
    const { data } = await axiosConfig.post(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Get User
export const getUser = async () => {
  try {
    const { data } = await axiosConfig.get(baseURL)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Update User
export const updateUser = async (updateUser) => {
  try {
    const { data } = await axiosConfig.put(baseURL, { ...updateUser })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Register User
export const registerUser = async (registerInfo) => {
  const url = baseURL + '/signup'

  try {
    const { data } = await axiosConfig.post(url, { ...registerInfo })
    return data
  } catch (e) {
    return e
  }
}

// Verify User
export const verifyUser = async (verifyInfo) => {
  const { expires, id, signature } = verifyInfo
  const url = `${baseURL}/verify?expires=${expires}&id=${id}&signature=${signature}`

  try {
    const { data } = await axiosConfig.get(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Forgot Password
export const forgotPassword = async (email) => {
  const url = baseURL + '/forgot-password'

  try {
    const { data } = await axiosConfig.post(url, { email })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Password Update
export const passwordUpdate = async (passwordInfo) => {
  const token = ''
  const url = baseURL + '/reset-password/' + token

  try {
    const { data } = await axiosConfig.post(url, { ...passwordInfo })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Refresh Token
export const tokenRefresh = async () => {
  const url = baseURL + '/refresh/'

  try {
    const { data } = await axiosConfig.post(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Change Password
export const changePassword = async (passwordData) => {
  const url = baseURL + '/update-password'

  try {
    const { data } = await axiosConfig.post(url, { ...passwordData })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Get User Permissions
export const getUserPermissions = async () => {
  const url = baseURL + '/permissions'

  try {
    const { data } = await axiosConfig.get(url)
    return data
  } catch (e) {
    console.log(e)
  }
}
