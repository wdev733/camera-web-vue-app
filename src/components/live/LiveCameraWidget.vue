<template>
  <!-- Live Camera Widget -->
  <Fullscreen
    ref="fullscreen"
    class="full-width-camera"
    @change="fullscreenChange"
  >
    <!-- Janus Video Component -->
    <JanusVideo
      ref="janus"
      class="full-width-camera"
      style="background-color: black !important; object-fit: contain !important"
      :camera="camera"
      @isWaiting="isWaiting = true"
      @started="isWaiting = false"
    />

    <!-- Video Overlay -->
    <div
      ref="overlay"
      class="card-img-overlay text-white"
      @wheel="zoomWheelHandle"
    >
      <!-- Loading State -->
      <div
        v-if="isCameraLoading && cameraHasError"
        class="live-camera-widget--spinner"
      >
        <div
          class=" spinner-border-sm spinner-border"
        />
      </div>

      <div
        v-if="!cameraHasError"
        class="live-camera-widget--error-message text-center text-danger"
      >
        <div>
          <div class="mb-3">
            Unable to connect to camera
          </div>
          <div>
            <button
              class="btn btn-danger"
              @click="resetStream"
            >
              Retry?
            </button>
          </div>
        </div>
      </div>

      <div>
        <!-- Video Quality Dropdown -->
        <b-dropdown
          class="live-camera-widget--dropdown"
          size="sm"
          variant="black"
          no-caret
        >
          <template slot="text">
            <button
              class="btn btn-sm btn-outline-white dropdown-toggle"
            >
              Quality
            </button>
          </template>
          <b-dropdown-item @click="switchCamera(1)">
            High
          </b-dropdown-item>
          <b-dropdown-item @click="switchCamera(2)">
            Low
          </b-dropdown-item>
          <b-dropdown-item
            variant="danger"
            @click="resetStream"
          >
            Reset Camera
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <div>
        <div
          class="align-items-end"
        >
          <!-- Camera Name -->
          <span
            class="live-camera-widget--name h4 mb-1"
          >
            {{ getCameraName }}
          </span>
          <div
            v-if="showPTZOptions"
            v-closable="{
              exclude: ['ptzButton'],
              handler: 'closePTZOptions'
            }"
            class="live-camera-widget--ptz-dialog border rounded text-dark text-center"
          >
            <div
              class="fe fe-arrow-up"
              :class="{ 'text-danger': clickedArrowUp }"
              @click="moveCamera('ArrowUp', { x: 0, y: 0.1, z: 0 })"
            />
            <span
              class="fe fe-arrow-left mr-4"
              :class="{ 'text-danger': clickedArrowLeft }"
              @click="moveCamera('ArrowLeft', { x: -0.1, y: 0, z: 0 })"
            />
            <span
              class="fe fe-arrow-right"
              :class="{ 'text-danger': clickedArrowRight }"
              @click="moveCamera('ArrowRight', { x: 0.1, y: 0, z: 0 })"
            />
            <div
              class="fe fe-arrow-down"
              :class="{ 'text-danger': clickedArrowDown }"
              @click="moveCamera('ArrowDown', { x: 0, y: -0.1, z: 0 })"
            />
            <span
              class="fe fe-minus-circle mr-4"
              :class="{ 'text-danger': clickedZoomOut }"
              @click="moveCamera('ZoomOut', { x: 0, y: 0, z: -0.1 })"
            />
            <span
              class="fe fe-plus-circle"
              :class="{ 'text-danger': clickedZoomIn }"
              @click="moveCamera('ZoomIn', { x: 0, y: 0, z: 0.05 })"
            />
          </div>

          <!--<div
            v-if="clickedCamera"
            class="arrow"
          >
            <div
              class="line"
              :style="getDirectionStyle"
            />
          </div>-->

          <!-- Fullscreen Camera Button -->
          <b-button-group class="live-camera-widget--actions">
            <!-- PTZ Button -->
            <button
              ref="ptzButton"
              class="btn btn-sm btn-outline-white"
              @click="showPTZOptions = !showPTZOptions"
            >
              <span>
                PTZ
              </span>
            </button>
            <!-- Fullscreen Camera Button -->
            <button
              class="btn btn-sm btn-outline-white"
              @click="handleFullscreenWidget"
            >
              <span
                class="fe fe-maximize-2"
              />
            </button>
          </b-button-group>
        </div>
      </div>
    </div>
  </Fullscreen>
