<template>
  <!-- User Teams Table Card -->
  <div class="card">
    <div class="card-body">
      <div class="header">
        <div class="header-body pt-0">
          <div class="row align-items-center">
            <div class="col">
              <h2 class="header-title">
                My Teams
              </h2>
            </div>
            <div class="col-auto">
              <a
                v-b-modal.create-team-modal
                href="#"
                class="btn btn-primary"
              >
                Create Team
              </a>
            </div>
          </div>
        </div>
        <TeamsCreateModal />
      </div>

      <!-- User Teams Table -->
      <b-table
        :items="teamsList"
        :fields="fields"
        show-empty
      >
        <!-- Empty Data -->
        <template slot="empty">
          <button class="btn btn-block">
            No data available
          </button>
        </template>
        <template
          slot="name"
          slot-scope="data"
        >
          {{ data.item.name }}
        </template>

        <!-- Team Role -->
        <template
          slot="status"
          slot-scope="data"
        >
          <span class="btn-sm btn-success">
            {{ getTeamRole(data.item) }}
          </span>
        </template>

        <!-- Actions -->
        <template
          slot="changeTeam"
          slot-scope="data"
        >
          <b-button
            v-if="currentTeam.id === data.item.id"
            class="btn-info btn-sm"
            :disabled="loadingSwitch"
          >
            Current team
          </b-button>
          <b-button
            v-if="currentTeam.id !== data.item.id"
            class="btn-danger btn-sm"
            :disabled="loadingSwitch"
            @click="switchTeamMethod(data.item.id)"
          >
            <span v-if="!loadingSwitch">Choose team</span>
            <span
              v-else
              class="spinner-border spinner-border-sm"
            />
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { changeTeam } from '../../api/TeamsEndpoints'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TeamsTable',
  components: {
    TeamsCreateModal: () => import('./TeamsCreateModal')
  },
  props: {
    teamsList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      loadingSwitch: false,
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'status', label: 'Status' },
        { key: 'changeTeam', label: 'Change Team' }
      ]
    }
  },
  computed: {
    ...mapGetters('TeamsModule', ['currentTeam'])
  },
  methods: {
    ...mapActions('TeamsModule', ['getUserTeams']),
    ...mapActions(['reloadData']),
    // Get Team Member Role
    getTeamRole (member) {
      switch (member.role.id) {
        case 1:
          return 'Owner'
        case 2:
          return 'Manager'
        case 3:
          return 'Member'
        default:
          return 'Owner'
      }
    },
    // Switch Team
    async switchTeamMethod (teamId) {
      this.loadingSwitch = true
      await changeTeam(teamId)
      await this.reloadData()
      this.$emit('reloadTeams')
      this.loadingSwitch = false
    }
  }
}
</script>

<style scoped>

</style>
