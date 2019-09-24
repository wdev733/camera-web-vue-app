<template>
  <!-- Team Members Card -->
  <div class="card">
    <div class="card-body">
      <div class="header">
        <div class="header-body pt-0">
          <div class="row align-items-center">
            <div class="col">
              <h2 class="header-title">
                Members
              </h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Members Table -->
      <b-table
        class="table"
        :items="membersList"
        :fields="fields"
      >
        <!-- First Name -->
        <template
          slot="name"
          slot-scope="data"
        >
          {{ data.item.first_name }}
        </template>

        <!-- Role -->
        <template
          slot="role"
          slot-scope="data"
        >
          <span class="btn btn-sm btn-outline-primary">
            {{ getTeamRole(data.item) }}
          </span>
        </template>

        <!-- Actions -->
        <template
          v-if="getTeamRole(data.item) !== 'Owner'"
          slot="action"
          slot-scope="data"
        >
          <b-button
            v-b-modal.role-modal
            class="btn btn-info btn-sm"
            @click="selectUser(data.item)"
          >
            Edit Role
          </b-button>
          <b-button
            class="btn btn-danger btn-sm ml-2"
            :disabled="loadingDelete"
            @click="deleteUser(data.item)"
          >
            <span v-if="!loadingDelete">Delete</span>
            <span
              v-else
              class="spinner-border-sm spinner-border"
            />
          </b-button>
        </template>
      </b-table>
    </div>

    <!-- Team Role Update Modal -->
    <TeamsRoleModal
      :user="selectedUser"
      @updated="updateTable"
    />
  </div>
</template>

<script>
import { removeTeamUser } from '../../api/TeamsEndpoints'

export default {
  name: 'TeamsMembersTable',
  components: {
    TeamsRoleModal: () => import('./TeamsRoleModal')
  },
  props: {
    membersList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      selectedUser: {},
      pickedRole: 'Owner',
      loadingDelete: false,
      fields: {
        name: {
          label: 'Name',
          sortable: true
        },
        role: {
          label: 'Role',
          sortable: true
        },
        action: {
          label: 'Action',
          sortable: false
        }
      }
    }
  },
  methods: {
    // Get Team Member Role
    getTeamRole (member) {
      switch (member.role.team_role_id) {
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
    // Select User to Edit
    selectUser (user) {
      this.selectedUser = user
    },
    // Delete user and update the table
    async deleteUser (user) {
      this.loadingDelete = true
      const id = user.id
      try {
        await removeTeamUser(id)
        this.$notify({
          group: 'foo',
          text: 'User removed from team successfully',
          type: 'success'
        })
        this.updateTable()
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingDelete = false
      }
    },
    // Update the table
    updateTable () {
      this.$emit('updated')
    }
  }
}
</script>

<style scoped>

</style>
