<template>
  <!-- Device Card -->
  <div class="card">
    <div class="card-body">
      <div class="row align-items-center">
        <div class="col">
          <!-- Device ID -->
          <h6 class="card-title text-uppercase text-muted mb-2">
            ID: {{ device.id }}
          </h6>

          <!-- Device Name -->
          <span class="h2 d-block mb-0 text-uppercase">
            {{ getDeviceName }}
          </span>

          <!-- Device Description -->
          <span class="d-block d-block mb-0">
            {{ device.description }}
          </span>

          <!-- Device Status -->
          <span
            v-if="device.status"
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
        </div>

        <!-- Device Icon -->
        <div
          class="col-auto"
        >
          <span
            class="h2 fe text-muted mb-0"
            :class="icon"
          />
        </div>

        <!-- Device Image -->
        <div
          v-if="!icon"
          class="col-auto"
        >
          <span class="avatar avatar avatar-4by3 d-none d-sm-inline-block">
            <img
              alt="Image"
              class="avatar-img rounded"
              src="https://www.ruralnewsgroup.co.nz/media/k2/items/cache/f27c46af75c9b79e337ce9283b2cff99_XL.jpg"
            >
          </span>
        </div>

        <img
          v-if="device.location"
          alt="Map"
          class="rounded my-4 pl-3"
          :src="getStaticMap(device)"
        >

        <!-- Device Settings -->
        <router-link
          tag="a"
          :to="{ name: getDevicePath, params: { device: device } }"
          class="btn btn-sm btn-outline-secondary mb-n3 ml-auto"
        >
          Settings
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DevicesCard',
  props: {
    device: {
      type: Object,
      required: true,
      default: () => {}
    },
    icon: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    // Get Camera Name
    getDeviceName () {
      const device = this.device
      return device.name || `${device.type.slice(0, -1)} ${device.id}`
    },
    // Get Settings Button Path Depending on Device Type
    getDevicePath () {
      const deviceType = this.device.type
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
    }
  },
  methods: {
    // Generate Static Map
    getStaticMap (device) {
      if (device.location) {
        const apiKey = process.env.VUE_APP_GOOGLE_MAPS_API
        const location = JSON.parse(device.location)
        const zoom = '&zoom=13'
        const size = '&size=270x100'
        const marker = '&markers=size:small%7Ccolor:0xff4060%7C' + location.lat + ',' + location.lng
        const center = 'center=' + location.lat + ',' + location.lng
        const url = 'https://maps.googleapis.com/maps/api/staticmap?'
        const key = `&key=${apiKey}`
        return url + center + zoom + size + marker + key
      }
    }
  }
}
</script>

<style scoped>
.card {
  min-height: 150px
}
</style>
