// Devices Edit Views
const EditCamerasView = () => import('@/views/devices/edit/EditCamerasView.vue')
const EditIfusView = () => import('@/views/devices/edit/EditIfusView.vue')
const EditTransmittersView = () => import('@/views/devices/edit/EditTransmittersView.vue')

export default [
  {
    path: '/settings/cameras/edit',
    name: 'EditCamerasView',
    component: EditCamerasView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/settings/ifus/edit',
    name: 'EditIfusView',
    component: EditIfusView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/settings/transmitters/edit',
    name: 'EditTransmittersView',
    component: EditTransmittersView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }]
