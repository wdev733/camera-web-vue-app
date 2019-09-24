// Auth Views
const LoginView = () => import('@/views/auth/LoginView.vue')
const RegisterView = () => import('@/views/auth/RegisterView.vue')
const RegisterSuccessView = () => import('@/views/auth/RegisterSuccessView.vue')
const ForgotPasswordView = () => import('@/views/auth/ForgotPasswordView.vue')
const VerifyEmailView = () => import('@/views/auth/VerifyEmailView.vue')

export default [{
  path: '/login',
  name: 'LoginView',
  component: LoginView
},
{
  path: '/register',
  name: 'RegisterView',
  component: RegisterView
},
{
  path: '/register-success',
  name: 'RegisterSuccessView',
  component: RegisterSuccessView
},
{
  path: '/forgot-password',
  name: 'ForgotPasswordView',
  component: ForgotPasswordView
},
{
  path: '/verify',
  name: 'VerifyEmailView',
  component: VerifyEmailView
}]
