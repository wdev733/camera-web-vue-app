<template>
  <!-- Add Pane Modal -->
  <b-modal
    id="add-pane-modal"
    title="Add Pane To View"
  >
    <h4 v-if="availableCameras.length">
      Camera
    </h4>
    <!-- Cameras Dropdown -->
    <div
      v-if="availableCameras.length"
      class="inline my-3"
    >
      <b-dropdown
        :text="getCurrentCamera"
        size="md"
        variant="primary"
        class="text-capitalize"
      >
        <b-dropdown-item-button
          v-for="camera in availableCameras"
          :key="camera.id"
          class="primary"
          @click="selectedCamera = camera"
        >
          <span class="text-capitalize">{{ getCameraName(camera) }}</span>
        </b-dropdown-item-button>
      </b-dropdown>
      <div class="float-right">
        <b-form-checkbox
          v-model="lockAspectRatio"
        >
          Maintain Aspect Ratio
        </b-form-checkbox>
      </div>
    </div>

    <div v-else>
      No other cameras to add
    </div>
    <h4 class="mt-5">
      Mode
    </h4>
    <div class="btn-group">
      <button
        class="btn btn-xs"
        :class="getLiveClass('live')"
        @click="cameraType = 'live'"
      >
        Live
      </button>
      <button
        :class="getLiveClass('playback')"
        class="btn btn-xs"
        @click="cameraType = 'playback'"
      >
        Playback
      </button>
    </div>

    <div class="inline float-right">
      <span class="font-weight-bold mr-3">Fit</span>
      <div class="btn-group">
        <button
          class="btn btn-info btn-xs"
          :class="getFitClass('stretch')"
          @click="fitOption = 'stretch'"
        >
          Stretch
        </button>
        <button
          class="btn btn-info btn-xs"
          :class="getFitClass('fit')"
          @click="fitOption = 'fit'"
        >
          Fit
        </button>
        <button
          :class="getFitClass('crop')"
          class="btn btn-info btn-xs"
          @click="fitOption = 'crop'"
        >
          Crop
        </button>
      </div>
    </div>

    <!-- Modal Footer -->
    <div slot="modal-footer">
      <button
        :disabled="!selectedCamera"
        class="btn btn-primary"
        @click="savePane"
      >
        Save
      </button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AddPaneModal',
  props: {
    newCamera: {
      type: Object,
      required: true
    },
    availableCameras: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data () {
    return {
      cameraType: 'live',
      selectedCamera: null,
      lockAspectRatio: false,
      fitOption: 'stretch'
    }
  },
  computed: {
    ...mapGetters('DevicesModule', ['getUserCameras']),
    getCurrentCamera () {
      if (this.selectedCamera) {
        return `Current: ${this.getCameraName(this.selectedCamera).toUpperCase()}`
      } else {
        return 'Select A Camera'
      }
    }
  },
  methods: {
    getLiveClass (type) {
      if (this.cameraType === type) {
        return 'btn-success'
      } else {
        return 'btn-white'
      }
    },
    getFitClass (type) {
      if (this.fitOption === type) {
        return 'btn-success'
      } else {
        return 'btn-white'
      }
    },
    getCameraName (camera) {
      if (camera) {
        return camera.name ? camera.name : `${camera.type.slice(0, -1)} ${camera.id}`
      }
    },
    savePane () {
      const camera = this.newCamera
      camera.type = this.cameraType
      camera.camera = this.selectedCamera
      camera.lockAspectRatio = this.lockAspectRatio
      camera.fitOption = this.fitOption
      this.$emit('addPane', camera)
      this.$bvModal.hide('add-pane-modal')
    }
  }
}
</script>

<style scoped>

</style>
