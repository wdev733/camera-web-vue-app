<template>
  <div class="profile-view">
    <div class="row justify-content-center">
      <NarrowContent>
        <NavbarInner :data="navbarData" />
        <b-form @submit.prevent="updatePasswordMethod">
          <div class="row">
            <div class="col-12">
              <!-- Current Password -->
              <b-form-group label="Current Password">
                <b-form-input
                  v-model="$v.passwordForm.old_password.$model"
                  :state="$v.passwordForm.old_password.$dirty ? !$v.passwordForm.old_password.$error : null"
                  type="password"
                />

                <b-form-invalid-feedback>
                  Password is required.
                </b-form-invalid-feedback>
              </b-form-group>

              <!-- New Password -->
              <b-form-group label="New Password">
                <b-form-input
                  v-model="$v.passwordForm.new_password.$model"
                  :state="$v.passwordForm.new_password.$dirty ? !$v.passwordForm.new_password.$error : null"
                  type="password"
                />

                <b-form-invalid-feedback>
                  New password is required.
                </b-form-invalid-feedback>
              </b-form-group>

              <!-- Confirm New Password -->
              <b-form-group label="Confirm New Password">
                <b-form-input
                  v-model="$v.passwordForm.repeat_password.$model"
                  :state="$v.passwordForm.repeat_password.$dirty ? !$v.passwordForm.repeat_password.$error : null"
                  type="password"
                />

                <b-form-invalid-feedback>
                  New password confirmation is required and it should match the new password.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
          <hr class="mt-3 mb-5">
          <button
            class="btn btn-primary mb-3 float-right"
            :disabled="$v.passwordForm.$invalid || loadingSave"
            type="submit"
          >
            <span
              v-if="loadingSave"
              class="spinner-border spinner-border-sm text-white"
            />

            <span v-if="!loadingSave">Update Password</span>
          </button>
        </b-form>
      </NarrowContent>
    </div>
  </div>
</template>

<script>
import { required, sameAs } from 'vuelidate/lib/validators'
import { changePassword } from '../../api/UsersEndpoints'

export default {
  name: 'ChangePasswordView',
  components: {
    NarrowContent: () => import('@/components/hoc/NarrowContent'),
    NavbarInner: () => import('@/components/globals/NavbarInner')
  },
  validations: {
    passwordForm: {
      old_password: {
        required
      },
      new_password: {
        required
      },
      repeat_password: {
        required,
        sameAsPassword: sameAs('new_password')
      }
    }
  },
  data () {
    return {
      loadingSave: false,
      passwordForm: {
        old_password: null,
        new_password: null,
        repeat_password: null
      },
      navbarData: {
        pretitle: 'Settings',
        title: 'Change Password',
        path: 'ProfileView'
      }
    }
  },
  methods: {
    async updatePasswordMethod () {
      this.loadingSave = true

      try {
        await changePassword(this.passwordForm)
        this.$notify({
          group: 'notifications',
          text: 'Password Updated Successfully',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingSave = false
        this.passwordForm = {
          old_password: null,
          new_password: null,
          repeat_password: null
        }
        this.$v.$reset()
      }
    }
  }
}
</script>

<style scoped>

</style>
