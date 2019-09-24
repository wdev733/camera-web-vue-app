<template>
  <NarrowContent>
    <div class="devices-setup-view">
      <NavbarInner :data="navbarData" />
      <!-- Devices Setup Card -->
      <div class="card">
        <div class="card-body">
          <p>
            Thank you for purchasing an AgriCamera system! You are now only a few steps away from getting it
            working.
          </p>

          <p>
            Before beginning this process, please ensure that the system is plugged in, powered up and connected to
            the internet.
          </p>

          <p>
            If you have purchased multiple systems that will be connecting to different internet connections, please
            only register one at a time. You can come back to this wizard to register the second one.
          </p>
        </div>
      </div>

      <!-- Sites Dropdown -->
      <div
        v-if="userSites.length"
        class="inline my-3"
      >
        <b-dropdown
          :text="getCurrentSiteDropdown"
          size="md"
          variant="primary"
        >
          <b-dropdown-item-button
            v-for="site in getUserSites"
            :key="site.id"
            class="primary"
            @click="setCurrentSite(site)"
          >
            {{ site.name }}
          </b-dropdown-item-button>
          <b-dropdown-divider v-if="getUserSites.length" />
          <b-dropdown-item-button v-b-modal.create-site-modal>
            Create new site
          </b-dropdown-item-button>
        </b-dropdown>
      </div>

      <!-- Create new site button -->
      <button
        v-if="!userSites.length"
        v-b-modal.create-site-modal
        class="primary btn btn-primary"
      >
        Create new site
      </button>

      <!-- Devices Form -->
      <div class="my-4">
        <div class="row">
          <div class="col-12">
            <!-- Interface Units -->
            <div class="form-group">
              <p>Interface Unit</p>
              <div
                v-for="(unit, index) in $v.interfacesList.$each.$iter"
                :key="index"
                class="devices-input"
              >
                <!-- Interfaces List Input with Mask -->
                <TheMask
                  v-model="unit.licenseKey.$model"
                  class="form-control mb-3"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  :mask="['XXXX-XXXX-XXXX-XXXX']"
                  :class="getValidInput(unit, 'interfaces', index)"
                  :disabled="checkDisabled(unit, 'interfaces', index)"
                  :state="unit.licenseKey.$dirty ? !unit.licenseKey.$error : null"
                  @input="debounceInput({ unit: unit.licenseKey.$model, type: 'interfaces', index })"
                />
                <!-- Loading Validation State -->
                <div
                  v-if="getLoadingState('interfaces', index)"
                  class="spinner-border spinner-border-sm loading-state text-primary"
                />
              </div>
            </div>

            <hr class="mt-4 mb-5">

            <!-- Wireless Units -->
            <div class="form-group">
              <p>Wireless</p>
              <div
                v-for="(unit, index) in $v.wirelessList.$each.$iter"
                :key="index"
                class="devices-input"
              >
                <!-- Wireless Units List Input with Mask -->
                <TheMask
                  v-model="unit.licenseKey.$model"
                  class="form-control mb-3"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  :mask="['XXXX-XXXX-XXXX-XXXX']"
                  :class="getValidInput(unit, 'wireless', index)"
                  :disabled="checkDisabled(unit, 'wireless', index)"
                  :state="unit.licenseKey.$dirty ? !unit.licenseKey.$error : null"
                  @input="debounceInput({ unit: unit.licenseKey.$model, type: 'wireless', index })"
                />
                <!-- Loading Validation State -->
                <div
                  v-if="getLoadingState('wireless', index)"
                  class="spinner-border spinner-border-sm loading-state text-primary"
                />
              </div>

              <!-- Add More License Keys Button -->
              <button
                class="btn btn-sm btn-outline-secondary mt-3"
                @click="addUnit('wirelessList')"
              >
                <span class="fe fe-plus" />
              </button>
            </div>

            <hr class="mt-4 mb-5">

            <!-- Wireless Units -->
            <div class="form-group">
              <p>Cameras</p>
              <div
                v-for="(unit, index) in $v.camerasList.$each.$iter"
                :key="index"
                class="devices-input"
              >
                <!-- Cameras List Input with Mask -->
                <TheMask
                  v-model="unit.licenseKey.$model"
                  class="form-control mb-3"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  :mask="['XXXX-XXXX-XXXX-XXXX']"
                  :class="getValidInput(unit, 'cameras', index)"
                  :disabled="checkDisabled(unit, 'cameras', index)"
                  :state="unit.licenseKey.$dirty ? !unit.licenseKey.$error : null"
                  @input="debounceInput({ unit: unit.licenseKey.$model, type: 'cameras', index })"
                />
                <!-- Loading Validation State -->
                <div
                  v-if="getLoadingState('cameras', index)"
                  class="spinner-border spinner-border-sm loading-state text-primary"
                />
              </div>
              <!-- Add More License Keys Button -->
              <button
                class="btn btn-sm btn-outline-secondary mt-3"
                @click="addUnit('camerasList')"
              >
                <span class="fe fe-plus" />
              </button>
            </div>

            <hr class="mt-4 mb-5">

            <!-- Associate Devices Button -->
            <button
              class="btn btn-success float-right"
              :disabled="!validLicenseKeys.length || loadingContinue"
              @click="associateDevices"
            >
              <span
                v-if="loadingContinue"
                class="spinner-border-sm spinner-border text-white"
              />
              <span v-else>Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Sites Create Modal -->
    <SitesCreateModal />
  </NarrowContent>
