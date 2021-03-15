import {
  LOGIN,
  LOGOUT,
  SET_LOADING,
  IS_ADMIN_PAGE,
  SET_CURRENT_STORE,
  VERIFY_TOKEN,
  SET_CURRENT_COMPANY,
  UPDATE_STORE_UNITS,
  LOGIN_PREVIEW
} from './types'

export default {
  [LOGIN]: (state, res) => {
    state.user = res.user
    state.token = res.token
    localStorage.setItem('token', res.token)
  },
  [LOGIN_PREVIEW]: (state, res) => {
    state.user = res.user
    state.token = res.token
    localStorage.setItem('preview_token', res.token)
  },
  [LOGOUT]: (state) => {
    state.token = ''
    localStorage.removeItem('token')
  },
  [SET_LOADING]: (state, isLoading) => {
    state.flags.isLoading = isLoading
  },
  [IS_ADMIN_PAGE]: (state) => {
    state.flags.isAdminPage = true
  },
  [SET_CURRENT_STORE]: (state, store) => {
    state.store = store
  },
  [SET_CURRENT_COMPANY]: (state, company) => {
    state.company = company
  },
  [UPDATE_STORE_UNITS]: (state, units) => {
    state.store.units = units
  },
  [VERIFY_TOKEN]: (state, data) => {
    state.user = data.user
    state.store = data.store
    state.company = data.company || {}
  }
}
