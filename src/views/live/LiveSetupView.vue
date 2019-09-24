<template>
  <!-- Live Setup View -->
  <div class="live-setup-view">
    <!-- Loading State -->
    <div class="text-center">
      <LoadingState v-if="loading" />
    </div>

    <!-- Cannot Edit Live Views Message -->
    <div
      v-show="!showEditor && !loading"
      class="cannot-edit-message"
    >
      <h3>Cannot Edit Cameras On This Screen Size</h3>
      <router-link
        :to="{ name: 'SettingsView' }"
        tag="button"
        class="btn btn-danger"
      >
        Go To Dashboard
      </router-link>
    </div>

    <!-- Live Setup Editor -->
    <div
      v-show="showEditor && !loading"
      class="live-setup-editor"
    >
      <!-- Top Navbar -->
      <div class="header">
        <div class="header-body">
          <div class="row">
            <div
              class="col"
            >
              <!-- Pretitle -->
              <h6 class="header-pretitle">
                View Editor
              </h6>

              <!-- Views Selector -->
              <b-dropdown
                v-if="userViews.length"
                variant="primary"
                class="mr-3"
              >
                <template slot="text">
                  Editing: {{ selectedView.name }}
                  <span
                    v-if="selectedView.type === 'team'"
                    class="badge badge-info"
                  >
                    Global
                  </span>
                </template>
                <div>
                  <div v-if="getTeamViews.length">
                    <!-- Global Views -->
                    <b-dropdown-header>
                      Global Views
                    </b-dropdown-header>
                    <div
                      v-for="view in getTeamViews"
                      :key="view.id"
                    >
                      <b-dropdown-item
                        v-if="view.type === 'team'"
                        class="ml-3"
                        @click="setSelectedView(view)"
                      >
                        {{ view.name }}
                      </b-dropdown-item>
                    </div>
                  </div>
                  <div v-if="getPersonalViews.length">
                    <!-- Personal Views -->
                    <b-dropdown-header class="dropdown-item">
                      Personal Views
                    </b-dropdown-header>
                    <div
                      v-for="view in getPersonalViews"
                      :key="view.id"
                    >
                      <b-dropdown-item
                        v-if="view.type === 'user'"
                        class="ml-3"
                        @click="setSelectedView(view)"
                      >
                        {{ view.name }}
                      </b-dropdown-item>
                    </div>
                  </div>
                </div>
              </b-dropdown>

              <!-- Create New View -->
              <button
                v-b-modal.create-view-modal
                class="btn btn-success"
              >
                Create New View
              </button>
            </div>

            <!-- Exit Editor -->
            <div class="col-auto">
              <router-link
                tag="a"
                :to="{ name: 'LiveView' }"
                class="btn btn-primary"
              >
                Exit View Editor
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Inner Navbar -->
      <div class="row">
        <div
          v-if="selectedView"
          class="col"
        >
          <div class="btn-toolbar mb-4">
            <div class="btn-group mr-2">
              <!-- Add Pane -->
              <button
                class="btn btn-sm btn-success"
                :disabled="loadingDelete || !filteredViewCameras.length"
                @click="addPaneToGrid"
              >
                Add pane
              </button>
            </div>
          </div>
        </div>
        <div class="col-auto">
          <!-- Reset Layout -->
          <button
            v-if="selectedView && layoutJson.length"
            class="btn btn-sm btn-primary mr-3"
            :disabled="!layoutChanged || loadingSave"
            @click="updateViewMethod"
          >
            <span>
              Save View
              <span
                v-if="loadingSave"
                class="ml-2 spinner-border spinner-border-sm"
              />
            </span>
          </button>

          <!-- View Settings -->
          <button
            v-if="selectedView"
            v-b-modal.edit-view-modal
            class="btn btn-sm btn-info mr-3"
          >
            View Settings
          </button>

          <!-- Reset Layout -->
          <button
            v-if="layoutJson.length && selectedView"
            v-b-modal.reset-layout-modal
            class="btn btn-sm btn-dark mr-3"
          >
            Reset Layout
          </button>

          <!-- Delete View -->
          <button
            v-if="selectedView && userViews.length"
            v-b-modal.delete-view-modal
            class="btn btn-sm btn-danger"
            :disabled="loadingDelete"
          >
            <div
              v-if="loadingDelete"
              class="spinner-border spinner-border-sm"
            />
            <span v-else>Delete View </span>
          </button>
        </div>
      </div>

      <!-- Live Setup Camera Container -->
      <Container
        ref="liveEditor"
        class="grid-container"
        :class="{ 'grid-container-dark': isDarkTheme }"
        :style="getGridContainerStyle"
        :layout.sync="layoutJson"
        :cell-size="getCellSizes"
        :max-column-count="12"
        :max-row-count="12"
        :margin="0"
      >
        <!-- No Cameras Added Message -->
        <div
          v-if="!layoutJson.length"
          class="no-cameras-message"
        >
          <h2>
            Add a camera to start editing your view
          </h2>
        </div>

        <!-- Camera List -->
        <div
          v-show="layoutJson.length"
          id="live-editor"
        >
          <div
            v-for="camera in layoutJson"
            :key="camera.id"
          >
            <Box
              :box-id="camera.id"
              @dragEnd="handleDragEnd"
              @resizeEnd="checkAspectRatioAndUpdate(camera)"
            >
              <LiveCameraSetupWidget
                :outbound="getOutbound(camera)"
                :camera="camera"
                @stopSaving="stopSaving"
                @deleteCamera="removePaneFromGrid"
              />
            </Box>
          </div>
        </div>
      </Container>

      <!-- Add Pane Modal -->
      <AddPaneModal
        :new-camera="newCamera"
        :available-cameras="filteredViewCameras"
        @addPane="savePaneToGrid"
      />

      <!-- Edit Pane Modal -->
      <EditPaneModal
        @savePane="updateViewMethod"
        @deletePane="removePaneFromGrid"
      />

      <!-- Create View Modal -->
      <CreateViewModal />

      <!-- Edit View Modal -->
      <EditViewModal @updateView="updateViewMethod" />

      <!-- Reset Layout Modal -->
      <ResetLayoutModal @reset="resetLayout" />

      <!-- Delete View Modal -->
      <DeleteViewModal @delete="deleteView" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { Container, Box } from '@dattn/dnd-grid'
