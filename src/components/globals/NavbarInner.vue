<template>
  <div class="navbar-inner">
    <div class="header">
      <div class="row align-items-center">
        <div class="col">
          <h6 class="header-pretitle">
            {{ data.pretitle }}
          </h6>
          <h1 class="header-title">
            {{ data.title }}
          </h1>
        </div>
        <div
          v-if="data.path"
          class="col-auto"
        >
          <router-link
            tag="a"
            :to="{ name: data.path }"
            class="btn btn-sm btn-secondary"
          >
            Back
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavbarInner',
  props: {
    data: {
      required: true,
      default: () => {},
      type: Object
    }
  }
}
</script>

<style scoped lang="sass">
.navbar-inner
  margin-top: 25px
</style>
