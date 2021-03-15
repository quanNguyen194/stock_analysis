
// export const API_URL = 'http://localhost:8000'
export const API_URL = 'https://braitokit.kaiyouit.com'

export const login = {
  method: 'POST',
  url: `${API_URL}/api/login`
}

export const getMenu = {
  method: 'GET',
  url: `${API_URL}/api/menu`
}

export const addMenu = {
  method: 'POST',
  url: `${API_URL}/api/menu`
}

export const deleteMenu = {
  method: 'DELETE',
  url: `${API_URL}/api/menu`
}

export const updateProfile = {
  method: 'PUT',
  url: `${API_URL}/api/me`
}

export const getMenuDetail = {
  method: 'GET',
  url: `${API_URL}/api/menu`
}

export const addUser = {
  method: 'POST',
  url: `${API_URL}/api/users`
}

export const changePassword = {
  method: 'PUT',
  url: `${API_URL}/api/me/change-password`
}

export const resetPassword = {
  method: 'POST',
  url: `${API_URL}/api/reset-pwd`
}

export const forgotPassword = {
  method: 'POST',
  url: `${API_URL}/api/forgot-pwd`
}

export const verifyToken = {
  method: 'GET',
  url: `${API_URL}/api/token/verify`
}

export const listUsers = {
  method: 'GET',
  url: `${API_URL}/api/users`
}
export const deleteUser = {
  method: 'DELETE',
  url: `${API_URL}/api/users/`
}

export const updateUser = {
  method: 'PUT',
  url: `${API_URL}/api/users/`
}

export const getUsers = {
  method: 'GET',
  url: `${API_URL}/api/users/`
}

export const addMaterial = {
  method: 'POST',
  url: `${API_URL}/api/materials`
}

export const getMaterial = {
  method: 'GET',
  url: `${API_URL}/api/materials`
}

export const updateDish = {
  method: 'PUT',
  url: `${API_URL}/api/dishes`
}

export const createDish = {
  method: 'POST',
  url: `${API_URL}/api/dishes`
}

export const deleteDish = {
  method: 'DELETE',
  url: `${API_URL}/api/menu`,
  url_dish: `${API_URL}/api/dishes`
}
export const deleteToDish = {
  method: 'DELETE',
  url: `${API_URL}/api/dishes`
}

export const dish = {
  method: 'GET',
  url: `${API_URL}/api/dishes`
}

export const updateMenu = {
  method: 'PUT',
  url: `${API_URL}/api/menu`
}

export const updateUnit = {
  method: 'PUT',
  url: `${API_URL}/api/units`
}
