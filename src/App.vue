<template>
  <div id="app">
    <!-- Global Loading Overlay -->
    <LoadingStateOverlay v-if="loadingData" />

    <!-- The Navbar -->
    <TheNavbar v-if="!loadingData" />

    <!-- Main Content -->
    <div
      v-if="!loadingData"
      class="main-content"
    >
      <div class="container">
        <notifications
          group="notifications"
          class="notifications"
        />
        <transition
          name="fade"
          mode="out-in"
        >
          <router-view />
        </transition>
      </div>
    </div>

    <!-- App Version -->
    <AppVersion v-if="!loadingData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    LoadingStateOverlay: () => import('@/components/globals/LoadingStateOverlay'),
    TheNavbar: () => import('@/components/globals/TheNavbar'),
    AppVersion: () => import('@/components/globals/AppVersion')
  },
  computed: {
    ...mapGetters(['loadingData'])
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: feather;
  src:
    url('./assets/fonts/feather/feather.ttf?sdxovp') format('truetype'),
    url('./assets/fonts/feather/feather.woff?sdxovp') format('woff'),
    url('./assets/fonts/feather/feather.svg?sdxovp#Feather') format('svg');
  font-weight: normal;
  font-style: normal;
}

@import 'assets/sass/user';

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.notifications {
  margin-right: -5px;
}

.modal {
  z-index: 5 !important
}

.modal-backdrop {
  z-index: 1 !important
}

.full-height {
  height: 100vh
}

.dnd-grid-box {
  opacity: 1 !important
}
</style>
