<template>
  <div class="profile-view">
    <div class="row justify-content-center">
      <LoadingState v-if="loading" />
      <NarrowContent v-if="!loading">
        <NavbarInner :data="navbarData" />
        <b-form @submit.prevent="updateUserMethod">
          <div class="row">
            <div class="col-12">
              <!-- First Name -->
              <b-form-group label="First Name">
                <b-form-input
                  v-model="$v.userForm.first_name.$model"
                  :state="$v.userForm.first_name.$dirty ? !$v.userForm.first_name.$error : null"
                />

                <b-form-invalid-feedback>
                  First name is required.
                </b-form-invalid-feedback>
              </b-form-group>

              <!-- Last Name -->
              <b-form-group label="Last Name">
                <b-form-input
                  v-model="$v.userForm.last_name.$model"
                  :state="$v.userForm.last_name.$dirty ? !$v.userForm.last_name.$error : null"
                />

                <b-form-invalid-feedback>
                  Last name is required.
                </b-form-invalid-feedback>
              </b-form-group>

              <!-- Email Address -->
              <b-form-group label="Email Address">
                <b-form-input
                  v-model="$v.userForm.email.$model"
                  :state="$v.userForm.email.$dirty ? !$v.userForm.email.$error : null"
                />
                <b-form-invalid-feedback>
                  Email is required and it needs to be valid.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
            <div class="col-12">
              <div class="form-group">
                <label class="mb-1">
                  Use Dark Theme
                </label>

                <small class="form-text text-muted">
                  Show the dark theme instead
                </small>

                <div class="row">
                  <div class="col-auto">
                    <div class="custom-control custom-switch">
                      <input
                        id="theme"
                        v-model="userForm.dark_theme"
                        type="checkbox"
                        class="custom-control-input"
                        name="theme"
                      >
                      <label
                        class="custom-control-label"
                        for="theme"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr class="mt-3 mb-5">
          <button
            class="btn btn-primary mb-3 float-right"
            :disabled="$v.userForm.$invalid || loadingSave"
            type="submit"
          >
            <span
              v-if="loadingSave"
              class="spinner-border spinner-border-sm text-white"
            />

            <span v-if="!loadingSave">Update Profile</span>
          </button>
          <router-link
            tag="button"
            :to="{ name: 'ChangePasswordView' }"
            class="btn btn-success mb-3 float-right mr-2"
            type="submit"
          >
            Change Password
          </router-link>
        </b-form>
      </NarrowContent>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { updateUser } from '../../api/UsersEndpoints'
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'ProfileView',
  components: {
    NarrowContent: () => import('@/components/hoc/NarrowContent'),
    LoadingState: () => import('@/components/globals/LoadingState'),
    NavbarInner: () => import('@/components/globals/NavbarInner')
  },
  data () {
    return {
      userForm: {
        first_name: null,
        last_name: null,
        email: null
      },
      loading: false,
      loadingSave: false,
      navbarData: {
        pretitle: 'Settings',
        title: 'User Profile'
      }
    }
  },
  computed: {
    ...mapGetters('UsersModule', ['getTheme', 'user'])
  },
  validations: {
    userForm: {
      first_name: {
        required
      },
      last_name: {
        required
      },
      email: {
        required,
        email
      }
    }
  },
  async mounted () {
    this.loading = true
    await this.getUser()
    this.userForm = this.user
    this.loading = false
  },
  methods: {
    ...mapActions('UsersModule', ['getUser']),
    // Update User
    async updateUserMethod () {
      this.loadingSave = true
      const userForm = {
        first_name: this.userForm.first_name,
        last_name: this.userForm.last_name,
        email: this.userForm.email,
        dark_theme: this.userForm.dark_theme
      }
      await updateUser(userForm)
      await this.getUser()
      this.loadingSave = false
      this.$router.go()
    }
  }
}
</script>

<style scoped>

</style>
