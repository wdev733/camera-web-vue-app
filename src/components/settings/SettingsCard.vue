<template>
  <div class="card">
    <div class="card-body">
      <h3 class="card-title mb-3">
        {{ data.title }}
      </h3>
      <p>{{ data.text }}</p>
    </div>
    <div class="card-footer">
      <router-link
        v-if="data.path !== 'TeamsMembersView'"
        tag="a"
        :to="{ name: data.path }"
        class="btn btn-info float-right"
      >
        Go
      </router-link>
      <router-link
        v-else
        tag="a"
        :to="{ name: data.path, params: { id: currentTeam.id } }"
        class="btn btn-info float-right"
      >
        Go
      </router-link>
      <router-link
        v-if="data.title === 'Manage Devices'"
        tag="a"
        :to="{ name: 'DevicesMapView' }"
        class="btn btn-success float-right mr-2"
      >
        Devices Map
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SettingsCard',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters('TeamsModule', ['currentTeam'])
  }
}
</script>

<style scoped>
.card {
  min-height: 250px;
}
</style>
