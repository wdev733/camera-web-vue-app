<template>
  <!-- Teams Invite User -->
  <div class="card">
    <div class="card-body">
      <div class="header">
        <div class="header-body pt-0">
          <div class="row align-items-center">
            <div class="col">
              <h2 class="header-title">
                Invite To Team
              </h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Invite User Form -->
      <b-form
        class="form-horizontal my-4"
        @submit.prevent="inviteUserToTeamMethod"
      >
        <b-form-group label="Email Address">
          <b-form-input
            v-model="$v.email.$model"
            :state="$v.email.$dirty ? !$v.email.$error : null"
          />
          <b-form-invalid-feedback>
            Email is required and it needs to be valid.
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Invite Button -->
        <button
          type="submit"
          class="btn btn-primary btn-block"
          :disabled="$v.email.$invalid || loading"
        >
          <div
            v-if="loading"
            class="spinner-border spinner-border-sm"
          />

          <span v-if="!loading">
            <i class="fa fa-btn fa-envelope-o" />
            Invite To Team
          </span>
        </button>
      </b-form>
    </div>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { inviteUserToTeam } from '../../api/TeamsEndpoints'

export default {
  name: 'TeamsInvitations',
  data () {
    return {
      loading: false,
      email: null
    }
  },
  validations: {
    email: {
      required,
      email
    }
  },
  methods: {
    // Invite User to Team
    async inviteUserToTeamMethod () {
      const email = this.email
      this.loading = true
      try {
        await inviteUserToTeam(email)
        this.$notify({
          group: 'notifications',
          text: `${email} invitation sent successfully!`,
          type: 'success'
        })
        this.$emit('updated')
        this.email = null
        this.$nextTick(() => { this.$v.$reset() })
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
