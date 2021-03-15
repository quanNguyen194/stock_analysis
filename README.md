# vue-base-project

### flexible

```
// install
npm install lib-flexible --save
npm install px2rem-loader --save
// import
import 'lib-flexible/flexible.js'
// config in vue.index.js
css: {
  loaderOptions: {
    css: {},
    postcss: {
      plugins: [
        require('postcss-px2rem')({
          remUnit: 37.5
        })
      ]
    }
  }
}
```

### fastclick

```
// install
npm i fastclick --save
// import
import FastClick from 'fastclick'
// config in main.js
FastClick.attach(document.body)
```

### vue-analytics

```
// install
npm install vue-analytics --save
// config in main.js
Vue.use(VueAnalytics, {
  id: 'UA-XXX-X',
  disableScriptLoader: true,
  router,
  autoTracking: {
    pageviewOnLoad: false
  },
  debug: {
    enabled: false
  }
})
```

### vuex-persistedstate

```
// install
npm install vuex-persistedstate --save
// usage
import createPersistedState from 'vuex-persistedstate'
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  // State persistence
  plugins: debug ? [
    createLogger(),
    createPersistedState({
      storage: {
        getItem: key => storage.get(key),
        setItem: (key, value) => storage.set(key, value),
        removeItem: key => storage.remove(key)
      }
    })
  ] : []
})
```
