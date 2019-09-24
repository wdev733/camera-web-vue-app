<template>
  <div class="row justify-content-center">
    <!-- Loading State -->
    <LoadingState
      v-if="loading"
      class="mx-auto"
    />

    <!-- Devices View -->
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
            <div
              v-if="getUserSites.length"
              class="float-right"
            >
              <b-dropdown
                size="sm"
                :text="currentSite.name"
              >
                <b-dropdown-item
                  v-for="site in getUserSites"
                  :key="site.id"
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
              <button
                class="btn btn-sm btn-secondary"
                @click="$router.go(-1)"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Show Current Device -->
      <p
        v-if="currentSite"
        class="text-muted mb-5"
      >
        Showing devices for site: {{ currentSite.name }}.
      </p>

      <!-- Cameras Cards -->
      <div
        v-if="getCameras.length"
        class="mb-4"
      >
        <h3>Cameras</h3>
        <div class="row">
          <div
            v-for="device in getCameras"
            :key="device.id"
            class="col-12 col-sm-12 col-md-6 col-lg-5"
          >
            <DevicesCard :device="device" />
          </div>
        </div>
      </div>

      <!-- Interface Unit Cards -->
      <div
        v-if="getIfus.length"
        class="mb-4"
      >
        <h3>Interface Units</h3>
        <div class="row">
          <div
            v-for="device in getIfus"
            :key="device.id"
            class="col-12 col-sm-12 col-md-6 col-lg-5"
          >
            <DevicesCard
              :device="device"
              icon="fe-cpu"
            />
          </div>
        </div>
      </div>

      <!-- Transmitters Cards -->
      <div v-if="getTransmitters.length">
        <h3>Transmitters</h3>
        <div
          class="row"
        >
          <div
            v-for="device in getTransmitters"
            :key="device.id"
            class="col-12 col-sm-12 col-md-6 col-lg-5"
          >
            <DevicesCard
              :device="device"
              icon="fe-wifi"
            />
          </div>
        </div>
      </div>

      <!-- No Devices Added Card -->
      <DevicesNoDevicesCard v-if="!getDevicesBySite.length" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'DevicesView',
  components: {
    LoadingState: () => import('@/components/globals/LoadingState'),
    DevicesNoDevicesCard: () => import('@/components/devices/DevicesNoDevicesCard'),
    DevicesCard: () => import('@/components/devices/DevicesCard')
  },
  data () {
    return {
      loading: false,
      navbarData: {
        pretitle: 'Settings',
        title: 'Devices',
        path: 'SettingsView'
      }
    }
  },
  computed: {
    ...mapGetters('SitesModule', ['userSites', 'currentSite']),
    ...mapGetters('DevicesModule', ['userDevices', 'getDevicesBySite']),
    // Get User Sites List Without the Current Site
    getUserSites () {
      return this.userSites.filter(site => site.id !== this.currentSite.id)
    },
    // Get Cameras List
    getCameras () {
      return this.getDevicesBySite.filter(device => device.type === 'cameras')
    },
    // Get Ifus List
    getIfus () {
      return this.getDevicesBySite.filter(device => device.type === 'ifus')
    },
    // Get Transmitters
    getTransmitters () {
      return this.getDevicesBySite.filter(device => device.type === 'transmitters')
    }
  },
  async mounted () {
    this.loading = true
    await this.getUserDevices()
    this.loading = false
  },
  methods: {
    ...mapActions('SitesModule', ['setCurrentSite']),
    ...mapActions('DevicesModule', ['getUserDevices'])
  }
}
</script>

<style scoped>

</style>
