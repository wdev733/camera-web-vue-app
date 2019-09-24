<template>
  <!-- Create Site Modal -->
  <b-modal
    id="create-site-modal"
    title="Create a Site"
  >
    <!-- Create Site Form -->
    <b-form>
      <b-form-input
        v-model="$v.siteForm.name.$model"
        :state="$v.siteForm.name.$dirty ? !$v.siteForm.name.$error : null"
        placeholder="Name"
      />
    </b-form>

    <!-- Modal Footer -->
    <template slot="modal-footer">
      <b-button
        variant="primary"
        :disabled="$v.siteForm.$invalid || loadingSave || !siteForm.location"
        @click="createSiteMethod"
      >
        <span v-if="!loadingSave">Save</span>
        <div
          v-else
          class="spinner-border spinner-border-sm text-white"
        />
      </b-button>
    </template>

    <!-- Google Map Location -->
    <GoogleSiteMap
      class="mt-4"
      :current-marker="siteForm.location"
      @updated="updateLocation"
    />
  </b-modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { createSite } from '../../api/SitesEndpoints'
import { mapActions } from 'vuex'

export default {
  name: 'SitesCreateModal',
  components: {
    GoogleSiteMap: () => import('@/components/maps/GoogleSiteMap')
  },
  data () {
    return {
      loadingSave: false,
      siteForm: {
        name: null,
        location: null
      }
    }
  },
  validations: {
    siteForm: {
      name: {
        required
      }
    }
  },
  methods: {
    ...mapActions('SitesModule', ['getUserSites']),
    // Update Site Location From Map
    updateLocation (location) {
      this.siteForm.location = location
    },
    // Create a Site and Update Sites List
    async createSiteMethod () {
      this.loadingSave = true
      const site = this.siteForm
      try {
        await createSite(site)
        await this.getUserSites()
        this.$bvModal.hide('create-site-modal')
        this.$notify({
          group: 'notifications',
          type: 'success',
          text: 'Site Created'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingSave = false
        this.$v.$reset()
        this.siteForm = {
          name: null,
          location: null
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
