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

      <GmapMap
        v-if="shouldShowMap"
        id="google-map"
        ref="mapRef"
        :options="{
          styles: styles,
          zoomControl: false,
          mapTypeControl: true,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          disableDefaultUi: true
        }"
        :center="getCenter"
        :zoom="15"
      >
        <!-- Google Map Markers -->
        <GmapMarker
          v-for="(m, index) in getAllDevicesLocations"
          :key="index"
          :position="JSON.parse(m.location)"
          @click="toggleInfoWindow(m, index)"
        />

        <gmap-info-window
          :options="{
            pixelOffset: {
              width: 0,
              height: -35
            }
          }"
          :position="infoWindowPos"
          :opened="infoWinOpen"
          @closeclick="infoWinOpen = false"
        >
          <div class="flex">
            <!-- Device ID -->
            <h6 class="card-title text-uppercase text-muted mb-2">
              ID: {{ getCurrentDevice.id }}
            </h6>

            <!-- Device Name -->
            <span class="h2 d-block mb-0 text-uppercase">
              {{ getCurrentDevice.name }}
            </span>

            <!-- Device Description -->
            <span class="d-block d-block mb-0">
              {{ getCurrentDevice.description }}
            </span>

            <!-- Device Status -->
            <span
              v-if="getCurrentDevice.status"
              class="badge badge-soft-success mt-3"
            >
              ONLINE
            </span>
            <span
              v-else
              class="badge badge-soft-danger mt-3"
            >
              OFFLINE
            </span>

            <br>
            <!-- Device Settings -->
            <router-link
              tag="a"
              :to="{ name: getDevicePath, params: { device: getCurrentDevice } }"
              class="btn btn-sm btn-outline-secondary mt-3 ml-auto"
            >
              Settings
            </router-link>
          </div>
        </gmap-info-window>
      </GmapMap>
      <!-- No Devices Added Card -->
      <DevicesNoDevicesCard v-else />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { GoogleMapsStyle } from '../../assets/styles/GoogleMapsStyle'

export default {
  name: 'DevicesMapView',
  components: {
    LoadingState: () => import('@/components/globals/LoadingState'),
    DevicesNoDevicesCard: () => import('@/components/devices/DevicesNoDevicesCard')
  },
  data () {
    return {
      loading: false,
      navbarData: {
        pretitle: 'Settings > Devices',
        title: 'Map',
        path: 'SettingsView'
      },
      styles: GoogleMapsStyle,
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWinOpen: false,
      currentMidx: null
    }
  },
  computed: {
    ...mapGetters('SitesModule', ['userSites', 'currentSite']),
    ...mapGetters('DevicesModule', ['getDevicesBySite']),
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
    },
    getAllDevicesLocations () {
      return this.getDevicesBySite.filter(device => device.location)
    },
    getCurrentDevice () {
      if (this.getAllDevicesLocations[this.currentMidx]) {
        return this.getAllDevicesLocations[this.currentMidx]
      } else {
        return {}
      }
    },
    // Get Settings Button Path Depending on Device Type
    getDevicePath () {
      const deviceType = this.getCurrentDevice.type
      switch (deviceType) {
        case 'cameras':
          return 'EditCamerasView'
        case 'ifus':
          return 'EditIfusView'
        case 'transmitters':
          return 'EditTransmittersView'
        default:
          return 'EditCamerasView'
      }
    },
    shouldShowMap () {
      const devicesLocations = this.getAllDevicesLocations
      return !this.loading && devicesLocations.length && JSON.parse(devicesLocations[0].location)
    },
    getCenter () {
      return JSON.parse(this.getAllDevicesLocations[0].location) || { lat: 0, lng: 0 }
    }
  },
  mounted () {
    this.loading = true
    this.getUserDevices()
    this.loading = false
  },
  methods: {
    ...mapActions('SitesModule', ['setCurrentSite']),
    ...mapActions('DevicesModule', ['getUserDevices']),
    toggleInfoWindow: function (marker, idx) {
      this.infoWindowPos = JSON.parse(marker.location)

      if (this.currentMidx === idx) {
        this.infoWinOpen = !this.infoWinOpen
      } else {
        this.infoWinOpen = true
        this.currentMidx = idx
      }
    }
  }
}
</script>

<style lang="sass">
#google-map
  border-radius: 5px
  width: 100%
  height: 60vh
  margin: 50px auto
  border: 2px solid black

.gm-style .gm-style-iw-d
  width: 300px
  height: auto
  padding: 20px
  text-align: center
</style>
