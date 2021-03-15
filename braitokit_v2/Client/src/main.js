// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { router } from './router'
import { createStore } from './store'
import { initConverter } from './plugins/jpconverter'

const store = createStore()
Vue.config.productionTip = false

// init converter
initConverter()

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
