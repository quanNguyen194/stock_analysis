import loginScreen from '../views/login'
import CompanyScreen from '../views/admin/company'
import EditCompanyScreen from '../views/admin/edit-company'
import CreateCompanyScreen from '../views/admin/add-company'

export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: loginScreen
  },

  {
    path: '/company',
    name: 'company',
    component: CompanyScreen
  },

  {
    path: '/company/:id',
    name: 'edit_company',
    component: EditCompanyScreen
  },

  {
    path: '/company/api/create',
    name: 'add_company',
    component: CreateCompanyScreen
  }
]
