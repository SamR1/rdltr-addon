<template>
  <div>
    <header id="header">
      <div class="logo">rdltr <small>a simple "read-it later" app</small></div>
    </header>
    <div class="rdltr">
      <div v-if="authToken">
        <button type="submit">Add current tab to <strong>rdltr</strong></button>
      </div>
      <div v-else>
        <span class="rdltr-error"
          >Not connected to an <strong>rdltr</strong> instance</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      authToken: null,
      error: null,
      url: null,
      user: null,
    }
  },
  mounted() {
    const gettingAllStorageItems = browser.storage.local.get(null)
    gettingAllStorageItems.then(results => {
      const itemsKeys = Object.keys(results)
      for (const itemKey of itemsKeys) {
        this[itemKey] = results[itemKey]
      }
    })
  },
}
</script>

<style src="../assets/rdltr.css"></style>
