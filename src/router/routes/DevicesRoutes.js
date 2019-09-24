// Devices Views
const DevicesView = () => import('@/views/devices/DevicesView.vue')
const DevicesSetupView = () => import('@/views/devices/DevicesSetupView.vue')
const DevicesMapView = () => import('@/views/devices/DevicesMapView.vue')

export default [{
  path: '/settings/devices/register',
  name: 'DevicesSetupView',
  component: DevicesSetupView,
  meta: { requiresAuth: true, requiresAdmin: true }
},
{
  path: '/settings/devices/map',
  name: 'DevicesMapView',
  component: DevicesMapView,
  meta: { requiresAuth: true, requiresAdmin: true }
},
{
  path: '/settings/devices',
  name: 'DevicesView',
  component: DevicesView,
  meta: { requiresAuth: true, requiresAdmin: true }
}]
