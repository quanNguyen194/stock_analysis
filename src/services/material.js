import { getMaterial, addMaterial, editMaterial, delMaterial } from '../constants/material'
import { Api } from './api'

export default {
  async getListMaterial (offset, limit) {
    try {
      const menu = await Api.requestWithToken({
        url: `${getMaterial.url}/?offset=${offset}&limit=${limit}`,
        method: getMaterial.method
      })
      if (menu.status) {
        return menu.data.materials
      }
      return []
    } catch (e) {
      return []
    }
  },
  async addToMaterial (material) {
    const dataMaterial = await Api.requestWithToken({
      url: `${addMaterial.url}`,
      method: addMaterial.method,
      data: material
    })
    if (dataMaterial.status) {
      return dataMaterial.data.material
    }
    return []
  },

  async editToMaterial (id, data) {
    const dataMaterial = await Api.requestWithToken({
      url: `${editMaterial.url}/${id}`,
      method: editMaterial.method,
      data: data
    })
    if (dataMaterial.status) {
      return dataMaterial.data.material
    }
    return []
  },

  async deleteToMaterial (id) {
    try {
      const material = await Api.requestWithToken({
        url: `${delMaterial.url}/${id}`,
        method: delMaterial.method
      })
      if (material.status) {
        return material.data.material
      }
      return []
    } catch (e) {
      return []
    }
  }
}
