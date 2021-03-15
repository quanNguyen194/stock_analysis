import {
  addMenu,
  getMenu,
  deleteMenu,
  getMenuDetail,
  addMaterial,
  getMaterial,
  updateMenu
} from '../constants/api'
import { Api } from './api'

export default {
  async getList (offset, limit) {
    try {
      const menu = await Api.requestWithToken({
        url: `${getMenu.url}/?offset=${offset}&limit=${limit}`,
        method: getMenu.method
      })
      if (menu.status) {
        return menu.data.menus
      }
      return []
    } catch (e) {
      return []
    }
  },

  async addToMenu (menu) {
    const dataMenu = await Api.requestWithToken({
      url: `${addMenu.url}`,
      method: addMenu.method,
      data: menu
    })
    if (dataMenu.status) {
      return dataMenu.data.menu
    }
    return []
  },

  async getMenuDetail (menuId) {
    const dataMenuDetail = await Api.requestWithToken({
      url: `${getMenuDetail.url}/${menuId}`,
      method: getMenuDetail.method
    })
    if (dataMenuDetail.status) {
      return dataMenuDetail.data.menu
    }
    return []
  },

  async getDetails (id) {
    try {
      const menuDetails = await Api.requestWithToken({
        url: `${getMenu.url}/${id}`,
        method: getMenu.method
      })

      if (menuDetails.status) {
        return menuDetails.data.menu
      }
      return []
    } catch (e) {
      return []
    }
  },

  async deleteToMenu (id) {
    try {
      const delMenu = await Api.requestWithToken({
        url: `${deleteMenu.url}/${id}`,
        method: deleteMenu.method
      })
      if (delMenu.status) {
        return delMenu.data.menus
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

  async getListMaterials () {
    try {
      const material = await Api.requestWithToken({
        url: `${getMaterial.url}?offset=0&limit=10000000000000`,
        method: getMaterial.method
      })
      if (material.status) {
        return material.data.materials
      }
      return []
    } catch (e) {
      return []
    }
  },

  async updateMenu (menuId, menu) {
    try {
      const dataMenu = await Api.requestWithToken({
        url: `${updateMenu.url}/${menuId}`,
        method: updateMenu.method,
        data: menu
      })
      if (dataMenu.status) {
        return dataMenu.data.menu
      }
    } catch (e) {
      return []
    }
  }
}
