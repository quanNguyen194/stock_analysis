import { getStore, addStore, deleteStore, updateStore } from '../constants/admin.api'
import { Api } from './api'

export default {
  async getStores (id) {
    try {
      const dataStore = await Api.requestWithToken({
        url: `${getStore.url}/${id}/stores`,
        method: getStore.method
      })
      if (dataStore.status) {
        return dataStore.data.stores
      }
      return []
    } catch (e) {
      return []
    }
  },
  async updateStore (id, idStore, data) {
    try {
      const dataStore = await Api.requestWithToken({
        url: `${updateStore.url}/${id}/stores/${idStore}`,
        method: updateStore.method,
        data: data
      })
      if (dataStore.status) {
        return dataStore.data.store
      }
      return []
    } catch (e) {
      return e.response.data
    }
  },

  async addToStore (id, store) {
    try {
      const dataStore = await Api.requestWithToken({
        url: `${addStore.url}/${id}/stores`,
        method: addStore.method,
        data: store
      })
      if (dataStore.status) {
        return dataStore.data.store
      }
      return []
    } catch (e) {
      return e.response.data
    }
  },

  async deleteStore (id, idStore) {
    try {
      const delStore = await Api.requestWithToken({
        url: `${deleteStore.url}/${id}/stores/${idStore}`,
        method: deleteStore.method
      })
      if (delStore.status) {
        return delStore.data.store
      }
      return []
    } catch (e) {
      return e.re
    }
  }

}
