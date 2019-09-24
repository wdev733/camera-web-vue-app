<template>
  <!-- Edit Pane Modal -->
  <b-modal
    id="edit-pane-modal"
    title="Edit Pane"
  >
    <h3
      v-if="getFilteredCameras.length"
      class="my-3"
    >
      Camera
    </h3>
    <!-- Cameras Dropdown -->
    <div
      class="inline my-3"
    >
      <b-dropdown
        v-if="getFilteredCameras.length"
        :text="getCurrentCamera"
        size="md"
        variant="primary"
        class="text-capitalize"
      >
        <b-dropdown-item-button
          v-for="camera in getFilteredCameras"
          :key="camera.id"
          class="primary"
          @click="selectedCamera.camera = camera"
        >
          <span class="text-capitalize">{{ getCameraName(camera) }}</span>
        </b-dropdown-item-button>
      </b-dropdown>
      <div class="float-right">
        <b-form-checkbox
          v-model="selectedCamera.lockAspectRatio"
        >
          Maintain Aspect Ratio
        </b-form-checkbox>
      </div>
    </div>
    <h3 class="mt-2">
      Mode
    </h3>
    <div class="btn-group">
      <button
        class="btn btn-xs"
        :class="getLiveClass('live')"
        @click="selectedCamera.type = 'live'"
      >
        Live
      </button>
      <button
        :class="getLiveClass('playback')"
        class="btn btn-xs"
        @click="selectedCamera.type = 'playback'"
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
          @click="selectedCamera.fitOption = 'stretch'"
        >
          Stretch
        </button>
        <button
          class="btn btn-info btn-xs"
          :class="getFitClass('fit')"
          @click="selectedCamera.fitOption = 'fit'"
        >
          Fit
        </button>
        <button
          :class="getFitClass('crop')"
          class="btn btn-info btn-xs"
          @click="selectedCamera.fitOption = 'crop'"
        >
          Crop
        </button>
      </div>
    </div>

    <template slot="modal-footer">
      <button
        class="btn btn-primary btn-block"
        @click="savePane"
      >
        Save
      </button>
      <br>
      <button
        class="btn btn-danger btn-block"
        @click="deleteCamera"
      >
        Delete Camera
      </button>
    </template>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'EditPaneModal',
  data () {
    return {
      selectedCamera: {},
      lockAspectRatio: false,
      fitOption: null
    }
  },
  computed: {
    ...mapGetters('DevicesModule', ['getUserCameras', 'getSelectedCamera']),
    getCurrentCamera () {
      if (this.selectedCamera && this.selectedCamera.camera) {
        return `Current: ${this.getCameraName(this.selectedCamera.camera).toUpperCase()}`
      } else {
        return 'Select A Camera'
      }
    },
    getFilteredCameras () {
      if (this.selectedCamera.camera) {
        return this.getUserCameras.filter(c => this.selectedCamera.camera.id !== c.id)
      } else {
        return []
      }
    }
  },
  watch: {
    getSelectedCamera (newValue) {
      if (newValue) {
        this.selectedCamera = newValue
      }
    }
  },
  mounted () {
    if (this.getSelectedCamera) {
      this.selectedCamera = this.getSelectedCamera
    }
  },
  methods: {
    getLiveClass (type) {
      if (this.selectedCamera && this.selectedCamera.type === type) {
        return 'btn-success'
      } else {
        return 'btn-white'
      }
    },
    getFitClass (type) {
      if (this.selectedCamera && this.selectedCamera.fitOption === type) {
        return 'btn-info'
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
      this.$emit('savePane')
      this.$bvModal.hide('edit-pane-modal')
    },
    deleteCamera () {
      this.$emit('deletePane', this.getSelectedCamera.id)
      this.$bvModal.hide('edit-pane-modal')
    }
  }
}
</script>

<style scoped>

</style>