</template>

<script>
import JanusVideo from '../janus/JanusVideo'
import { mapGetters } from 'vuex'
import { relativeMove } from '../../api/PTZEndpoints'
import closableDirective from '../../directives/closableDirective'
import _ from 'lodash'

export default {
  name: 'LiveCameraWidget',
  components: {
    JanusVideo,
    Fullscreen: () => import('vue-fullscreen/src/component')
  },
  directives: {
    closableDirective
  },
  props: {
    camera: {
      type: Object,
      required: false,
      default: () => {}
    },
    parentFullscreen: {
      type: Boolean,
      required: true
    },
    singleCamera: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      fullscreen: false,
      streamQuality: 1,
      isWaiting: false,
      clickedArrowUp: false,
      clickedArrowDown: false,
      clickedArrowLeft: false,
      clickedArrowRight: false,
      clickedZoomIn: false,
      clickedZoomOut: false,
      clickedKeyZ: false,
      clickedCamera: false,
      joystickCoordinates: { x: 0, y: 0 },
      showPTZOptions: false
    }
  },
  computed: {
    ...mapGetters('UsersModule', ['getTheme']),
    ...mapGetters('JanusModule', ['getJanusHandles', 'getCurrentStreams']),
    isCameraLoading () {
      return this.isWaiting
    },
    cameraHasError () {
      const camera = this.camera.camera ? this.camera.camera : this.camera
      return this.getJanusHandles.find(s => s.ifu === camera.ifu_id)
    },
    getCameraName () {
      if (this.camera.camera && this.camera.camera.name) {
        return this.camera.camera.name
      } else if (this.camera.name) {
        return this.camera.name
      } else {
        return ''
      }
    },
    // Get Fit Option to Get Object-Fit
    getFitOption () {
      if (this.camera.camera) {
        switch (this.camera.fitOption) {
          case 'crop':
            return 'fill'
          case 'fit':
            return 'contain'
          case 'stretch':
            return '100% 100%'
          default:
            return 'cover'
        }
      } else {
        return ''
      }
    },
    getLiveCameraWidgetStyle () {
      if (this.camera.camera) {
        return {
          'object-fit': this.getFitOption,
          'height': '100%',
          'width': '100%'
        }
      } else {
        return ''
      }
    }
    /* getDirectionStyle () {
      const width = this.$refs.overlay.offsetWidth
      const height = this.$refs.overlay.offsetHeight
      const { x, y } = this.joystickCoordinates

      console.log(width, height, x, y)
      const adjacent = x - (width / 2)
      const opposite = y - (height / 2)
      const hipotenuse = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2))
      const arrowWidth = hipotenuse > (width / 2 * 0.6) ? (width / 2 * 0.6) : hipotenuse
      const arrowDegrees = opposite / adjacent
      return { transform: `rotate(${arrowDegrees}rad)`, width: `${arrowWidth}px` }
    } */
  },
  created () {
    // Add event listener to be able to open global search
    document.addEventListener('keydown', (e) => {
      const key = e.code
      if (e.repeat) return

      const allowPTZCommands = this.showPTZOptions || this.fullscreen || (this.singleCamera && this.parentFullscreen)
      if (allowPTZCommands) {
        switch (key) {
          case 'ArrowUp':
            this.moveCamera('ArrowUp', { x: 0, y: 0.05, z: 0 })
            break
          case 'ArrowDown':
            this.moveCamera('ArrowDown', { x: 0, y: -0.05, z: 0 })
            break
          case 'ArrowLeft':
            this.moveCamera('ArrowLeft', { x: -0.05, y: 0, z: 0 })
            break
          case 'ArrowRight':
            this.moveCamera('ArrowRight', { x: 0.05, y: 0, z: 0 })
            break
          case 'KeyZ':
            this.moveCamera('KeyZ', { x: 0, y: 0, z: -0.05 })
            break
          case 'KeyP':
            this.closePTZOptions()
            break
        }
      } else if (key === 'KeyP') {
        this.showPTZOptions = true
      }
    })
  },
  destroyed () {
    document.removeEventListener('keydown', (e) => e)
  },
  methods: {
    // Turn buttons red on click
    showBeingClicked (key) {
      const keyPressed = `clicked${key}`
      this[keyPressed] = true
      setTimeout(() => { this[keyPressed] = false }, 200)
    },
    // Toggle Fullscreen
    toggle () {
      this.$refs['fullscreen'].toggle()
    },
    // Set Fullscreen and Stop Child Fullscreen
    async fullscreenChange (fullscreen) {
      this.fullscreen = fullscreen
      this.$emit('stopFullscreenChild')
    },
    // Check Fullscreen Widget and Set Accordingly
    handleFullscreenWidget () {
      const camera = this.camera.camera ? this.camera.camera : this.camera
      if (this.parentFullscreen && !this.singleCamera) {
        this.$emit('cameraSelected', camera)
      } else if (!this.parentFullscreen) {
        this.toggle()
      } else {
        this.fullscreenChange()
      }
    },
    // Switch Camera Quality
    switchCamera (quality) {
      const cameraId = this.camera.camera ? this.camera.camera.id : this.camera.id
      const handler = this.getCurrentStreams.find(s => s.id === cameraId)
      if (handler) {
        const body = { 'request': 'switch', id: parseInt(`${cameraId}${quality}`) }
        handler.plugin.send({ message: body })
      } else {
        this.$notify({
          text: 'Error connecting to WebRTC Server',
          type: 'error',
          group: 'notifications'
        })
      }
    },
    // Reset Video Stream
    resetStream () {
      this.isWaiting = true
      const camera = this.camera.camera ? this.camera.camera : this.camera
      this.$resetIfu(camera.ifu_id)
    },
    // Move Camera
    moveCamera: _.debounce(function (direction, move) {
      this.showBeingClicked(direction)
      this.relativeMoveMethod(move)
    }, 100),
    // PTZ Relative Move
    async relativeMoveMethod (translation) {
      const camera = this.camera.camera ? this.camera.camera : this.camera
      const moveData = {
        translation,
        speed: { 'x': 1, 'y': 1, 'z': 1 }
      }
      await relativeMove(camera.id, camera.ifu_id, { ...moveData })
    },
    // Close PTZ Menu
    closePTZOptions () {
      this.showPTZOptions = false
    },
    // Handle Mouse Wheel to Zoom
    zoomWheelHandle: _.debounce(function (event) {
      const delta = event.deltaY
      if (delta > 0) {
        this.moveCamera('ZoomOut', { x: 0, y: 0, z: -0.05 })
      } else {
        this.moveCamera('ZoomIn', { x: 0, y: 0, z: 0.05 })
      }
    }, 120)
    /* joystickCamera (e) {
      this.joystickCoordinates = { x: e.offsetX, y: e.offsetY }
      this.clickedCamera = true
    } */
  }
}
</script>

