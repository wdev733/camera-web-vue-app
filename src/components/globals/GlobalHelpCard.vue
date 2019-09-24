<template>
  <div class="card">
    <div class="card-header">
      <h4 class="card-header-title">
        {{ data.title }}
      </h4>
      <br>
    </div>
    <div class="card-body">
      <p>
        {{ data.text1 }}
      </p>
      <p>
        {{ data.text2 }}
      </p>
      <button class="btn btn-block btn-info">
        Get more info
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalHelpCard',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {}
    }
  }
}
</script>

<style scoped>

</style>
