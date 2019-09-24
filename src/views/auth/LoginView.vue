<template>
  <!-- Login View -->
  <div class="full-height d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-5 col-xl-4 my-5">
          <h1 class="display-4 text-center mb-3">
            Login
          </h1>

          <p class="text-muted text-center mb-5">
            Access AgriCamera for free, for now :D
          </p>

          <!-- Login Form -->
          <b-form @submit.prevent="loginMethod">
            <!-- Email Address -->
            <b-form-group label="Email Address">
              <b-form-input
                v-model="$v.form.email.$model"
                :state="$v.form.email.$dirty ? !$v.form.email.$error : null"
                @input="form.password = null"
              />

              <b-form-invalid-feedback>
                Email is required and it needs to be valid.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- Password -->
            <b-form-group label="Password">
              <div class="row">
                <div class="col-12">
                  <b-form-input
                    v-model="$v.form.password.$model"
                    type="password"
                    :state="$v.form.password.$dirty ? !$v.form.password.$error : null"
                  />

                  <b-form-invalid-feedback>
                    Password is required.
                  </b-form-invalid-feedback>
                  <router-link
                    :to="{ name: 'ForgotPasswordView' }"
                    class="form-text small text-muted mt-3"
                    tag="a"
                  >
                    Forgotten Your Password?
                  </router-link>
                </div>
              </div>
            </b-form-group>

            <!-- Remember Me Button -->
            <div class="form-group row">
              <div class="mx-auto">
                <div class="form-check">
                  <input
                    id="remember"
                    v-model="form.rememberMe"
                    class="form-check-input"
                    type="checkbox"
                    name="remember"
                  >

                  <label
                    class="form-check-label"
                    for="remember"
                  >
                    Remember Me
                  </label>
                </div>
              </div>
            </div>

            <!-- Login Button -->
            <button
              class="btn btn-lg btn-block btn-primary mb-3"
              :disabled="$v.form.$invalid || loading"
              type="submit"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm"
              />

              <span v-if="!loading">Login</span>
            </button>

            <div class="text-center">
              <small class="text-muted text-center">
                Don't have an account yet?
                <router-link
                  :to="{ name: 'RegisterView' }"
                  tag="a"
                >
                  Sign up.
                </router-link>
              </small>
            </div>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'LoginView',
  data () {
    return {
      loading: false,
      form: {
        email: null,
        password: null,
        rememberMe: false
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    }
  },
  methods: {
    ...mapActions('UsersModule', ['loginUser']),
    // Login User
    async loginMethod () {
      this.loading = true
      const loginInfo = { ...this.form }
      await this.loginUser(loginInfo)
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
