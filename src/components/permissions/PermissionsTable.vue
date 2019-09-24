<template>
  <!-- Permissions Table -->
  <b-table
    :fields="fields"
    :items="permissions"
    class="permissions-table"
  >
    <!-- Permissions Camera Info -->
    <template
      slot="camera"
      slot-scope="data"
    >
      <p>{{ data.item.camera.name }}</p>
      <span class="avatar avatar-xl avatar-4by3 d-none d-sm-inline-block">
        <img
          alt="Image"
          class="avatar-img rounded"
          src="https://www.ruralnewsgroup.co.nz/media/k2/items/cache/f27c46af75c9b79e337ce9283b2cff99_XL.jpg"
        >
      </span>
    </template>

    <!-- Permissions by Camera and Member -->
    <template
      slot="permissions"
      slot-scope="data"
    >
      <b-form-checkbox-group
        v-model="selected[data.item.camera.id]"
        class="text-capitalize"
        :options="getPermissions(data.item)"
        switches
        stacked
        :disabled="loading"
        @input="savePermissionsMethod({
          selected: selected,
          camera: data.item.camera.id,
          permissions: data.item.permissions,
          member: member.id
        })"
      />
    </template>
  </b-table>
</template>

<script>
import { changeCameraPermissions } from '../../api/CamerasEndpoints'

export default {
  name: 'PermissionsTable',
  props: {
    permissions: {
      type: Array,
      required: true,
      default: () => []
    },
    member: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      selected: {},
      fields: [
        { value: 'camera', text: 'Camera' },
        { value: 'permissions', text: 'Permissions' }
      ]
    }
  },
  async mounted () {
    this.loading = true
    // Load Permissions to Local State
    await this.permissions.forEach(perm => {
      let permissionArray = []
      for (const key in perm.permissions) {
        if (perm.permissions[key]) {
          permissionArray.push(key)
        }
      }
      this.selected[perm.camera.id] = permissionArray
    })
    this.loading = false
  },
  methods: {
    // Parse Permissions Response to Accommodate for Checkboxes
    getPermissions (item) {
      let permissionsList = []
      for (const key in item.permissions) {
        if (item.permissions.hasOwnProperty(key)) {
          permissionsList.push({
            value: key,
            text: key.replace(/_/g, ' ')
          })
        }
      }
      return permissionsList
    },
    // Save Permissions
    async savePermissionsMethod (e) {
      if (!this.loading) {
        const possiblePermissions = { ...e.permissions }
        const selection = { ...e.selected }
        Object.keys(possiblePermissions).forEach(val => {
          possiblePermissions[val] = selection[e.camera].includes(val)
        })
        const updateData = {
          'user_id': e.member,
          ...possiblePermissions
        }
        try {
          await changeCameraPermissions(e.camera, updateData)
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}

</script>

<style lang="sass">
.permissions-table
  .custom-control
    margin-bottom: 5px

</style>
