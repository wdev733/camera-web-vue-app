<template>
  <!-- Edit View Modal -->
  <b-modal
    id="edit-view-modal"
    title="Edit View"
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
        @click="updateViewMethod"
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
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'EditViewModal',
  data () {
    return {
      loadingSave: false,
      viewForm: {
        name: null,
        type: 'team'
      }
    }
  },
  computed: {
    ...mapGetters('ViewsModule', ['selectedView'])
  },
  validations: {
    viewForm: {
      name: {
        required
      }
    }
  },
  watch: {
    selectedView (newValue) {
      if (newValue) {
        this.viewForm.name = this.selectedView.name
        this.viewForm.type = this.selectedView.type
      }
    }
  },
  mounted () {
    if (this.selectedView) {
      this.viewForm.name = this.selectedView.name
      this.viewForm.type = this.selectedView.type
    }
  },
  methods: {
    // Get Type Selected Class
    getTypeClass (type) {
      if (this.viewForm.type === type) {
        return 'btn-danger'
      } else {
        return 'btn-white'
      }
    },
    // Update View
    async updateViewMethod () {
      this.loadingSave = true
      this.$emit('updateView', this.viewForm)
      this.$v.$reset()
      this.$bvModal.hide('edit-view-modal')
      this.loadingSave = false
    }
  }
}
</script>

<style scoped>

</style>
