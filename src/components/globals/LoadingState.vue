<template>
  <div
    class="spinner-border loading-state"
    :class="{ 'text-white': getTheme, 'text-black': !getTheme }"
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LoadingState',
  computed: {
    ...mapGetters('UsersModule', ['getTheme'])
  }
}
</script>

<style scoped lang="sass">

.loading-state
  width: 4rem
  height: 4rem
  margin: 39vh auto

</style>
