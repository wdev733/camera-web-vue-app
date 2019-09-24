// Permissions Views
const PermissionsView = () => import('@/views/permissions/PermissionsView.vue')

export default [
  {
    path: '/settings/permissions',
    name: 'PermissionsView',
    component: PermissionsView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]
