<template>
  <!-- Teams No Team View -->
  <div class="teams-no-team-view d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-5 col-xl-4 my-5">
          <!-- Welcome Message -->
          <h1 class="display-4 text-center mb-3">
            Welcome!
          </h1>

          <p class="text-muted text-center mb-5">
            Thank you for creating your AgriCamera account.
            <br>
            It appears you are not yet a member of a team.
            Please create a team to start using Agricamera!
            <br>
            Your team name will normally be your business or farm name.
          </p>

          <!-- Team Creation -->
          <b-form @submit.prevent="createTeamMethod">
            <!-- Team Name -->
            <b-form-group label="Team Name">
              <b-form-input
                v-model="$v.name.$model"
                :state="$v.name.$dirty ? !$v.name.$error : null"
              />

              <b-form-invalid-feedback>
                Team name is required.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- Create Team Button -->
            <button
              type="submit"
              class="btn btn-block btn-primary"
              :disabled="$v.name.$invalid || loading"
            >
              <span v-if="!loading">Create Team</span>
              <span
                v-else
                class="spinner-border spinner-grow-sm text-white"
              />
            </button>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { createTeam } from '../../api/TeamsEndpoints'
import { mapActions } from 'vuex'

export default {
  name: 'TeamsNoTeamView',
  data () {
    return {
      loading: false,
      name: null
    }
  },
  validations: {
    name: {
      required
    }
  },
  methods: {
    ...mapActions(['reloadData']),
    // Create a team for the user and redirect to settings
    async createTeamMethod () {
      this.loading = true
      await createTeam(this.name)
      await this.reloadData()
      await this.$router.replace({ name: 'SettingsView' })
      this.loading = false
    }
  }
}
</script>

<style scoped lang="sass">
.teams-no-team-view
  height: 100vh
</style>
