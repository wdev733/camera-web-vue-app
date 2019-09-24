<template>
  <!-- No Device Card -->
  <b-card class="text-center">
    <b-card-body>
      <h3>You have no devices yet in this site.</h3>
      <router-link
        tag="button"
        :to="{ name: 'DevicesSetupView' }"
        class="btn btn-primary btn-lg"
      >
        Add your first device
      </router-link>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: 'DevicesNoDevicesCard'
}
</script>

<style scoped>

</style>
