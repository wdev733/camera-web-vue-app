<template>
  <div class="row align-content-center mx-2">
    <!-- Loading State -->
    <LoadingState v-if="loading" />

    <!-- Teams View -->
    <div v-if="!loading">
      <!-- Inner Navbar -->
      <NavbarInner :data="navbarData" />

      <!-- Teams Table -->
      <div class="row">
        <div class="col-md-9">
          <div class="row">
            <div class="col">
              <TeamsTable
                :teams-list="userTeams"
                @reloadTeams="getUserTeams"
              />
            </div>
          </div>
        </div>

        <!-- Teams Helper Card -->
        <div class="col-md-3">
          <div class="card">
            <div class="card-header">
              <h4 class="card-header-title">
                Teams Management
              </h4>
              <br>
            </div>
            <div class="card-body">
              <p>
                In this page you can manage your teams and select your current one.
                You can also get inside the members list for every team.
              </p>
              <p>
                In this page you can manage your teams and select your current one.
                You can also get inside the members list for every team.
              </p>
              <button class="btn btn-block btn-info">
                Get more info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TeamsView',
  components: {
    LoadingState: () => import('@/components/globals/LoadingState'),
    TeamsTable: () => import('@/components/teams/TeamsTable'),
    NavbarInner: () => import('@/components/globals/NavbarInner')
  },
  data () {
    return {
      loading: false,
      navbarData: {
        pretitle: 'Settings',
        title: 'Teams',
        path: 'SettingsView'
      }
    }
  },
  computed: {
    ...mapGetters('TeamsModule', ['userTeams'])
  },
  async mounted () {
    this.loading = true
    await this.getUserTeams()
    this.loading = false
  },
  methods: {
    ...mapActions('TeamsModule', ['getUserTeams'])
  }
}
</script>

<style scoped>

</style>
