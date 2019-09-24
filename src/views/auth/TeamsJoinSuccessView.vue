<template>
  <div class="teams-join-success-view">
    <!-- Success Verification Card -->
    <b-card
      class="teams-join-success-view--success"
    >
      <b-card-body>
        <h2>You have successfully accepted the invitation to the team!</h2>
        <br>
        <i class="fe fe-check-circle text-success display-1" />
      </b-card-body>
      <b-card-footer>
        <router-link
          :to="{ name: 'SettingsView' }"
          class="btn-success btn-block btn-lg"
        >
          Go to Dashboard
        </router-link>
      </b-card-footer>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'TeamsJoinSuccessView'
}
</script>

<style scoped lang="sass">
.teams-join-success-view
  text-align: center
  height: 90vh
  display: flex
  justify-content: center
  align-items: center
  &--success
    border: 5px solid #00d97e
</style>
