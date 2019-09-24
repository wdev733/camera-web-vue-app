<template>
  <video
    :id="`janusVideo${getCameraID}`"
    class="bg-dark"
    playsinline
    autoplay
    muted
    @stalled="$emit('isWaiting')"
    @playing="$emit('started')"
  />
</template>

<script>
export default {
  name: 'JanusVideo',
  props: {
    camera: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  computed: {
    getCameraID () {
      return this.camera.camera ? this.camera.camera.id : this.camera.id
    }
  },
  mounted () {
    this.$emit('isWaiting')
  }
}
</script>

<style scoped>

</style>
