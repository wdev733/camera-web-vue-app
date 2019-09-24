<template>
  <!-- Settings View -->
  <div class="settings-view">
    <LoadingState v-if="loading" />
    <div
      v-if="!loading"
      class="settings-view-wrapper"
    >
      <NavbarInner :data="navbarData" />
      <div class="row">
        <div
          v-for="card in settingsCards"
          :key="card.title"
          class="col-sm-6 col-md-6 col-lg-4 col-12"
        >
          <SettingsCard :data="card" />
        </div>
        <div class="col-sm-6 col-md-6 col-lg-4 col-12">
          <SettingsCardHelp />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SettingsView',
  components: {
    LoadingState: () => import('@/components/globals/LoadingState'),
    SettingsCardHelp: () => import('@/components/settings/SettingsCardHelp'),
    SettingsCard: () => import('@/components/settings/SettingsCard'),
    NavbarInner: () => import('@/components/globals/NavbarInner')
  },
  data () {
    return {
      loading: false,
      navbarData: {
        pretitle: 'Settings',
        title: 'Toolbox'
      },
      settingsCards: [
        {
          title: 'Device Setup Wizard',
          text: 'Click here to setup your first cameras or add more cameras to an existing system.',
          path: 'DevicesSetupView'
        },
        {
          title: 'Manage Sites',
          text: 'Click here to manage the sites on your team.',
          path: 'SitesView'
        },
        {
          title: 'Manage Devices',
          text: 'Click here to manage the different devices on your team.',
          path: 'DevicesView'
        },
        {
          title: 'Manage Team Members',
          text: 'Click here to manage the members on your current team.',
          path: 'TeamsMembersView'
        },
        {
          title: 'Manage Permissions',
          text: 'Click here to configure the permissions for each camera. This allows you to restrict a team member to only viewing some cameras.',
          path: 'PermissionsView'
        }
      ]
    }
  },
  async mounted () {
    this.loading = true
    try {
      await this.getUser()
    } catch (e) {
      console.log(e)
    }
    this.loading = false
  },
  methods: {
    ...mapActions('UsersModule', ['getUser'])
  }
}
</script>

<style scoped lang="sass">
.settings-view
  width: 100%
  text-align: center
  &-wrapper
    text-align: left
</style>
