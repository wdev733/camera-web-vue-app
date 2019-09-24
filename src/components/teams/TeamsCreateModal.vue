<template>
  <!-- Create Team Modal -->
  <b-modal
    id="create-team-modal"
    title="Create a Team"
  >
    <!-- Create Team Form -->
    <b-form>
      <b-form-input
        v-model="$v.teamForm.name.$model"
        :state="$v.teamForm.name.$dirty ? !$v.teamForm.name.$error : null"
        placeholder="Name"
      />
    </b-form>
    <!-- Modal Footer -->
    <template slot="modal-footer">
      <b-button
        variant="primary"
        :disabled="$v.teamForm.$invalid || loadingSave"
        @click="createTeamMethod"
      >
        <span v-if="!loadingSave">Save</span>
        <span
          v-else
          class="spinner-border spinner-border-sm"
        />
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { createTeam } from '../../api/TeamsEndpoints'
import { mapActions } from 'vuex'

export default {
  name: 'TeamsCreateModal',
  data () {
    return {
      loadingSave: false,
      teamForm: {
        name: null
      }
    }
  },
  validations: {
    teamForm: {
      name: {
        required
      }
    }
  },
  methods: {
    ...mapActions('TeamsModule', ['getUserTeams']),
    // Create a Team
    async createTeamMethod () {
      this.loadingSave = true
      const { name } = this.teamForm
      try {
        await createTeam(name)
        await this.getUserTeams()
        this.$bvModal.hide('create-team-modal')
        this.$notify({
          group: 'notifications',
          type: 'success',
          text: `Team ${name} Created`
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingSave = false
      }
    }
  }
}
</script>

<style scoped>

</style>
