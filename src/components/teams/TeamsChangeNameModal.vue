<template>
  <!-- Update Team Modal -->
  <b-modal
    id="update-team-modal"
    title="Change Team's Name"
  >
    <!-- Update Team Form -->
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
        :disabled="$v.teamForm.$invalid || loading"
        @click="updateTeamMethod"
      >
        <span v-if="!loading">Save</span>
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
import { mapGetters, mapActions } from 'vuex'
import { updateTeam } from '../../api/TeamsEndpoints'

export default {
  name: 'TeamsChangeNameModal',
  data () {
    return {
      teamForm: {
        name: null
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters('TeamsModule', ['selectedTeam'])
  },
  watch: {
    // Check if a new team was selected to edit
    selectedTeam (newValue) {
      this.teamForm = newValue
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
    // Update Selected Team and Reload Teams
    async updateTeamMethod () {
      this.loading = true
      const name = this.teamForm.name
      try {
        await updateTeam(name)
        await this.getUserTeams()
        this.$emit('updated')
        this.$notify({
          group: 'notifications',
          text: 'Name changed successfully',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
        this.$bvModal.hide('update-team-modal')
      }
    }
  }
}
</script>

<style scoped>

</style>
