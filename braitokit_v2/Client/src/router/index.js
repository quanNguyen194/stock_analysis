import Vue from 'vue'
import Router from 'vue-router'
import adminRoutes from './admin'
import userRoutes from './user'
import loginScreen from '../views/login'
import notFoundScreen from '../views/404'
import home from '../views/home'
import forgotPasswordScreen from '../views/forgot-password'
import resetPasswordScreen from '../views/change-password'

Vue.use(Router)

const routesWithPrefix = (prefix, routes) => {
  return routes.map(route => {
    route.path = `${prefix}${route.path}`
    if (prefix.length) {
      route.name = `${prefix.replace('/', '')}.${route.name}`
    }
    return route
  })
}

export const router = new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: loginScreen
    },
    ...routesWithPrefix('/admin', adminRoutes),
    ...routesWithPrefix('', userRoutes),
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/forgot-password',
      name: 'user.forgot-password',
      component: forgotPasswordScreen
    },
    {
      path: '/reset-password',
      name: 'user.reset-password',
      component: resetPasswordScreen
    },
    {
      path: '*',
      name: 'page-not-found',
      component: notFoundScreen
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(from.path, ' ->', to.path)
  next()
})
