<template>
  <div class="google-site-map">
    <!-- Google Autocomplete Input -->
    <b-input-group>
      <GmapAutocomplete
        class="form-control"
        @place_changed="setPlace"
        @input="updateLocation"
      />
    </b-input-group>

    <!-- Google Map -->
    <GmapMap
      v-if="center"
      id="google-map"
      ref="mapRef"
      :options="{
        styles: styles,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: true
      }"
      :center="center"
      :zoom="14"
    >
      <!-- Google Map Markers -->
      <GmapMarker
        v-for="(m, index) in markers"
        :key="index"
        :draggable="true"
        :position="m.position"
        @dragend="updateCoordinates($event.latLng)"
        @click="center = m.position"
      />
    </GmapMap>
  </div>
</template>

<script>
import { GoogleMapsStyle } from '../../assets/styles/GoogleMapsStyle'

export default {
  name: 'GoogleSiteMap',
  props: {
    currentMarker: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      currentName: null,
      center: null,
      markers: [],
      places: [],
      currentPlace: {},
      styles: GoogleMapsStyle
    }
  },
  async mounted () {
    // Parse the JSON
    if (this.currentMarker) {
      const marker = JSON.parse(this.currentMarker)
      this.center = marker
      this.markers = [{ position: marker }]
    }
  },
  methods: {
    updateLocation () {
      this.$emit('updated', null)
    },
    // Set Place in Map
    setPlace (place) {
      if (place.geometry) {
        this.currentPlace = place
        this.addMarker()
        const newPlace = place.geometry.location
        this.$emit('updated', JSON.stringify(newPlace))
      } else {
        this.$emit('updated', null)
        this.$notify({
          group: 'notifications',
          text: 'A valid place should be provided',
          type: 'error'
        })
      }
    },
    // Add a Marker to Map
    addMarker () {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        }
        this.markers = [{ position: marker }]
        this.places.push(this.currentPlace)
        this.center = marker
        this.currentPlace = null
      }
    },
    // Update Coordinates When Moving Marker
    async updateCoordinates (location) {
      this.currentPlace = {
        lat: parseFloat(location.lat()),
        lng: parseFloat(location.lng())
      }
      await this.$emit('updated', JSON.stringify(this.currentPlace))
    }
  }
}
</script>

<style scoped lang="sass">
#google-map
  border-radius: 5px
  width: 100%
  height: 200px
  margin: 50px auto
  border: 3px solid white
</style>
