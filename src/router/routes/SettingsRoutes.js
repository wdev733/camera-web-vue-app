// Settings Views
const SettingsView = () => import('@/views/settings/SettingsView.vue')
const ProfileView = () => import('@/views/settings/ProfileView.vue')
const ChangePasswordView = () => import('@/views/settings/ChangePasswordView.vue')

export default [{
  path: '/settings',
  name: 'SettingsView',
  component: SettingsView,
  meta: { requiresAuth: true, requiresAdmin: true }
},
{
  path: '/profile',
  name: 'ProfileView',
  component: ProfileView,
  meta: { requiresAuth: true }
},
{
  path: '/profile/change-password',
  name: 'ChangePasswordView',
  component: ChangePasswordView,
  meta: { requiresAuth: true }
}]
