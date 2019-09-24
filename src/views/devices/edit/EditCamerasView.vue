<template>
  <NarrowContent>
    <!-- Navbar -->
    <NavbarInner :data="navbarData" />

    <!-- Camera Tabs -->
    <b-tabs
      v-if="device"
      class="devices-tabs"
    >
      <!-- Camera General Information -->
      <b-tab
        title="General"
        class="active devices-tab"
      >
        <DevicesGeneral :device="device" />
      </b-tab>

      <!-- Camera Profile -->
      <b-tab
        title="Profile"
        class="devices-tab"
      >
        Profile content
      </b-tab>

      <!-- Device Billing -->
      <b-tab
        title="Billing"
        class="devices-tab"
      >
        Billing Content
      </b-tab>

      <!-- Device Notifications -->
      <b-tab
        title="Notifications"
        class="devices-tab"
      >
        Notifications content
      </b-tab>
    </b-tabs>
  </NarrowContent>
</template>

<script>
export default {
  name: 'EditCamerasView',
  components: {
    DevicesGeneral: () => import('@/components/devices/cameras/CamerasGeneral'),
    NavbarInner: () => import('@/components/globals/NavbarInner'),
    NarrowContent: () => import('@/components/hoc/NarrowContent')
  },
  data () {
    return {
      navbarData: {
        pretitle: 'Settings > Devices > Cameras',
        path: 'DevicesView'
      },
      device: null
    }
  },
  mounted () {
    // Check if there is a Device in the Params
    if (this.$route.params.device) {
      this.device = this.$route.params.device
      this.navbarData.title = this.$route.params.device.name || 'Unnamed Device'
    } else {
      this.$router.replace({ name: 'DevicesView' })
    }
  }
}
</script>

<style scoped lang="sass">
.devices-tabs
  margin-top: -20px
.devices-tab
  outline: none
</style>
