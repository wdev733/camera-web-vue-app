<template>
  <b-modal
    id="delete-view-modal"
    title="Delete View"
    @ok="$emit('delete')"
  >
    <h4>Are you sure you want to DELETE this view?</h4>
    <p class="text-danger mt-2">
      Changes cannot be undone.
    </p>
  </b-modal>
</template>

<script>
export default {
  name: 'DeleteViewModal'
}
</script>

<style scoped>

</style>
