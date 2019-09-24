<template>
  <!-- Camera General View -->
  <div
    v-if="device"
    class="mt-3 p-0"
  >
    <!-- Camera Information Card -->
    <div class="card">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-auto">
            <span class="avatar avatar-xxl avatar-4by3 d-none d-sm-inline-block">
              <img
                class="avatar-img rounded"
                src="https://www.ruralnewsgroup.co.nz/media/k2/items/cache/f27c46af75c9b79e337ce9283b2cff99_XL.jpg"
              >
            </span>
          </div>
          <div class="col">
            <!-- License Key -->
            <div class="row">
              <div class="col-sm col-12">
                <span class="card-text small text-muted mb-1">License Key:</span>
              </div>
              <div class="col-sm col-12">
                <span class="badge badge-soft-secondary">{{ device.license_key }}</span>
              </div>
            </div>

            <!-- IP Address -->
            <div class="row">
              <div class="col-sm col-12">
                <span class="card-text small text-muted mb-1">IP Address:</span>
              </div>
              <div class="col-sm col-12">
                <span class="badge badge-soft-secondary">{{ device.local_ip }}</span>
              </div>
            </div>

            <!-- Camera Type -->
            <div class="row">
              <div class="col-sm col-12">
                <span class="card-text small text-muted mb-1">Camera Type:</span>
              </div>
              <div class="col-sm col-12">
                <span class="badge badge-soft-secondary">{{ device.camera_type.name }}</span>
              </div>
            </div>

            <!-- MAC Address -->
            <div class="row">
              <div class="col-sm col-12">
                <span class="card-text small text-muted mb-1">MAC Address:</span>
              </div>
              <div class="col-sm col-12">
                <span class="badge badge-soft-secondary">{{ device.mac }}</span>
              </div>
            </div>

            <!-- Camera ID -->
            <div class="row">
              <div class="col-sm col-12">
                <span class="card-text small text-muted mb-1">Camera ID:</span>
              </div>
              <div class="col-sm col-12">
                <span class="badge badge-soft-secondary">{{ device.id }}</span>
              </div>
            </div>

            <!-- Status -->
            <div class="row my-3">
              <div class="col-sm col-12">
                <span class="card-text small text-muted mb-1">Status:</span>
              </div>
              <div
                v-if="device.status"
                class="col-sm col-12"
              >
                <span class="badge badge-soft-success">ONLINE</span>
              </div>
              <div
                v-else
                class="col-sm col-12"
              >
                <span class="badge badge-soft-danger">OFFLINE</span>
              </div>
            </div>
          </div>

          <!-- Options Dropdown -->
          <div class="col-sm-auto col-12">
            <b-dropdown
              size="sm"
              variant="danger"
              text="Options"
            >
              <b-dropdown-item :disabled="loadingRemove">
                Restart Camera
              </b-dropdown-item>

              <!-- Disassociate Device -->
              <b-dropdown-item
                variant="danger"
                :disabled="loadingRemove"
                @click="disassociateDeviceMethod"
              >
                Deregister Camera
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- Device Update Form -->
    <b-form
      class="mb-4"
      @submit.prevent="updateCameraMethod"
    >
      <div class="row">
        <div class="col-12">
          <!-- Camera Name -->
          <b-form-group label="Camera Name">
            <b-form-input
              v-model="$v.device.name.$model"
              type="text"
              class="form-control"
              placeholder="Add a name"
              :state="$v.device.name.$dirty ? !$v.device.name.$error : null"
            />
            <b-form-invalid-feedback>
              Name is required.
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- Camera Description -->
          <b-form-group label="Description">
            <b-form-input
              v-model="device.description"
              type="text"
              class="form-control"
              placeholder="Add a description"
            />
          </b-form-group>

          <!-- Site Select -->
          <b-form-group>
            <small class="form-text text-muted">
              Please only move a camera to a different site if you have physically moved it and it is
              connected to a different internet connection. Use
              <router-link
                tag="a"
                :to="{ name: 'LiveSetupView' }"
              >
                views
              </router-link>
              to group cameras together.
            </small>

            <b-form-select
              v-model="device.site_id"
              :options="getUserSites"
            />
          </b-form-group>

          <!-- Location -->
          <b-form-group label="Location">
            <!-- Google Map Location -->
            <GoogleSiteMap
              :current-marker="getDeviceLocation"
              @updated="updateLocation"
            />
          </b-form-group>

          <!-- Update Device Button -->
          <button
            :disabled="loadingUpdate || $v.device.$invalid"
            type="submit"
            class="btn btn-primary float-right"
          >
            <span v-if="!loadingUpdate">Update Camera</span>
            <span
              v-else
              class="spinner-border-sm spinner-border text-white"
            />
          </button>
        </div>
      </div>
    </b-form>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import { disassociateCamera, updateCamera } from '../../../api/CamerasEndpoints'
import GoogleSiteMap from '../../maps/GoogleSiteMap'

export default {
  name: 'CamerasGeneral',
  components: { GoogleSiteMap },
  props: {
    device: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loadingUpdate: false,
      loadingRemove: false
    }
  },
  computed: {
    ...mapGetters('SitesModule', ['userSites']),
    // Map Sites for Selection
    getUserSites () {
      return this.userSites.map(s => ({ value: s.id, text: s.name }))
    },
    getDeviceLocation () {
      return this.device.location || this.userSites.find(s => this.device.site_id === s.id).location
    }
  },
  validations: {
    device: {
      name: {
        required
      },
      site_id: {
        required
      }
    }
  },
  methods: {
    updateLocation (e) {
      this.device.location = e
    },
    // Update Device
    async updateCameraMethod () {
      this.loadingUpdate = true
      const { id, name, description, location } = this.device
      try {
        await updateCamera(id, { name, description, site_id: this.device.site_id, location })
        this.$notify({
          group: 'notifications',
          text: 'Camera Updated Successfully',
          type: 'success'
        })
        this.$v.$reset()
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingUpdate = false
      }
    },
    // Disassociate a device
    async disassociateDeviceMethod () {
      this.loadingRemove = true
      this.loadingUpdate = true
      try {
        await disassociateCamera(this.device.id)
        this.$notify({
          group: 'notifications',
          text: 'Camera Disassociated Successfully',
          type: 'success'
        })
        this.$router.push({ name: 'DevicesView' })
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingRemove = false
        this.loadingUpdate = false
      }
    }
  }
}
</script>

<style scoped lang="sass">

</style>
