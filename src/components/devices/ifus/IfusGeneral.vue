<template>
  <!-- Ifus General View -->
  <div class="mt-3 p-0">
    <!-- Ifus Information Card -->
    <div class="card">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col">
            <!-- License Key -->
            <div class="row">
              <div class="col-sm col-xs-12">
                <span class="card-text small text-muted mb-1">License Key:</span>
              </div>
              <div class="col-sm col-xs-12">
                <span class="badge badge-soft-secondary">{{ device.license_key }}</span>
              </div>
            </div>

            <!-- IP Address -->
            <div class="row">
              <div class="col-sm col-xs-12">
                <span class="card-text small text-muted mb-1">IP Address:</span>
              </div>
              <div class="col-sm col-xs-12">
                <span class="badge badge-soft-secondary">{{ device.local_ip }}</span>
              </div>
            </div>

            <!-- Ifu Type -->
            <div class="row">
              <div class="col-sm col-xs-12">
                <span class="card-text small text-muted mb-1">Interface Unit Type:</span>
              </div>
              <div class="col-sm col-xs-12">
                <span class="badge badge-soft-secondary">{{ device.ifu_type.name }}</span>
              </div>
            </div>

            <!-- MAC Address -->
            <div class="row">
              <div class="col-sm col-xs-12">
                <span class="card-text small text-muted mb-1">MAC Address:</span>
              </div>
              <div class="col-sm col-xs-12">
                <span class="badge badge-soft-secondary">{{ device.mac }}</span>
              </div>
            </div>

            <!-- Ifu ID -->
            <div class="row">
              <div class="col-sm col-xs-12">
                <span class="card-text small text-muted mb-1">Interface Unit ID:</span>
              </div>
              <div class="col-sm col-xs-12">
                <span class="badge badge-soft-secondary">{{ device.id }}</span>
              </div>
            </div>

            <!-- Status -->
            <div class="row">
              <div class="col-sm col-xs-12">
                <span class="card-text small text-muted mb-1">Status:</span>
              </div>
              <div
                v-if="device.status"
                class="col-sm col-xs-12"
              >
                <span class="badge badge-soft-success">ONLINE</span>
              </div>
              <div
                v-else
                class="col-sm col-xs-12"
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
                Restart Interface Unit
              </b-dropdown-item>

              <!-- Disassociate Device -->
              <b-dropdown-item
                variant="danger"
                :disabled="loadingRemove"
                @click="disassociateIfusMethod"
              >
                Deregister Interface Unit
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- Ifu Update Form -->
    <b-form
      class="mb-4"
      @submit.prevent="updateIfusMethod"
    >
      <div class="row">
        <div class="col-12">
          <!-- Site Select -->
          <b-form-group label="Site">
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

          <!-- Update Ifu Button -->
          <button
            :disabled="loadingUpdate || $v.device.$invalid"
            type="submit"
            class="btn btn-primary float-right"
          >
            <span v-if="!loadingUpdate">Update Interface Unit</span>
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
import GoogleSiteMap from '../../maps/GoogleSiteMap'
import { updateIfu, disassociateIfuFromTeam } from '../../../api/IfusEndpoints'

export default {
  name: 'IfusGeneral',
  components: {
    GoogleSiteMap
  },
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
      site_id: {
        required
      }
    }
  },
  methods: {
    updateLocation (e) {
      this.device.location = e
    },
    // Update Interface Unit
    async updateIfusMethod () {
      this.loadingUpdate = true
      try {
        const { location } = this.device
        await updateIfu(this.device.id, { site_id: this.device.site_id, location })
        this.$notify({
          group: 'notifications',
          text: 'Interface Unit Updated Successfully',
          type: 'success'
        })
        this.$v.$reset()
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingUpdate = false
      }
    },
    // Disassociate an Interface Unit
    async disassociateIfusMethod () {
      this.loadingRemove = true
      this.loadingUpdate = true
      try {
        await disassociateIfuFromTeam(this.device.id)
        this.$notify({
          group: 'notifications',
          text: 'Interface Unit Disassociated Successfully',
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
