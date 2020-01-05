<template>
  <div>
    <header id="header">
      <div class="logo">rdltr <small>a simple "read-it later" app</small></div>
    </header>
    <div class="rdltr">
      <div v-if="authToken">
        <span class="rdltr-title">{{ currentTab.title }}</span>
        <button type="submit">Add to <strong>rdltr</strong></button>
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
      currentTab: null,
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
    this.getCurrentTab()
  },
  methods: {
    getCurrentTab() {
      browser.tabs
        .query({ currentWindow: true, active: true })
        .then(this.updateCurrentTab, this.onError)
    },
    updateCurrentTab(tabs) {
      const [currentTab] = tabs
      if (currentTab) {
        this.currentTab = currentTab
        this.updateError(null)
      }
    },
    updateError(error) {
      this.error = error
    },
  },
}
</script>

<style src="../assets/rdltr.css"></style>
