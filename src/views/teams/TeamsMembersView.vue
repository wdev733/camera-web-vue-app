<template>
  <div class="teams-members-view row justify-content-center mx-4 mx-sm-0">
    <!-- Loading State -->
    <LoadingState v-if="loading" />

    <!-- Team Members View -->
    <div v-if="!loading">
      <!-- Inner Navbar -->
      <div class="header">
        <div class="row align-items-center">
          <div class="col">
            <h6 class="header-pretitle">
              {{ navbarData.pretitle }}
            </h6>
            <h1 class="header-title">
              {{ getTeamName }}
            </h1>
          </div>
          <div
            v-if="navbarData.path"
            class="col-auto"
          >
            <button
              v-b-modal.update-team-modal
              class="btn btn-sm btn-primary mr-3"
              @click="selectTeam(teamData)"
            >
              Edit Name
            </button>
            <router-link
              tag="a"
              :to="{ name: navbarData.path }"
              class="btn btn-sm btn-secondary"
            >
              Back
            </router-link>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="row">
        <div class="col-12 col-lg-6 col-xl-5">
          <!-- Teams Members Table -->
          <TeamsMembersTable
            :members-list="membersList"
            @updated="updateTable"
          />
        </div>
        <div class="col-12 col-sm-6 col-lg-6 col-xl-3">
          <!-- Team Invite User Card -->
          <TeamsInvitations @updated="updateTable" />
        </div>

        <div class="col-12 col-sm-6 col-lg-4">
          <!-- Help card -->
          <GlobalHelpCard :data="helpCardData" />
        </div>
        <div class="col-lg-8 col-12">
          <!-- Team Pending Invitations Card -->
          <TeamsPendingInvitations :invitations="getInvitations" />
        </div>
      </div>
    </div>
    <!-- Team Change Name Modal -->
    <TeamsChangeNameModal @updated="updateTable" />
  </div>
</template>

<script>
import { getTeam } from '../../api/TeamsEndpoints'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TeamsMembersView',
  components: {
    TeamsChangeNameModal: () => import('@/components/teams/TeamsChangeNameModal'),
    LoadingState: () => import('@/components/globals/LoadingState'),
    TeamsMembersTable: () => import('@/components/teams/TeamsMembersTable'),
    TeamsInvitations: () => import('@/components/teams/TeamsInvitations'),
    TeamsPendingInvitations: () => import('@/components/teams/TeamsPendingInvitations'),
    GlobalHelpCard: () => import('@/components/globals/GlobalHelpCard')
  },
  data () {
    return {
      loading: false,
      teamData: null,
      membersList: [],
      navbarData: {
        pretitle: 'Settings > Teams',
        path: 'SettingsView'
      },
      helpCardData: {
        title: 'Members Management',
        text1: 'In this page you can manage your teams and select your current one. You can also get inside the members list for every team.\n',
        text2: 'In this page you can manage your teams and select your current one. You can also get inside the members list for every team.\n'
      },
      modalOpened: true
    }
  },
  computed: {
    ...mapGetters('TeamsModule', ['currentTeam']),
    ...mapGetters('UsersModule', ['user']),
    // Get Team Name
    getTeamName () {
      return this.teamData ? this.teamData.name : ''
    },
    // Get Team Invitations
    getInvitations () {
      return this.teamData ? this.teamData.invites : []
    }
  },
  async mounted () {
    this.loading = true
    if (this.user.role.id === 1) {
      try {
        await this.getTeamMethod()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    } else {
      this.$notify({
        group: 'notifications',
        type: 'error',
        text: 'You cannot access this view'
      })
      this.$router.go(-1)
    }
  },
  methods: {
    ...mapActions('TeamsModule', ['selectTeam']),
    // Get Team Information
    async getTeamMethod () {
      const teamId = this.currentTeam.id
      try {
        const team = await getTeam(teamId)
        this.teamData = team
        this.membersList = [...team.users]
      } catch (e) {
        console.log(e)
      }
    },
    // Update Table
    async updateTable () {
      await this.getTeamMethod()
    }
  }
}
</script>

<style scoped lang="sass">
.teams-members-view
  margin-top: 25px
</style>
