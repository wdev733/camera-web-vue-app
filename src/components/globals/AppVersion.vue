<template>
  <div class="app-version caption">
    v.{{ appVersion }}
  </div>
</template>

<script>
export default {
  name: 'AppVersion',
  computed: {
    appVersion () {
      return process.env.VUE_APP_APP_VERSION
    }
  }
}
</script>

<style scoped lang="sass">
.app-version
  position: fixed
  right: 5px
  bottom: 0
</style>
