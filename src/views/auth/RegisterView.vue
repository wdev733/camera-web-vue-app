<template>
  <div class="full-height d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-5 col-xl-4 my-5">
          <h1 class="display-4 text-center mb-3">
            Register
          </h1>

          <!-- Invite Team Message -->
          <div
            v-if="showTeamInviteMessage"
            class="text-center mb-4"
          >
            You have been invited to join a team.
            <br>
            Please first create an account.
          </div>

          <b-form @submit.prevent="registerMethod">
            <!-- First Name -->
            <b-form-group label="First Name">
              <b-form-input
                v-model="$v.registerForm.first_name.$model"
                :state="$v.registerForm.first_name.$dirty ? !$v.registerForm.first_name.$error : null"
              />

              <b-form-invalid-feedback>
                First name is required.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- Last Name -->
            <b-form-group label="Last Name">
              <b-form-input
                v-model="$v.registerForm.last_name.$model"
                :state="$v.registerForm.last_name.$dirty ? !$v.registerForm.last_name.$error : null"
              />

              <b-form-invalid-feedback>
                Last name is required.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- Email Address -->
            <b-form-group label="Email Address">
              <b-form-input
                v-model="$v.registerForm.email.$model"
                :state="$v.registerForm.email.$dirty ? !$v.registerForm.email.$error : null"
              />

              <b-form-invalid-feedback>
                Email is required and it needs to be valid.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- Password -->
            <b-form-group label="Password">
              <b-form-input
                v-model="$v.registerForm.password.$model"
                type="password"
                :state="$v.registerForm.password.$dirty ? !$v.registerForm.password.$error : null"
              />

              <b-form-invalid-feedback>
                Password is required and it should be at least 8 characters long.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- Password Confirmation -->
            <b-form-group label="Password Confirm">
              <b-form-input
                v-model="$v.registerForm.password_confirmation.$model"
                type="password"
                :state="$v.registerForm.password_confirmation.$dirty ? !$v.registerForm.password_confirmation.$error : null"
              />

              <b-form-invalid-feedback>
                Confirm password is required and it should match the password.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- Register Button -->
            <button
              type="submit"
              class="btn btn-lg btn-block btn-primary mb-3"
              :disabled="$v.registerForm.$invalid || loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm"
              />
              <span v-if="!loading">Register</span>
            </button>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { registerUser } from '../../api/UsersEndpoints'
import { required, email, sameAs, minLength } from 'vuelidate/lib/validators'
import { acceptTeamInvite } from '../../api/TeamsEndpoints'

export default {
  name: 'RegisterView',
  data () {
    return {
      loading: false,
      showTeamInviteMessage: false,
      registerForm: {
        first_name: null,
        last_name: null,
        email: null,
        password: null,
        password_confirmation: null
      }
    }
  },
  validations: {
    registerForm: {
      first_name: {
        required
      },
      last_name: {
        required
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8)
      },
      password_confirmation: {
        required,
        sameAsPassword: sameAs('password')
      }
    }
  },
  mounted () {
    if (this.$route.query['team-accept-token']) {
      this.registerForm.email = this.$route.query.email
      this.showTeamInviteMessage = true
    }
  },
  methods: {
    // Register User
    async registerMethod () {
      this.loading = true
      try {
        await registerUser(this.registerForm)
        if (this.$route.query['team-accept-token']) {
          await acceptTeamInvite(this.$route.query['team-accept-token'])
        }
        await this.$router.replace({ name: 'RegisterSuccessView' })
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
