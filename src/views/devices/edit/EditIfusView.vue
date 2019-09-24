<template>
  <NarrowContent>
    <!-- Navbar -->
    <NavbarInner :data="navbarData" />
    <!-- Ifu General Information -->
    <IfusGeneral
      v-if="device"
      :device="device"
    />
  </NarrowContent>
</template>

<script>
export default {
  name: 'EditIfusView',
  components: {
    IfusGeneral: () => import('@/components/devices/ifus/IfusGeneral'),
    NavbarInner: () => import('@/components/globals/NavbarInner'),
    NarrowContent: () => import('@/components/hoc/NarrowContent')
  },
  data () {
    return {
      navbarData: {
        pretitle: 'Settings > Devices > Interface Units',
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
