// Teams Views
const TeamsView = () => import('@/views/teams/TeamsView.vue')
const TeamsMembersView = () => import('@/views/teams/TeamsMembersView.vue')
const TeamsNoTeamView = () => import('@/views/teams/TeamsNoTeamView.vue')
const TeamsJoinSuccessView = () => import('@/views/auth/TeamsJoinSuccessView.vue')

export default [{
  path: '/teams',
  name: 'TeamsView',
  component: TeamsView,
  meta: { requiresAuth: true }
},
{
  path: '/no-team',
  name: 'TeamsNoTeamView',
  component: TeamsNoTeamView,
  meta: { requiresAuth: true }
},
{
  path: '/teams/members/',
  name: 'TeamsMembersView',
  component: TeamsMembersView,
  meta: { requiresAuth: true, requiresAdmin: true }
},
{
  path: '/team-join-success',
  name: 'TeamsJoinSuccessView',
  component: TeamsJoinSuccessView,
  meta: { requiresAuth: true }
}]
