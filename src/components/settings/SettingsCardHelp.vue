<template>
  <div class="card">
    <div class="card-body">
      <h3 class="card-title mb-5">
        Help & Support
      </h3>
      <p>
        If you are having problems with your system, please see the <a href="#">Help & Support</a>
        section.
      </p>
      <hr class="">

      <div class="custom-control custom-switch mb-3">
        <input
          id="enable-support-access"
          type="checkbox"
          checked
          class="custom-control-input"
        >
        <label
          class="custom-control-label"
          for="enable-support-access"
        >Remote Support</label>
      </div>
      <small class="form-text text-muted mb-3">Enabling remote support will allow the AgriCamera team to troubleshoot your system.</small>
      <p class="h2 mb-3">
        <span class="badge badge-secondary">PIN Code: 012345</span>
      </p>
      <small class="form-text text-muted">AgriCamera Support may ask for your pin code to verify who you are.</small>
    </div>
    <div class="card-footer">
      <a
        href="#"
        class="btn btn-sm btn-danger float-right"
      >
        Reboot System
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsCardHelp'
}
</script>

<style scoped>

</style>
