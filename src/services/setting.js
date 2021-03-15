import { Api } from './api'
import { updateProfile, addUser, changePassword, listUsers, deleteUser, updateUnit } from '../constants/api'
import { getUsers, updateUser } from '@/constants/api'

export default {
  updateProfile: (profile) => {
    return Api.requestWithToken({
      url: updateProfile.url,
      method: updateProfile.method,
      data: profile
    })
  },

  addUser: async (profile) => {
    try {
      const addRes = await Api.requestWithToken({
        url: addUser.url,
        method: addUser.method,
        data: profile
      })
      return addRes
    } catch (e) {
      return e.response.data
    }
  },
  changePassword: (password) => {
    return Api.requestWithToken({
      url: changePassword.url,
      method: changePassword.method,
      data: password
    })
  },
  listUsers: async (profile) => {
    try {
      const listRes = await Api.requestWithToken({
        url: listUsers.url,
        method: listUsers.method,
        data: profile
      })
      return listRes
    } catch (e) {
      return e.response.data
    }
  },
  deleteUser: async (id) => {
    try {
      const deleteRes = await Api.requestWithToken({
        url: deleteUser.url + id,
        method: deleteUser.method
      })
      return deleteRes
    } catch (e) {
      return e.response.data
    }
  },
  updateUser: async (id, profile) => {
    try {
      const updateRes = await Api.requestWithToken({
        url: updateUser.url + id,
        method: updateUser.method,
        data: profile
      })
      return updateRes
    } catch (e) {
      return e.response.data
    }
  },
  getUsers: async (id) => {
    try {
      const getRes = await Api.requestWithToken({
        url: getUsers.url + id,
        method: getUsers.method
      })
      return getRes
    } catch (e) {
      return e.response.data
    }
  },
  async updateUnit (data) {
    try {
      const dataUnit = await Api.requestWithToken({
        url: `${updateUnit.url}`,
        method: updateUnit.method,
        data: {
          units: data
        }
      })
      return dataUnit.status
    } catch (e) {
      return false
    }
  }
}
