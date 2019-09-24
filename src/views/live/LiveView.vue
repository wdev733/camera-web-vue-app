<template>
  <div class="live-view">
    <!-- Loading State -->
    <div class="text-center">
      <LoadingState v-if="loading" />
    </div>

    <!-- Cannot Edit Live Views Message -->
    <div
      v-if="!showCameras && !loading"
      class="no-cameras-message"
    >
      <h3>You have no cameras registered</h3>
      <router-link
        :to="{ name: 'DevicesSetupView' }"
        tag="button"
        class="btn btn-danger"
      >
        Register your first device
      </router-link>
    </div>

    <!-- Live View Wrapper -->
    <div
      v-if="!loading && showCameras"
      class="live-view-wrapper"
    >
      <!-- Navbar -->
      <div class="header">
        <div class="header-body">
          <div class="row align-items-center">
            <div class="col">
              <b-dropdown variant="primary">
                <template slot="text">
                  View: {{ currentDropdownViewName }}
                </template>
                <div>
                  <!-- View All -->
                  <b-dropdown-item
                    @click="selectAllCameras"
                  >
                    View All
                  </b-dropdown-item>

                  <!-- Sites Views -->
                  <b-dropdown-header>
                    Sites
                  </b-dropdown-header>
                  <b-dropdown-item
                    v-for="(site, index) in userSites"
                    :key="index"
                    @click="selectSite(site)"
                  >
                    {{ site.name }}
                  </b-dropdown-item>

                  <!-- Team Views -->
                  <b-dropdown-header v-if="getTeamViews.length">
                    Team Views
                  </b-dropdown-header>
                  <b-dropdown-item
                    v-for="view in getTeamViews"
                    :key="view.id"
                    @click="selectView(view)"
                  >
                    {{ view.name }}
                  </b-dropdown-item>

                  <!-- Personal Views -->
                  <b-dropdown-header v-if="getPersonalViews.length">
                    Personal Views
                  </b-dropdown-header>
                  <b-dropdown-item
                    v-for="view in getPersonalViews"
                    :key="view.id"
                    @click="selectView(view)"
                  >
                    {{ view.name }}
                  </b-dropdown-item>
                </div>
              </b-dropdown>
              <div class="float-right">
                <router-link
                  tag="a"
                  class="btn btn-secondary mr-2 "
                  :to="{ name: 'LiveSetupView' }"
                >
                  View Editor
                </router-link>
                <button
                  class="btn btn-primary"
                  @click="toggle"
                >
                  <span class="fe fe-maximize-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- All Cameras List -->
      <Fullscreen
        v-if="!showGrid"
        ref="fullscreenDevices"
        class="overflow-hidden"
        @change="fullscreenChange"
      >
        <!-- Cannot Edit Live Views Message -->
        <div
          v-if="!getCameras.length && !loading"
          class="no-cameras-message"
        >
          <h3>No cameras in this site.</h3>
        </div>

        <b-row
          v-if="!selectedCamera && !showInFullscreen"
        >
          <!-- Camera List -->
          <b-col
            v-for="camera in getCameras"
            :key="camera.id"
            :lg="4"
            :sm="12"
            class="mb-5"
          >
            <LiveCameraWidget
              :single-camera="false"
              :camera="camera"
              :parent-fullscreen="fullscreen"
              @cameraSelected="setCameraFullscreen"
              @stopFullscreenChild="stopFullscreenChild"
            />
          </b-col>
        </b-row>

        <!-- Single Camera Shown In Fullscreen -->
        <LiveCameraWidget
          v-if="showInFullscreen && selectedCamera && getCameraPermission(selectedCamera)"
          :camera="selectedCamera"
          :parent-fullscreen="fullscreen"
          single-camera
          @cameraSelected="setCameraFullscreen"
          @stopFullscreenChild="stopFullscreenChild"
        />
      </Fullscreen>

      <!-- Cameras List With Views -->
      <Fullscreen
        v-if="showGrid && showEditor"
        ref="fullscreenDevices"
        :class="{ 'fullscreen-dnd-grid': fullscreen }"
        @change="fullscreenChange"
      >
        <!-- Live Setup Camera Container -->
        <Container
          v-if="!fullscreenChild"
          ref="liveEditor"
          :layout.sync="layoutJson"
          :style="getGridContainerStyle"
          :cell-size="getCellSizes"
          :max-column-count="12"
          :max-row-count="12"
          :margin="1"
        >
          <!-- Camera List -->
          <Box
            v-for="(camera, index) in getCamerasFromLayout"
            id="live-editor"
            :key="`${camera.id}${index}`"
            :box-id="camera.id"
          >
            <LiveCameraWidget
              :single-camera="false"
              :camera="camera"
              :parent-fullscreen="fullscreen"
              @cameraSelected="setCameraFullscreen"
              @stopFullscreenChild="stopFullscreenChild"
            />
          </Box>
        </Container>

        <!-- Single Camera Shown In Fullscreen -->
        <LiveCameraWidget
          v-if="showInFullscreen && selectedCamera && getCameraPermission(selectedCamera)"
          :camera="selectedCamera"
          :parent-fullscreen="fullscreen"
          single-camera
          @cameraSelected="setCameraFullscreen"
          @stopFullscreenChild="stopFullscreenChild"
        />
      </Fullscreen>

      <!-- Cannot See Live Views in Size Message -->
      <div
        v-if="showGrid && !showEditor && !loading"
        class="cannot-edit-message"
      >
        <h3>Cannot See Views In This Screen Size</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Container, Box } from '@dattn/dnd-grid'