</template>

<script>
import _ from 'lodash'
import { required, minLength } from 'vuelidate/lib/validators'
import { associateDevice, validateDevice } from '../../api/DevicesEndpoints'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'DevicesSetupView',
  components: {
    SitesCreateModal: () => import('@/components/sites/SitesCreateModal'),
    NarrowContent: () => import('@/components/hoc/NarrowContent'),
    NavbarInner: () => import('@/components/globals/NavbarInner')
  },
  data () {
    return {
      navbarData: {
        pretitle: 'Settings',
        title: 'Setup Wizard',
        path: 'SettingsView'
      },
      // Units Lists
      interfacesList: [{ licenseKey: null, valid: false }],
      wirelessList: [{ licenseKey: null, valid: false }],
      camerasList: [{ licenseKey: null, valid: false }],
      validLicenseKeys: [],
      // Loading State for All License Keys
      loading: {
        interfaces: [],
        wireless: [],
        cameras: []
      },
      loadingContinue: false
    }
  },
  computed: {
    ...mapGetters('SitesModule', ['userSites', 'currentSite']),
    // Get Dropdown Message
    getCurrentSiteDropdown () {
      return `Current Site: ${this.currentSite.name}` || 'Create New Site'
    },
    // Get User Sites Without the Current Site
    getUserSites () {
      return this.userSites.filter(site => site.id !== this.currentSite.id)
    }
  },
  validations: {
    interfacesList: {
      $each: {
        licenseKey: {
          required,
          minLength: minLength(16)
        }
      }
    },
    wirelessList: {
      $each: {
        licenseKey: {
          required,
          minLength: minLength(16)
        }
      }
    },
    camerasList: {
      $each: {
        licenseKey: {
          required,
          minLength: minLength(16)
        }
      }
    }
  },
  methods: {
    ...mapActions('SitesModule', ['setCurrentSite']),
    // Check for Disabled Inputs
    checkDisabled (unit, type, index) {
      return this.getValidInput(unit, type, index) === 'is-valid' || !this.currentSite.name
    },
    // Get Loading State from Loading Array
    getLoadingState (type, index) {
      return this.loading[type][index]
    },
    // Add an Extra Unit If the Previous Was at Least Tested
    addUnit (list) {
      const unitList = this[list]
      const listLength = this[list].length
      const previousKey = unitList[listLength - 1].licenseKey
      if (previousKey) {
        const previousKeyIsValid = previousKey.slice().length === 16
        if (listLength >= 1 && previousKey && previousKeyIsValid) {
          unitList.push({ licenseKey: null })
        }
      }
    },
    // Debounce Input and Validate Device
    debounceInput: _.debounce(function (e) {
      const { unit, type, index } = e
      // Trigger when the license_key is at least 16 chars long
      if (unit.slice().length === 16) {
        // Load and put the valid status to false
        this.loading[type].splice(index, 1, true)
        this[`${type}List`][index].valid = false

        // Validate the Device
        validateDevice(unit)
          .then(({ device }) => {
            // Get Valid License Key
            const licenseKey = device.license_key

            // Add it to the list and stop loading
            this[`${type}List`][index].valid = true
            this.loading[type].splice(index, 1, false)
            this.validLicenseKeys.push(licenseKey)

            this.$notify({
              group: 'foo',
              type: 'success',
              text: 'License key valid. Press continue to associate the device to your site.'
            })
          })
          .catch(e => {
            console.log(e)
            this.loading[type].splice(index, 1, false)
          })
      }
    }, 300),
    // Class Validation
    getValidInput (unit, type, index) {
      if (unit.licenseKey.$dirty && !this.loading[type][index]) {
        if (!unit.licenseKey.$error && unit.$model.valid) {
          return 'is-valid'
        } else {
          return 'is-invalid'
        }
      }
      return null
    },
    // Associate Valid Devices and Go to DevicesView
    async associateDevices () {
      this.loadingContinue = true
      // Get the Unique License Keys in the List
      const licenseKeys = _.uniq(this.validLicenseKeys)

      // Loop Through the Valid License Keys and Associate them
      const associateDevicesMethod = async () => {
        for (let i = 0; i < licenseKeys.length; i++) {
          await associateDevice(licenseKeys[i], this.currentSite.id)
        }
      }
      await associateDevicesMethod()
      this.$router.push({ name: 'DevicesView' })
    }
  }
}
</script>

<style scoped lang="sass">
.devices-input
  .loading-state
    position: absolute
    right: 23px
    margin-top: -40px
</style>
