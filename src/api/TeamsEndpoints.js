import axiosConfig from '../config/axiosConfig'

const baseURL = '/teams'

// Get All Teams
export const getAllTeams = async () => {
  try {
    const { data } = await axiosConfig.get(baseURL)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Get a Singular Team
export const getTeam = async (teamId) => {
  const url = `${baseURL}/${teamId}`

  try {
    const { data } = await axiosConfig.get(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Update a Team
export const updateTeam = async (name) => {
  try {
    const { data } = await axiosConfig.put(baseURL, { name })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Create a Team
export const createTeam = async (name) => {
  try {
    const { data } = await axiosConfig.post(baseURL, { name })
    return data
  } catch (e) {
    console.log(e)
  }
}

// Delete a Team
export const deleteTeam = async (team) => {
  const url = `${baseURL}/${team}`

  try {
    const { data } = await axiosConfig.delete(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Invite User to Team
export const inviteUserToTeam = async (email) => {
  const url = `${baseURL}/invite/${email}`

  try {
    const { data } = await axiosConfig.post(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Resend Invitation to User
export const resendInviteToTeamUser = async (invitationId) => {
  const url = `${baseURL}/invite/${invitationId}/resend`

  try {
    const { data } = await axiosConfig.post(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Update User Role
export const updateTeamUserRole = async (user, role) => {
  const url = `${baseURL}/user/${user}`

  try {
    const { data } = await axiosConfig.put(url, { role })
    return data
  } catch (e) {
    return e
  }
}

// Remove User
export const removeTeamUser = async (user) => {
  const url = `${baseURL}/user/${user}`

  try {
    const { data } = await axiosConfig.delete(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Change Team
export const changeTeam = async (team) => {
  const url = `${baseURL}/switch/${team}`

  try {
    const { data } = await axiosConfig.post(url)
    return data
  } catch (e) {
    console.log(e)
  }
}

// Accept Team Invite
export const acceptTeamInvite = async (token) => {
  const url = `${baseURL}/accept-invite/${token}`

  try {
    const { data } = await axiosConfig.get(url)
    return data
  } catch (e) {
    console.log(e)
  }
}