import { findFirstEmptyPosition } from '../../utils/addCameraToPane'
import { updateView, deleteView } from '../../api/ViewsEndpoints'

export default {
  name: 'LiveSetupView',
  components: {
    AddPaneModal: () => import('@/components/live-editor/AddPaneModal'),
    EditPaneModal: () => import('@/components/live-editor/EditPaneModal'),
    ResetLayoutModal: () => import('@/components/live-editor/ResetLayoutModal'),
    CreateViewModal: () => import('@/components/live-editor/CreateViewModal'),
    EditViewModal: () => import('@/components/live-editor/EditViewModal'),
    DeleteViewModal: () => import('@/components/live-editor/DeleteViewModal'),
    LiveCameraSetupWidget: () => import('@/components/live/LiveCameraSetupWidget'),
    LoadingState: () => import('@/components/globals/LoadingState'),
    Container,
    Box
  },
  data () {
    return {
      loading: false,
      loadingDelete: false,
      loadingSave: false,
      layoutJson: [],
      newCamera: {},
      window: {},
      windowWidth: null,
      saveInterval: null,
      layoutChanged: false
    }
  },
  computed: {
    ...mapGetters('UsersModule', ['getTheme']),
    ...mapGetters('DevicesModule', ['getUserCameras']),
    ...mapGetters('ViewsModule', ['selectedView', 'userViews', 'getTeamViews', 'getPersonalViews']),
    // Check Width to Show Editor
    showEditor () {
      return this.windowWidth > 768
    },
    // Get Grid Layout Cell Sizes Depending on Window Width
    getCellSizes () {
      return { w: this.window.width / 12 - 0.7, h: (this.window.width / 12 * 9 / 16 - 0.7) }
    },
    // Get Grid Container width
    getGridContainerStyle () {
      return { 'min-height': `${this.window.width * 9 / 16}px`, 'max-height': `${this.window.width * 9 / 16}px` }
    },
    // Check if Dark Theme is Active
    isDarkTheme () {
      return this.getTheme
    },
    filteredViewCameras () {
      return this.getUserCameras.filter(c => !this.layoutJson.find(l => l.camera.id === c.id))
    }
  },
  watch: {
    selectedView (newValue) {
      if (newValue) {
        this.layoutJson = JSON.parse(newValue.layout_data) || []
      }
    }
  },
  async mounted () {
    this.loading = true
    await this.getUserDevices()
    await this.getUserViews('loadSetup')
    if (!this.getUserCameras.length) {
      await this.$router.replace({ name: 'LiveView' })
      this.$notify({
        group: 'notifications',
        text: 'You cannot see the editor if you have no cameras',
        type: 'error'
      })
      this.loading = false
    } else {
      if (this.selectedView) {
        this.layoutJson = JSON.parse(this.selectedView.layout_data) || []
      }
      this.loading = false
      this.startAutoSave()
    }
  },
  created () {
    // Add Resize Listener
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed () {
    // Remove Resize Listener
    window.removeEventListener('resize', this.handleResize)
    clearInterval(this.saveInterval)
  },
  methods: {
    ...mapActions('DevicesModule', ['getUserDevices']),
    ...mapActions('ViewsModule', ['getUserViews', 'setSelectedView']),
    // On Resize, Add Window Height/Width for Reactivity
    handleResize () {
      this.window = this.getLiveEditorSize()
      this.windowWidth = window.innerWidth
    },
    // Check if Aspect Ratio is Locked
    checkAspectRatio: _.debounce(function (camera) {
      if (camera.lockAspectRatio) {
        const foundCamera = this.layoutJson.find(c => c.id === camera.id)
        foundCamera.position.h = foundCamera.position.w
      }
    }, 0),
    // Get Live Editor Size
    getLiveEditorSize () {
      let editorWidth = 0
      if (window.innerWidth > 1200) {
        editorWidth = 1116
      } else if (window.innerWidth > 992) {
        editorWidth = 936
      } else {
        editorWidth = 696
      }
      return { width: editorWidth, height: editorWidth / 16 * 9 }
    },
    // Check if Camera is Outside of Grid
    getOutbound (l) {
      if (l) {
        const outBoundX = l.position.x + l.position.w > 12
        const outBoundY = l.position.y + l.position.h > 12
        const outBoundRestart = (l.position.h && l.position.w) === 0
        return outBoundX || outBoundY || outBoundRestart
      }
    },
    // Reset Layout
    async resetLayout () {
      for (let i = 0; i < this.layoutJson.length; i++) {
        const previousItem = this.layoutJson[i - 1]
        const currentItem = this.layoutJson[i]

        // Specifications for default
        const myWidth = 2
        const myHeight = 2
        const maxWidth = 12

        // Reset all cameras
        currentItem.position.w = myWidth
        currentItem.position.h = myHeight

        if (previousItem === undefined) {
          // First Item
          currentItem.position.x = 0
          currentItem.position.y = 0
        } else {
          // Items in the same row
          currentItem.position.x = previousItem.position.x + myWidth
          if (currentItem.position.x > maxWidth) {
            // Items in the next row
            currentItem.position.x = 0
            currentItem.position.y = previousItem.position.y + myHeight
          } else {
            currentItem.position.y = previousItem.position.y
          }
        }
      }
      this.layoutChanged = true
      this.resetAutoSave()
    },
    // Add Pane To Grid
    addPaneToGrid () {
      const id = Math.floor((Math.random() * 100000) + 1)
      const start = { id, position: { h: 1, w: 1 } }

      // Check if Position is Empty
      const newCamera = findFirstEmptyPosition(this.layoutJson)
      if (newCamera) {
        start.position = newCamera
        this.newCamera = start
        this.$bvModal.show('add-pane-modal')
      } else {
        this.$notify({
          group: 'notifications',
          text: 'Cannot add camera, make space for a new one',
          type: 'error'
        })
      }
    },
    // Save Pane in Grid
    savePaneToGrid (pane) {
      this.layoutJson.push(pane)
      this.layoutChanged = true
      this.resetAutoSave()
    },
    // Remove Pane From Grid
    removePaneFromGrid (pane) {
      const foundPane = this.layoutJson.find(p => pane === p.id)
      const index = this.layoutJson.indexOf(foundPane)
      this.layoutJson.splice(index, 1)
      this.updateViewMethod()
    },
    // Delete View
    async deleteView () {
      this.loadingDelete = true
      try {
        await deleteView(this.selectedView.id)
        await this.getUserViews('delete')
        this.$notify({
          group: 'notifications',
          text: 'Successfully deleted view',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        if (!this.selectedView) {
          this.layoutJson = []
        }
        this.loadingDelete = false
      }
    },
    // Update View Method
    async updateViewMethod (view) {
      this.loadingSave = true
      let name = null
      let type = null

      if (view && view.name) {
        name = view.name
        type = view.type
      } else {
        name = this.selectedView.name
        type = this.selectedView.type
      }

      try {
        const layoutData = this.layoutJson.map(l => {
          return {
            camera: l.camera,
            id: l.id,
            type: l.type,
            position: l.position,
            lockAspectRatio: l.lockAspectRatio,
            fitOption: l.fitOption
          }
        }).filter(c => !this.getOutbound(c))
        await updateView(this.selectedView.id, { name, type, layout_data: JSON.stringify(layoutData) })
        try {
          await this.getUserViews('update')
          this.$notify({
            group: 'notifications',
            text: 'View Updated',
            type: 'success'
          })
        } catch (e) {
          console.log(e)
        } finally {
          this.layoutChanged = false
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingSave = false
      }
    },
    // Check for Aspect Ratio and Update View
    checkAspectRatioAndUpdate (camera) {
      this.layoutChanged = true
      this.checkAspectRatio(camera)
      this.resetAutoSave()
    },
    startAutoSave () {
      this.saveInterval = setInterval(() => {
        if (!this.loadingSave && this.layoutChanged) {
          this.updateViewMethod()
        }
      }, 10000)
    },
    resetAutoSave () {
      clearInterval(this.saveInterval)
      this.startAutoSave()
    },
    handleDragEnd () {
      this.layoutChanged = true
      this.resetAutoSave()
    },
    stopSaving () {
      this.layoutChanged = false
      clearInterval(this.saveInterval)
    }
  }
}
</script>

<style scoped lang="sass">

.dnd-grid-container
  margin-bottom: 30px
  border: 4.5px solid rgba(5, 5, 5, 0.79)
  border-radius: 4px
  &-dark
    border: 4.5px solid white

.no-cameras-message
  text-align: center
  margin: 27% auto

.cannot-edit-message
  text-align: center
  margin: 40vh auto
</style>
