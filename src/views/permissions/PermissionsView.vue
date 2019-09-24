<template>
  <div class="permissions-view">
    <LoadingState v-if="loading" />
    <!-- Permissions View -->
    <NarrowContent v-if="!loading">
      <div>
        <div
          v-if="!loading"
          class="devices-view col-12"
        >
          <!-- Navbar -->
          <div class="navbar-inner">
            <div
              class="header"
              style="margin-top: 25px"
            >
              <div class="row align-items-center">
                <div class="col">
                  <h6 class="header-pretitle">
                    {{ navbarData.pretitle }}
                  </h6>
                  <h1 class="header-title">
                    {{ navbarData.title }}
                  </h1>
                </div>
                <div class="float-right">
                  <button
                    v-if="!getUserSites.length"
                    class="btn btn-sm btn-secondary"
                  >
                    {{ currentSite.name }}
                  </button>
                  <b-dropdown
                    v-else
                    size="sm"
                    :text="currentSite.name"
                  >
                    <b-dropdown-item
                      v-for="site in getUserSites"
                      :key="site.id"
                      class="primary"
                      @click="setCurrentSite(site)"
                    >
                      {{ site.name }}
                    </b-dropdown-item>
                  </b-dropdown>
                </div>
                <div
                  v-if="navbarData.path"
                  class="col-auto"
                >
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
          </div>
        </div>

        <!-- Permissions Card -->
        <div class="card">
          <div class="card-body">
            <div class="header">
              <div class="header-body pt-0">
                <div class="row align-items-center">
                  <div class="col">
                    <!-- Current Site Name -->
                    <h2 class="header-title">
                      {{ currentSite.name }}
                    </h2>
                  </div>

                  <!-- Permissions Select User -->
                  <div class="col-auto">
                    <button
                      v-if="!getTeamMembers.length"
                      class="btn btn-primary"
                    >
                      User: {{ currentMember.first_name }} {{ currentMember.last_name }}
                    </button>
                    <b-dropdown
                      v-if="getTeamMembers.length"
                      :text="getCurrentMemberName"
                      size="md"
                      variant="primary"
                    >
                      <b-dropdown-item-button
                        v-for="member in getTeamMembers"
                        :key="member.id"
                        class="primary"
                        @click="currentMember = member"
                      >
                        {{ member.first_name }} {{ member.last_name }}
                      </b-dropdown-item-button>
                    </b-dropdown>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="loadingPermissions"
              class="permissions-view-loading"
            >
              <div class="spinner-border p-5" />
            </div>

            <!-- Permissions No Cameras Available -->
            <div
              v-if="!userCamerasBySite.length"
              class="permissions-view-loading"
            >
              <h3>No cameras available for this site.</h3>
            </div>

            <div
              v-if="userCamerasBySite.length && getMemberRole === 1 && !loadingPermissions"
              class="permissions-view-loading"
            >
              <h3>You cannot edit the permissions of an admin user. Please change them to a member first.</h3>
            </div>

            <!-- Permissions Table -->
            <PermissionsTable
              v-if="!loading && !loadingPermissions && getMemberRole !== 1"
              :permissions="permissionsData"
              :member="currentMember"
            />
          </div>
        </div>
      </div>
    </NarrowContent>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getCameraPermissions } from '../../api/CamerasEndpoints'

export default {
  name: 'PermissionsView',
  components: {
    PermissionsTable: () => import('@/components/permissions/PermissionsTable'),
    LoadingState: () => import('@/components/globals/LoadingState'),
    NarrowContent: () => import('@/components/hoc/NarrowContent')
  },
  data () {
    return {
      currentMember: {},
      loading: false,
      loadingPermissions: false,
      navbarData: {
        pretitle: 'Settings',
        title: 'Permissions',
        path: 'SettingsView'
      },
      permissionsData: []
    }
  },
  computed: {
    ...mapGetters('SitesModule', ['userSites', 'currentSite']),
    ...mapGetters('TeamsModule', ['teamMembers']),
    ...mapGetters('DevicesModule', ['userCamerasBySite']),
    // Get User Sites List Without the Current Site
    getUserSites () {
      return this.userSites.filter(site => site.id !== this.currentSite.id)
    },
    // Get User Sites List Without the Current Site
    getTeamMembers () {
      if (this.teamMembers) {
        return this.teamMembers.filter(member => member.id !== this.currentMember.id)
      } else {
        return []
      }
    },
    // Get Current Member Name
    getCurrentMemberName () {
      return `User: ${this.currentMember.first_name} ${this.currentMember.last_name}`
    },
    // Get Member Role
    getMemberRole () {
      if (this.currentMember.role) {
        return this.currentMember.role.team_role_id
      } else {
        return true
      }
    }
  },
  watch: {
    // Watch for Current Member Changes
    async currentMember (newValue) {
      if (newValue && this.permissionsData.length) {
        await this.loadPermissions()
      }
    },
    // Watch for Current Site Changes
    async currentSite (newValue) {
      if (newValue) {
        await this.loadPermissions()
      }
    }
  },
  async mounted () {
    this.loading = true
    this.currentMember = this.teamMembers ? this.teamMembers[0] : {}
    await this.loadPermissions()
    this.loading = false
  },
  methods: {
    ...mapActions('SitesModule', ['setCurrentSite']),
    // Load Permissions for Each User
    async loadPermissions () {
      this.loadingPermissions = true
      let permissionsList = []
      await Promise.all(
        this.userCamerasBySite.map(async camera => {
          const permission = await getCameraPermissions(camera.id, this.currentMember.id)
          permissionsList.push({ camera: camera, permissions: permission })
        })
      )
      this.permissionsData = [ ...permissionsList ]
      this.loadingPermissions = false
    }
  }
}
</script>

<style scoped lang="sass">
.permissions-view
  display: flex
  justify-content: center
  &-loading
    min-height: 400px
    display: flex
    justify-content: center
    text-align: center
    padding: 0 50px
    align-items: center

</style>
