<template>
  <!-- Forgot Password View -->
  <div class="full-height d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-5 col-xl-4 my-5">
          <h1 class="display-4 text-center mb-3">
            Reset Password
          </h1>
          <p class="text-muted text-center mb-5">
            Enter your email to get a password reset link.
          </p>

          <b-form @submit.prevent="recoverPassword">
            <!-- Email Address -->
            <b-form-group label="Email Address">
              <b-form-input
                v-model="$v.email.$model"
                :state="$v.email.$dirty ? !$v.email.$error : null"
              />

              <b-form-invalid-feedback>
                Email is required and it needs to be valid.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- Send Reset Link Button -->
            <button
              class="btn btn-lg btn-block btn-primary mb-3"
              :disabled="$v.email.$invalid || loading"
              type="submit"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm"
              />

              <span v-if="!loading">Send Password Reset Link</span>
            </button>
          </b-form>

          <!-- Sign In Page Redirect -->
          <div class="text-center">
            <small class="text-muted text-center">
              Remember your password?
              <router-link
                :to="{ name: 'LoginView' }"
                tag="a"
              >
                Sign In.
              </router-link>
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { forgotPassword } from '../../api/UsersEndpoints'

export default {
  name: 'ForgotPasswordView',
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
    // Send Recovery Email
    async recoverPassword () {
      this.loading = true
      const email = this.email
      try {
        const forgotPass = await forgotPassword(email)
        this.$notify({
          group: 'notifications',
          text: forgotPass.message,
          type: 'success'
        })
        await this.$router.replace({ name: 'LoginView' })
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="sass">

</style>
