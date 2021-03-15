import { createDish, deleteDish, deleteToDish, dish, updateDish } from '../constants/api'
import { Api } from './api'

export default {
  async updateToDish (dishId, dish) {
    const dishList = await Api.requestWithToken({
      url: `${updateDish.url}/${dishId}`,
      method: updateDish.method,
      data: dish
    })
    return dishList.data
  },
  async createDish (dish) {
    const dataDish = await Api.requestWithToken({
      url: `${createDish.url}`,
      method: createDish.method,
      data: dish
    })
    return dataDish.data.dish
  },

  async deleteDish (menuId, dishId) {
    try {
      const delDish = await Api.requestWithToken({
        url: `${deleteDish.url}/${menuId}/dishes/${dishId}`,
        method: deleteDish.method
      })
      if (delDish.status) {
        return delDish.data.menu
      }
      return []
    } catch (e) {
      return []
    }
  },

  async deleteDishPermanently (dishId) {
    try {
      const delDish = await Api.requestWithToken({
        url: `${deleteDish.url_dish}/${dishId}`,
        method: deleteDish.method
      })
      return delDish
    } catch (e) {
      return e.response
    }
  },

  async listDish () {
    try {
      const dataDish = await Api.requestWithToken({
        url: dish.url,
        method: dish.method
      })
      if (dataDish.status) {
        return dataDish.data.dishes
      }
      return []
    } catch (e) {
      return []
    }
  },
  async deleteToDish (id) {
    try {
      const delDish = await Api.requestWithToken({
        url: `${deleteToDish.url}/${id}`,
        method: deleteToDish.method
      })
      if (delDish.status) {
        return delDish.data.dishes
      }
      return []
    } catch (e) {
      return []
    }
  }
}
