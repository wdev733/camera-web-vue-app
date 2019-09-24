<template>
  <div class="row justify-content-center">
    <!-- Loading State -->
    <LoadingState v-if="loading" />
    <!-- Sites View -->
    <NarrowContent v-if="!loading">
      <div class="sites-view">
        <!-- Inner Navbar -->
        <NavbarInner :data="navbarData" />
        <div class="row">
          <div class="col">
            <div class="card">
              <div class="card-body">
                <div class="header">
                  <div class="header-body pt-0">
                    <div class="row align-items-center">
                      <div class="col">
                        <h2 class="header-title">
                          My Sites
                        </h2>
                      </div>
                      <div class="col-auto">
                        <div class="dropdown">
                          <button
                            v-b-modal.create-site-modal
                            class="btn btn-primary"
                          >
                            New Site
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Sites Table -->
                <SitesTable
                  :sites-list="userSites"
                  style="z-index: -1 !important"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </NarrowContent>

    <!-- Sites Create Modal -->
    <SitesCreateModal />

    <!-- Sites Edit Modal -->
    <SitesEditModal />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'SitesView',
  components: {
    SitesEditModal: () => import('@/components/sites/SitesEditModal'),
    SitesCreateModal: () => import('@/components/sites/SitesCreateModal'),
    SitesTable: () => import('@/components/sites/SitesTable'),
    LoadingState: () => import('@/components/globals/LoadingState'),
    NavbarInner: () => import('@/components/globals/NavbarInner'),
    NarrowContent: () => import('@/components/hoc/NarrowContent')
  },
  data () {
    return {
      loading: false,
      navbarData: {
        pretitle: 'Settings',
        title: 'Sites',
        path: 'SettingsView'
      }
    }
  },
  computed: {
    ...mapGetters('SitesModule', ['userSites'])
  },
  async mounted () {
    this.loading = true
    await this.getUserSites()
    this.loading = false
  },
  methods: {
    ...mapActions('SitesModule', ['getUserSites'])
  }
}
</script>

<style lang="sass">

</style>
