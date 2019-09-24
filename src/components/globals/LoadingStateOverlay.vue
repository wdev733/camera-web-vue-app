<template>
  <div class="loading-state-overlay">
    <div
      class="spinner-border loading-state"
    />
  </div>
</template>

<script>
export default {
  name: 'LoadingStateOverlay'
}
</script>

<style scoped lang="sass">
.loading-state-overlay
  height: 100%
  position: absolute
  width: 100%
  z-index: 50
  display: flex
  align-items: center
  justify-content: center
.loading-state
  width: 4rem
  height: 4rem
</style>
