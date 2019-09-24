// Sites Views
const SitesView = () => import('@/views/sites/SitesView.vue')

export default [
  {
    path: '/settings/sites',
    name: 'SitesView',
    component: SitesView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]
