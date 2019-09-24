// Live Views
const LiveView = () => import('@/views/live/LiveView.vue')
const LiveSetupView = () => import('@/views/live/LiveSetupView.vue')

export default [{
  path: '/live',
  name: 'LiveView',
  component: LiveView,
  meta: { requiresAuth: true }
},
{
  path: '/live/setup',
  name: 'LiveSetupView',
  component: LiveSetupView,
  meta: { requiresAuth: true }
}]
