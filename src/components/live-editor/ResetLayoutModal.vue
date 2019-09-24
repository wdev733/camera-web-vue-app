<template>
  <b-modal
    id="reset-layout-modal"
    title="Reset Layout"
    @ok="$emit('reset')"
  >
    <h4>Are you sure you want to reset the layout?</h4>
    <p class="text-danger mt-2">
      Changes can not be undone.
    </p>
  </b-modal>
</template>

<script>
export default {
  name: 'ResetLayoutModal'
}
</script>

<style scoped>

</style>
