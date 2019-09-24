<template>
  <!-- Sites Table -->
  <b-table
    :fields="fields"
    :items="sitesList"
    show-empty
    class="justify-content-center align-content-center"
  >
    <!-- Empty Data -->
    <template slot="empty">
      <button class="btn btn-block">
        No data available
      </button>
    </template>

    <!-- Name -->
    <template
      slot="name"
      slot-scope="data"
    >
      {{ data.item.name }}
    </template>

    <!-- Location -->
    <template
      slot="location"
      slot-scope="data"
    >
      <img
        alt="Map"
        class="rounded"
        :src="getStaticMap(data.item)"
      >
    </template>

    <!-- Actions -->
    <template
      slot="actions"
      slot-scope="data"
    >
      <button
        v-b-modal.edit-site-modal
        class="btn btn-sm btn-primary ml-lg-3 mt-sm-3 col-xl-3"
        @click="selectSite(data.item)"
      >
        Edit
      </button>
      <button
        class="btn btn-sm btn-primary ml-lg-3 mt-sm-3 col-sm-12 col-sm-8 col-xl-7"
        @click="goToSiteDevices(data.item)"
      >
        View Devices
      </button>
    </template>
  </b-table>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SitesTable',
  props: {
    sitesList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'location', label: 'Location' },
        { key: 'actions', label: 'Actions' }
      ]
    }
  },
  methods: {
    ...mapActions('SitesModule', ['selectSite', 'setCurrentSite']),
    goToSiteDevices (site) {
      this.setCurrentSite(site)
      this.$router.push({ name: 'DevicesView' })
    },
    // Generate Static Map
    getStaticMap (site) {
      const apiKey = process.env.VUE_APP_GOOGLE_MAPS_API
      const location = JSON.parse(site.location)
      const zoom = '&zoom=13'
      const size = '&size=300x100'
      const marker = '&markers=size:small%7Ccolor:0xff4060%7C' + location.lat + ',' + location.lng
      const center = 'center=' + location.lat + ',' + location.lng
      const url = 'https://maps.googleapis.com/maps/api/staticmap?'
      const key = `&key=${apiKey}`
      return url + center + zoom + size + marker + key
    }
  }
}
</script>

<style scoped>

</style>
