<template>
  <b-navbar
    v-if="shouldShowNavbar"
    class="py-2"
    :toggleable="getToggleableNavbar"
  >
    <b-navbar-brand class="ml-2 mr-4">
      <a>
        <img
          src="@/assets/img/logo.svg"
          alt="Logo"
          style="width: 140px; height: 40px; margin-bottom: 5px"
        >
      </a>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse
      id="nav-collapse"
      is-nav
    >
      <b-navbar-nav
        class="ml-xs-0 ml-md-5 mr-auto"
      >
        <ul class="navbar-nav mt-1 ml-3">
          <li class="">
            <router-link
              id="topnavDashboards"
              tag="a"
              class="nav-link"
              :to="{ name: 'LiveView' }"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Live
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              v-if="isUserAdmin"
              id="topnavPages"
              tag="a"
              :to="{ name: 'SettingsView' }"
              class="nav-link"
              role="button"
            >
              Settings
            </router-link>
          </li>

          <li class="nav-item">
            <a
              id="topnavDocumentation"
              class="nav-link"
              href="#"
              role="button"
            >
              Help
            </a>
          </li>
        </ul>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="mr-3">
        <div
          v-if="!getUserTeams.length"
          class="text-primary m-4"
        >
          {{ currentTeam.name }}
        </div>
        <b-dropdown
          v-else
          class="mx-4"
          variant="link"
          :text="currentTeam.name"
        >
          <b-dropdown-item
            v-for="team in getUserTeams"
            :key="team.id"
            @click="changeTeamMethod(team)"
          >
            {{ team.name }}
          </b-dropdown-item>
        </b-dropdown>
        <div class="navbar-user mt-1">
          <b-dropdown
            class="dropdown"
            no-caret
            variant="transparent"
            dropleft
          >
            <template slot="button-content">
              <span>
                <v-gravatar
                  class="avatar avatar-online avatar-sm rounded"
                  :email="userEmail"
                />
              </span>
            </template>
            <b-dropdown-item>Billing</b-dropdown-item>
            <b-dropdown-item
              :to="{ name: 'TeamsView' }"
            >
              Manage Teams
            </b-dropdown-item>
            <hr class="dropdown-divider">
            <b-dropdown-item
              :to="{ name: 'ProfileView' }"
            >
              Profile
            </b-dropdown-item>
            <b-dropdown-item
              @click="logout"
            >
              Logout
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { changeTeam } from '../../api/TeamsEndpoints'

export default {
  name: 'TheNavbar',
  data () {
    return {
      window: {
        width: 0,
        height: 0
      }
    }
  },
  computed: {
    ...mapGetters(['loadingData']),
    ...mapGetters('UsersModule', ['userEmail', 'isUserLoggedIn', 'userHasTeam', 'isUserAdmin']),
    ...mapGetters('TeamsModule', ['userTeams', 'currentTeam']),
    shouldShowNavbar () {
      return this.userHasTeam && !this.loadingData
    },
    getUserTeams () {
      return this.userTeams.filter(team => team.id !== this.currentTeam.id)
    },
    // Check if Navbar should toggle
    getToggleableNavbar () {
      return this.window.width < 992 ? 'lg' : false
    }
  },
  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    ...mapActions(['reloadData', 'setDataLoading']),
    ...mapActions('UsersModule', ['logoutUser']),
    ...mapActions('TeamsModule', ['setCurrentTeam']),
    async changeTeamMethod (team) {
      const teamId = team.id
      this.setCurrentTeam(team)
      this.setDataLoading(true)
      try {
        const changedTeam = await changeTeam(teamId)
        this.$notify({
          group: 'foo',
          type: 'success',
          text: changedTeam.message
        })
        await this.reloadData()
        this.$router.go()
      } catch (e) {
        this.setDataLoading(false)
      }
    },
    async logout () {
      await this.logoutUser()
    },
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
    }
  }
}
</script>
