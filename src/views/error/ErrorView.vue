<template>
  <div
    class="d-flex align-items-center"
    style="margin-top: 37vh"
  >
    <div class="container danger">
      <div class="row justify-content-center">
        <h1>
          404 error.
        </h1>
      </div>
      <div class="row justify-content-center">
        <router-link
          tag="button"
          class="btn btn-danger btn-lg"
          :to="{ name: 'LoginView' }"
        >
          Go back to safety
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorView'
}
</script>

<style scoped>

</style>
