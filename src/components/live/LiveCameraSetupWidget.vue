<template>
  <!-- Live Camera Setup Widget -->
  <div
    class="full-width-camera"
    style="background-color: black !important"
  >
    <div :style="getLiveCameraWidgetStyle">
      <div :class="{ 'card-img-overlay': outbound }" />
      <button
        v-if="!outbound"
        class="btn btn-sm btn-warning edit-button absolute"
        @click="editCamera"
      >
        <span
          class="fe fe-settings"
        />
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LiveCameraSetupWidget',
  props: {
    camera: {
      type: Object,
      required: true
    },
    outbound: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters('UsersModule', ['getTheme']),
    // Get Fit Option to Get Object-Fit
    getFitOption () {
      switch (this.camera.fitOption) {
        case 'crop':
          return 'cover'
        case 'fit':
          return 'contain'
        case 'stretch':
          return '100% 100%'
        default:
          return 'cover'
      }
    },
    getLiveCameraWidgetStyle () {
      return {
        'background-image': 'url(https://2.bp.blogspot.com/-yGHl4Xj-Rz4/WQ8VqkS1SsI/AAAAAAAAPN8/QXcaym0OqigHgE1q0ZW2HdxZiUak1uDzwCLcB/s1600/IMG_1164.JPG)',
        'background-size': this.getFitOption,
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'height': '100%',
        'width': '100%'
      }
    }
  },
  methods: {
    ...mapActions('DevicesModule', ['setSelectedCamera']),
    editCamera () {
      this.setSelectedCamera(this.camera)
      this.$emit('stopSaving')
      this.$bvModal.show('edit-pane-modal')
    }
  }
}
</script>

<style scoped lang="sass">
.full-width-camera
  height: 100%
  width: 100%

.card-img-overlay
  background-color: rgba(255, 0, 0, 0.26)

.edit-button
  position: absolute
  right: 10px
  bottom: 10px
  cursor: pointer
</style>
