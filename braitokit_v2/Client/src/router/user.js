import menuListScreen from '../views/user/menu-list'
import managerMenu from '../views/user/dishes-manager'
import menuDetailScreen from '../views/user/menu-detail/menu-detail'
import settingsScreen from '../views/user/setting/setting-page'
import addUserScreen from '../views/user/setting/add-user'
import exportScreen from '../views/user/menu-detail/export'

export default [
  {
    path: '/menu',
    name: 'menu',
    component: menuListScreen
  },
  {
    path: '/dishes',
    name: 'dishes',
    component: managerMenu
  },
  {
    path: '/menu/:id',
    name: 'menu.detail',
    component: menuDetailScreen
  },

  {
    path: '/setting',
    name: 'setting',
    component: settingsScreen
  },
  {
    path: '/user/regist',
    name: 'user.regist',
    component: addUserScreen
  },
  {
    path: '/menu/export/:id',
    name: 'menu.export',
    component: exportScreen
  },
  {
    path: '/user/update/:id',
    name: 'user.update',
    component: addUserScreen
  }
]
