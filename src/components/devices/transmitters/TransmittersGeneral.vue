<template>
  <!-- Transmitter General View -->
  <div
    v-if="device"
    class="mt-3 p-0Z"
  >
    <!-- Transmitter Information Card -->
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

            <!-- Transmitter Type -->
            <div class="row">
              <div class="col-sm col-xs-12">
                <span class="card-text small text-muted mb-1">Transmitter Type:</span>
              </div>
              <div class="col-sm col-xs-12">
                <span class="badge badge-soft-secondary">{{ device.transmitter_type.name }}</span>
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

            <!-- Transmitter ID -->
            <div class="row">
              <div class="col-sm col-xs-12">
                <span class="card-text small text-muted mb-1">Transmitter ID:</span>
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
                Restart Transmitter
              </b-dropdown-item>

              <!-- Disassociate Transmitter -->
              <b-dropdown-item
                variant="danger"
                :disabled="loadingRemove"
                @click="disassociateTransmitterMethod"
              >
                Deregister Transmitter
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- Device Update Form -->
    <b-form
      class="mb-4"
      @submit.prevent="updateTransmitterMethod"
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

          <!-- Update Transmitter Button -->
          <button
            :disabled="loadingUpdate || $v.device.$invalid"
            type="submit"
            class="btn btn-primary float-right"
          >
            <span v-if="!loadingUpdate">Update Transmitter</span>
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
import {
  disassociateTransmitterFromTeam,
  updateTransmitter
} from '../../../api/TransmittersEndpoints'

export default {
  name: 'TransmittersGeneral',
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
    // Update Transmitter
    async updateTransmitterMethod () {
      this.loadingUpdate = true
      const { location } = this.device
      try {
        await updateTransmitter(this.device.id, { site_id: this.device.site_id, location })
        this.$notify({
          group: 'notifications',
          text: 'Transmitter Updated Successfully',
          type: 'success'
        })
        this.$v.$reset()
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingUpdate = false
      }
    },
    // Disassociate an Transmitter
    async disassociateTransmitterMethod () {
      this.loadingRemove = true
      this.loadingUpdate = true
      try {
        await disassociateTransmitterFromTeam(this.device.id)
        this.$notify({
          group: 'notifications',
          text: 'Transmitter Disassociated Successfully',
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
