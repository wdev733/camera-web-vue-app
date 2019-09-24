import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Cookies from 'js-cookie'
import AppRoutes from './routes'

Vue.use(Router)

// 404 Error View
const ErrorView = () => import('@/views/error/ErrorView.vue')

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/live'
    },
    {
      path: '*',
      name: '404View',
      component: ErrorView
    },
    ...AppRoutes
  ]
})

router.beforeEach((to, from, next) => {
  const rememberMe = () => store.getters['UsersModule/rememberMe'] || Cookies.get('rememberMe')
  const isUserLoggedIn = store.getters['UsersModule/isUserLoggedIn'] && rememberMe()
  const isUserAdmin = store.getters['UsersModule/isUserAdmin']
  const userHasTeam = store.getters['UsersModule/userHasTeam']
  const notAuthViews = ['/login', '/register', '/register-success', '/forgot-password', '/verify']

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (!isUserAdmin) {
        next({
          path: '/live',
          query: { redirect: to.fullPath }
        })
      }
    }
    // Check if user is logged in
    if (!isUserLoggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      store.dispatch('UsersModule/logoutUser')
    } else if (!userHasTeam && to.path !== '/no-team') {
      // Check if user has a team
      next({
        path: '/no-team',
        query: { redirect: to.fullPath }
      })
    } else if (userHasTeam && to.path === '/no-team') {
      // Redirect to live when user has a team
      next('/live')
    } else {
      next()
    }
  } else {
    if (notAuthViews.includes(to.path) && isUserLoggedIn) {
      next('/live')
    } else {
      next()
    }
  }
})

export default router