import { getCameraPermissions } from '../../api/CamerasEndpoints'
import Janus from '../../plugins/JanusPlugin/janus'

export default {
  name: 'LiveView',
  components: {
    Container,
    Box,
    LoadingState: () => import('@/components/globals/LoadingState'),
    LiveCameraWidget: () => import('@/components/live/LiveCameraWidget'),
    Fullscreen: () => import('vue-fullscreen/src/component')
  },
  data () {
    return {
      loading: false,
      fullscreen: false,
      fullscreenChild: false,
      showGrid: false,
      selectedCamera: null,
      layoutJson: [],
      navbarData: {
        pretitle: 'Live',
        title: 'Cameras'
      },
      listType: 'all',
      window: {},
      windowWidth: 0,
      permissionsData: [],
      camerasByView: []
    }
  },
  computed: {
    ...mapGetters('UsersModule', ['user']),
    ...mapGetters('SitesModule', ['userSites', 'currentSite']),
    ...mapGetters('DevicesModule', ['getUserCameras', 'userCamerasBySite', 'getUserIfus']),
    ...mapGetters('ViewsModule', ['userViews', 'getTeamViews', 'getPersonalViews', 'selectedView']),
    ...mapGetters('JanusModule', ['getActualStreams', 'getCurrentStreams']),
    // Check Cameras to Show Live View
    showCameras () {
      return this.getUserCameras.length
    },
    // Check if
    getCameras () {
      if (this.listType === 'all') {
        return this.getUserCameras.filter(c => this.getCameraPermission(c))
      } else {
        return this.userCamerasBySite.filter(c => this.getCameraPermission(c))
      }
    },
    // Get Dropdown View Name
    currentDropdownViewName () {
      if (this.listType === 'view') {
        return `${this.selectedView.name}`
      } else if (this.listType === 'site') {
        return `${this.currentSite.name}`
      } else {
        return 'All Cameras'
      }
    },
    // Get Grid Container Style
    getGridContainerStyle () {
      const { width } = this.window
      const height = width * 9 / 16
      const border = this.fullscreen ? '1px solid white' : '1px solid black'
      return { 'height': `${height}px`, border, width: '100%' }
    },
    // Check Width to Show Editor
    showEditor () {
      return this.windowWidth > 768
    },
    // Get Grid Layout Cell Sizes Depending on Window Width
    getCellSizes () {
      const { width } = this.window
      const cellWidth = (width / 12) - 1.2
      const cellHeight = (width / 12 * 9 / 16) - 1.1
      return { w: cellWidth, h: cellHeight }
    },
    // Check if Dark Theme is Active
    isDarkTheme () {
      return this.getTheme
    },
    // Should Show Camera in Fullscreen
    showInFullscreen () {
      return this.fullscreen && this.selectedCamera && this.fullscreenChild
    },
    // Get Allowed Cameras Inside Layout
    getCamerasFromLayout () {
      return this.layoutJson.filter(l => this.getCameraPermission(l))
    }
  },
  watch: {
    // Check for Selected View and Pin the Layout
    selectedView (newValue) {
      if (newValue.layout_data) {
        const newLayout = JSON.parse(newValue.layout_data).map(l => { return { ...l, pinned: true } })
        this.layoutJson = newLayout || []
        this.camerasByView = newLayout.map(l => l.camera)
      }
    },
    getActualStreams (newValue) {
      for (let i = 0; i < newValue.length; i++) {
        const element = document.getElementById(`janusVideo${newValue[i].id}`)
        if (element) {
          Janus.attachMediaStream(element, newValue[i].stream)
        }
      }
    }
  },
  created () {
    // Add Event Listeners
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('fullscreenchange', this.handleResize)
    this.handleResize()
  },
  async destroyed () {
    // Remove Event Listeners
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('fullscreenchange', this.handleResize)
    await this.$clearStreams()
  },
  async mounted () {
    this.loading = true
    await this.getUserSites()
    await this.getUserDevices()
    this.$initJanus(this.getUserIfus)
    await this.getUserViews('loadLive')
    await this.loadPermissions()
    if (this.selectedView && this.selectedView.id) {
      this.selectView(this.selectedView)
      this.layoutJson = JSON.parse(this.selectedView.layout_data).map(l => { return { ...l, pinned: true } }) || []

      const camerasFromLayout = this.layoutJson.map(l => l.camera)
      this.camerasByView = camerasFromLayout.filter(c => this.getCameras.find(fc => fc.id === c.id))
    } else {
      await this.$attachStreams(this.getCameras)
    }
    this.loading = false
  },
  methods: {
    ...mapActions('SitesModule', ['getUserSites', 'setCurrentSite']),
    ...mapActions('DevicesModule', ['getUserDevices']),
    ...mapActions('ViewsModule', ['getUserViews', 'setSelectedView']),
    // On Resize, Add Window Height/Width for Reactivity
    handleResize () {
      this.window = this.getLiveEditorSize()
      this.windowWidth = window.innerWidth
    },
    // Get Live Editor Size Dynamically
    getLiveEditorSize () {
      let editorWidth = 0

      if (this.fullscreen) {
        editorWidth = window.innerWidth
      } else {
        if (window.innerWidth > 1200) {
          editorWidth = 1118
        } else if (window.innerWidth > 992) {
          editorWidth = 939
        } else {
          editorWidth = 699
        }
      }
      return { width: editorWidth, height: editorWidth / 16 * 9 }
    },
    // Load Permissions for Each User
    async loadPermissions () {
      let permissionsList = []
      await Promise.all(
        this.getUserCameras.map(async camera => {
          const permission = await getCameraPermissions(camera.id, this.user.id)
          permissionsList.push({ camera: camera, permissions: permission })
        })
      )
      this.permissionsData = [ ...permissionsList ]
    },
    // Get Camera Permission To View
    getCameraPermission (camera) {
      const cameraId = camera.camera ? camera.camera.id : camera.id
      if (camera) {
        const canView = this.permissionsData.find(p => p.camera.id === cameraId)
        if (canView) {
          return canView.permissions.can_view
        }
      }
    },
    // Toggle Fullscreen
    toggle () {
      this.$refs['fullscreenDevices'].toggle()
    },
    // Set Fullscreen and Disable Child Fullscreen
    async fullscreenChange (fullscreen) {
      this.fullscreen = fullscreen
      this.selectedCamera = null
      if (!this.fullscreen && this.fullscreenChild) {
        await this.$clearStreams()
        this.$attachStreams(this.getCameras)
      }
      this.fullscreenChild = false
    },
    // Set Child Fullscreen And Select Camera
    async setCameraFullscreen (cam) {
      this.selectedCamera = cam
      if (this.fullscreen) {
        await this.$clearStreams()
        this.$attachStreams(this.getCameras)
      }
      this.fullscreenChild = true
    },
    async stopFullscreenChild (cam) {
      this.selectedCamera = cam
      if (this.fullscreen) {
        await this.$clearStreams()
        this.$attachStreams(this.getCameras)
      }
      this.fullscreenChild = false
    },
    // Select All Cameras and Hide Grid View
    async selectAllCameras () {
      this.setSelectedView({})

      if (this.listType === 'view') {
        await this.$clearStreams()
        this.$attachStreams(this.getCameras)
      }

      this.listType = 'all'
      this.showGrid = false
    },
    // Select Cameras by Site and Hide Grid View
    async selectSite (site) {
      this.setCurrentSite(site)
      this.setSelectedView({})
      if (this.listType === 'view') {
        await this.$clearStreams()
        this.$attachStreams(this.getCameras)
      }
      this.listType = 'site'
      this.showGrid = false
    },
    // Show Grid and Select View
    async selectView (view) {
      this.setSelectedView(view)
      await this.$clearStreams()
      this.$attachStreams(this.camerasByView)
      this.listType = 'view'
      this.showGrid = true
    }
  }
}
</script>

<style lang="sass">
.fullscreen-grid
  height: 100vh
  display: flex
  align-items: center
  justify-content: center

.fullscreen-dnd-grid
  height: 100vh
  display: flex
  align-items: center
  overflow: hidden

.no-cameras-message
  text-align: center
  margin: 35vh auto

.cannot-edit-message
  text-align: center
  margin: 30vh auto

</style>
