<template>
  <!-- Teams Edit Role Modal -->
  <b-modal
    id="role-modal"
  >
    <!-- Title -->
    <template slot="modal-title">
      <h3>Change Role for {{ user.first_name }} {{ user.last_name }}</h3>
    </template>

    <!-- Dropdown Select -->
    <b-form-select
      v-model="selectedRole"
      :options="roleOptions"
    />
    <!-- Modal Footer -->
    <template slot="modal-footer">
      <b-button
        variant="primary"
        :disabled="loadingSave || !selectedRole"
        @click="selectNewRole"
      >
        <span v-if="!loadingSave">Save</span>
        <span
          v-else
          class="spinner-border spinner-border-sm"
        />
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { updateTeamUserRole } from '../../api/TeamsEndpoints'

export default {
  name: 'TeamsRoleModal',
  props: {
    user: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      roleOptions: ['Member', 'Manager'],
      selectedRole: null,
      loadingSave: false
    }
  },
  watch: {
    // Check if a new user has been selected to change
    user (newValue) {
      if (newValue) {
        this.selectedRole = this.getTeamRole(this.user)
      }
    }
  },
  methods: {
    // Get Team Member Role
    getTeamRole (member) {
      switch (member.role.team_role_id) {
        case 2:
          return 'Manager'
        case 3:
          return 'Member'
        default:
          return 'Member'
      }
    },
    // Get Team Member Role Name
    getTeamRoleName (role) {
      switch (role) {
        case 'Manager':
          return 2
        case 'Member':
          return 3
        default:
          return 3
      }
    },
    // Update the User Role
    async selectNewRole () {
      this.loadingSave = true
      const userId = this.user.id
      const roleId = this.getTeamRoleName(this.selectedRole)
      try {
        await updateTeamUserRole(userId, roleId)
        this.$notify({
          group: 'notifications',
          text: 'Role changed successfully',
          type: 'success'
        })
        await this.$emit('updated')
        this.$bvModal.hide('role-modal')
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingSave = false
      }
    }
  }
}
</script>

<style scoped>

</style>
