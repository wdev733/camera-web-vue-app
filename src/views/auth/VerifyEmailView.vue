<template>
  <div class="verify-email-view">
    <!-- Success Verification Card -->
    <b-card
      class="verify-email-view--success"
    >
      <b-card-body>
        <h2>Your email has been verified!</h2>
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
  name: 'VerifyEmailView'
}
</script>

<style scoped lang="sass">
.verify-email-view
  text-align: center
  height: 100vh
  display: flex
  justify-content: center
  align-items: center
  &--success
    border: 5px solid #00d97e
</style>
