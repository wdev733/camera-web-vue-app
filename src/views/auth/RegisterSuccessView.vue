<template>
  <div class="register-success-view">
    <!-- Success Register Card -->
    <b-card
      class="register-success-view--success"
    >
      <b-card-body>
        <h2>Your account has been created!</h2>
        <div class="text-center my-3">
          Please, check your email to verify your account.
        </div>
        <br>
        <i class="fe fe-check-circle text-success display-1" />
      </b-card-body>
      <b-card-footer>
        <router-link
          :to="{ name: 'LoginView' }"
          class="btn-success btn-block btn-lg"
        >
          Login
        </router-link>
      </b-card-footer>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'RegisterSuccessView'
}
</script>

<style scoped lang="sass">
.register-success-view
  text-align: center
  height: 100vh
  display: flex
  justify-content: center
  align-items: center
  &--success
    border: 5px solid #00d97e
</style>