<style scoped lang="sass">
.fe
  font-size: 25px
  margin: 5px
  line-height: 25px
  cursor: pointer

.live-camera-widget
  padding: 30px
  &--dropdown
    position: absolute
    left: 10px
    top: 10px

  &--spinner
    height: 100%
    display: flex
    align-items: center
    justify-content: center

  &--error-message
    height: 100%
    display: flex
    align-items: center
    justify-content: center
    font-size: 16px

  &--name
    position: absolute
    left: 20px
    bottom: 15px

  &--actions
    position: absolute
    right: 20px
    bottom: 15px
    span
      font-size: 13px
  &--ptz
    &-dialog
      position: absolute
      border: 1px solid black !important
      padding: 15px
      background-color: white
      right: 15px
      bottom: 60px
      &:after
        content: " "
        position: absolute
        top: 100%
        left: 46%
        margin-left: -5px
        border-width: 9px
        border-style: solid
        border-color: white transparent transparent transparent

.btn-group-xs > .btn, .btn-xs
  padding: 5px
  font-size: .825rem
  line-height: .5
  border-radius: .2rem

.full-width-camera
  display: flex
  align-items: center
  justify-content: center
  background-color: black
  height: 100%
  width: 100%
  overflow: hidden !important
  &:hover
    cursor: crosshair

.cannot-watch-camera
  min-height: 250px
  min-width: 250px
  display: flex
  justify-content: center
  align-items: center

.arrow
  z-index: 30000
  margin-top: -20px
  position: absolute

.line
  margin-top: 14px
  width: 90px
  background: #ffffff
  height: 4px
  float: left

.point
  width: 0
  height: 0
  border-top: 10px solid transparent
  border-bottom: 10px solid transparent
  border-left: 20px solid rgba(255, 255, 255, 0.98)
  position: relative
  float: right
  margin-top: 6px

</style>
