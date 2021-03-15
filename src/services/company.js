import { getCompany, addCompany, updateCompany, getDetailACompany, deleteCompany } from '../constants/admin.api'
import { Api } from './api'

export default {
  async getCompany () {
    try {
      const dataCompany = await Api.requestWithToken({
        url: `${getCompany.url}`,
        method: getCompany.method
      })
      if (dataCompany.status) {
        return dataCompany.data.companies
      }
      return []
    } catch (e) {
      return []
    }
  },

  async addCompany (company) {
    try {
      const dataCompany = await Api.requestWithToken({
        url: `${addCompany.url}`,
        method: addCompany.method,
        data: {
          ...company,
          max_stores: 3
        }
      })
      if (dataCompany.status) {
        return dataCompany.data.company
      }
      return []
    } catch (e) {
      return e.response.data
    }
  },

  async updateCompany (id, data) {
    try {
      const dataCompany = await Api.requestWithToken({
        url: `${updateCompany.url}/${id}`,
        method: updateCompany.method,
        data: data
      })
      if (dataCompany.status) {
        return dataCompany.data.company
      }
      return []
    } catch (e) {
      return []
    }
  },

  async deleteCompany (id, idStore) {
    try {
      const delCompany = await Api.requestWithToken({
        url: `${deleteCompany.url}/${id}`,
        method: deleteCompany.method
      })
      if (delCompany.status) {
        return delCompany.data.companies
      }
      return []
    } catch (e) {
      return e.re
    }
  },

  async getDetailACompany (id) {
    try {
      const dataCompany = await Api.requestWithToken({
        url: `${getDetailACompany.url}/${id}`,
        method: getDetailACompany.method
      })
      if (dataCompany.status) {
        return dataCompany.data.store
      }
      return []
    } catch (e) {
      return []
    }
  }
}
