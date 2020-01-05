<template>
  <div>
    <header id="header">
      <div class="logo">rdltr <small>a simple "read-it later" app</small></div>
    </header>
    <div class="rdltr">
      <div v-if="authToken">
        <p class="rdltr-title">{{ currentTab.title }}</p>
        <span class="rdltr-success" v-if="message">{{ message }}</span>
        <button type="submit" :disabled="loading" v-else @click="addArticle">
          Add to <strong>rdltr</strong>
        </button>
        <div class="rdltr-loading">
          <div class="rdltr-loader" v-if="loading"></div>
        </div>
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
import axios from 'axios'

import { handleError } from '../utils'

export default {
  data() {
    return {
      authToken: null,
      currentTab: null,
      error: null,
      loading: null,
      message: null,
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
    addArticle() {
      this.loading = true
      const config = {
        headers: { Authorization: `Bearer ${this.authToken}` },
      }
      const formData = {
        url: this.currentTab.url,
      }
      axios
        .create({
          baseURL: `https://${this.url}/api`,
        })
        .post('articles', formData, config)
        .then(res => {
          if (res.data.status === 'success') {
            this.message = 'Article added successfully!'
            this.loading = false
            return
          }
          return this.updateError(handleError())
        })
        .catch(err => this.updateError(handleError(err)))
    },
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
      if (error) {
        this.message = null
      }
      this.loading = false
      this.error = error
    },
  },
}
</script>

<style src="../assets/rdltr.css"></style>
