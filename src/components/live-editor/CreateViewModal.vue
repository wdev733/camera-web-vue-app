<template>
  <!-- Create View Modal -->
  <b-modal
    id="create-view-modal"
    title="Create New View"
  >
    <!-- View Name -->
    <b-form>
      <b-form-group label="View Name">
        <b-form-input
          v-model="$v.viewForm.name.$model"
          :state="$v.viewForm.name.$dirty ? !$v.viewForm.name.$error : null"
        />

        <b-form-invalid-feedback>
          Name is required.
        </b-form-invalid-feedback>
      </b-form-group>
    </b-form>

    <!-- View Type -->
    <div class="title mb-3">
      Type
    </div>
    <div class="btn-group">
      <button
        class="btn btn-xs"
        :class="getTypeClass('team')"
        @click="viewForm.type = 'team'"
      >
        Team
      </button>
      <button
        :class="getTypeClass('user')"
        class="btn btn-xs"
        @click="viewForm.type = 'user'"
      >
        Personal
      </button>
    </div>

    <!-- Modal Footer -->
    <template slot="modal-footer">
      <b-button
        variant="primary"
        :disabled="$v.viewForm.$invalid || loadingSave"
        @click="createViewMethod"
      >
        <span v-if="!loadingSave">Save</span>
        <div
          v-else
          class="spinner-border spinner-border-sm text-white"
        />
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { mapActions } from 'vuex'
import { createView } from '../../api/ViewsEndpoints'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'CreateViewModal',
  data () {
    return {
      loadingSave: false,
      viewForm: {
        name: null,
        type: 'team'
      }
    }
  },
  validations: {
    viewForm: {
      name: {
        required
      }
    }
  },
  methods: {
    ...mapActions('ViewsModule', ['getUserViews', 'setSelectedView']),
    // Get Type Selected Class
    getTypeClass (type) {
      if (this.viewForm.type === type) {
        return 'btn-danger'
      } else {
        return 'btn-white'
      }
    },
    // Create View
    async createViewMethod () {
      this.loadingSave = true
      const { name, type } = this.viewForm
      const view = {
        name,
        type,
        layout_data: JSON.stringify([])
      }
      try {
        await createView(view)
        await this.getUserViews('new')
        this.$notify({
          group: 'notifications',
          text: 'View successfully created',
          type: 'success'
        })
        this.$bvModal.hide('create-view-modal')
      } catch (e) {
        console.log(e)
      } finally {
        this.viewForm = { name: '', type: 'team' }
        this.$v.$reset()
        this.loadingSave = false
      }
    }
  }
}
</script>

<style scoped>

</style>
