import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      token: '',
      user: {},
      store: {},
      company: {},
      flags: {
        isAdminPage: false,
        isLoading: false
      }
    },
    actions,
    mutations,
    getters
  })
}
