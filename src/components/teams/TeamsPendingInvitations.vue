<template>
  <!-- Teams Pending Invitations -->
  <div class="card">
    <div class="card-body">
      <div class="header">
        <div class="header-body pt-0">
          <div class="row align-items-center">
            <div class="col">
              <h2 class="header-title">
                Pending Invitations
              </h2>
            </div>
          </div>
        </div>
      </div>
      <!-- Teams Pending Invitations Table -->
      <b-table
        :fields="fields"
        :items="invitations"
      >
        <!-- Email -->
        <template
          slot="email"
          slot-scope="data"
        >
          {{ data.item.email }}
        </template>

        <!-- Actions -->
        <template
          slot="actions"
          slot-scope="data"
        >
          <button
            class="btn-sm btn-dark"
            :disabled="loadingResend"
            @click="resendInvitationMethod(data.item)"
          >
            <span v-if="!loadingResend">Resend invite</span>
            <span
              v-else
              class="spinner-border-sm spinner-border"
            />
          </button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { resendInviteToTeamUser } from '../../api/TeamsEndpoints'

export default {
  name: 'TeamsPendingInvitations',
  props: {
    invitations: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      loadingResend: false,
      fields: [
        {
          key: 'email',
          label: 'Email',
          sortable: false
        },
        {
          key: 'actions',
          label: 'Actions',
          sortable: false
        }
      ]
    }
  },
  methods: {
    // Resend Email Invitation
    async resendInvitationMethod (item) {
      this.loadingResend = true
      const { email, id } = item
      try {
        await resendInviteToTeamUser(id)
        this.$notify({
          group: 'notifications',
          text: `${email} invitation sent successfully!`,
          type: 'success'
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingResend = false
      }
    }
  }
}
</script>

<style scoped>

</style>
