<template>
  <!-- Edit Site Modal -->
  <b-modal
    id="edit-site-modal"
    title="Edit a Site"
  >
    <!-- Edit Site Form -->
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
        :disabled="$v.siteForm.$invalid || loading || !siteForm.location"
        @click="updateSiteMethod"
      >
        <span v-if="!loading">Save</span>
        <span
          v-else
          class="spinner-border spinner-grow-sm text-white"
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
import { mapGetters, mapActions } from 'vuex'
import { updateSite } from '../../api/SitesEndpoints'

export default {
  name: 'SitesEditModal',
  components: {
    GoogleSiteMap: () => import('@/components/maps/GoogleSiteMap')
  },
  data () {
    return {
      loading: false,
      siteForm: {
        name: null,
        location: null
      }
    }
  },
  computed: {
    ...mapGetters('SitesModule', ['selectedSite'])
  },
  watch: {
    // Check if a new site was selected for edit
    selectedSite (newValue) {
      this.siteForm = newValue
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
    // Update a Site and Update Sites List
    async updateSiteMethod () {
      this.loading = true
      const siteId = this.selectedSite.id
      const siteData = this.siteForm
      try {
        await updateSite(siteId, siteData)
        await this.getUserSites()
        this.$notify({
          group: 'notifications',
          type: 'success',
          text: 'Site Updated'
        })
      } catch (e) {
        console.log(e)
      } finally {
        await this.$bvModal.hide('edit-site-modal')
        this.$v.$reset()
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
