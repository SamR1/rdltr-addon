<template>
  <div>
    <header id="header">
      <div class="logo">rdltr <small>a simple "read-it later" app</small></div>
    </header>
    <div class="rdltr-container">
      <div v-if="isSupportedProtocol">
        <form @submit.prevent="addArticle()" v-if="authToken">
          <p class="rdltr-title">{{ currentTab.title }}</p>
          <label for="categories">Category</label>
          <select id="categories" v-model="selectedCategory">
            <option
              v-for="category in user.categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
          <label>Tags</label>
          <app-multiselect
            placeholder="Search or add a tag"
            v-model="selectedTags"
            :multiple="true"
            :options="user.tags.map(tag => tag.name)"
            :taggable="true"
            @tag="addTag"
          ></app-multiselect>
          <input id="fromBrowser" type="checkbox" v-model="fromBrowser" />
          <label for="fromBrowser">
            from browser
          </label>
          <span class="rdltr-success" v-if="message">{{ message }}</span>
          <div class="rdltr-loading-button" v-else>
            <button type="submit" :disabled="loading">
              Add to <strong>rdltr</strong>
            </button>
            <div class="rdltr-loading">
              <div class="rdltr-loader" v-if="loading"></div>
            </div>
          </div>
          <span class="rdltr-error">{{ error }}</span>
        </form>
        <div v-else>
          <span class="rdltr-error"
            >Not connected to an <strong>rdltr</strong> instance</span
          >
        </div>
      </div>
      <div v-else>
        <p class="rdltr-not-supported">Not supported tab</p>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { handleError, isSupportedProtocol, postToRdltr } from '../utils'

export default {
  components: {
    AppMultiselect: Multiselect,
  },
  data() {
    return {
      authToken: null,
      currentTab: null,
      currentTabContent: null,
      error: null,
      fromBrowser: true,
      isSupportedProtocol: false,
      loading: null,
      message: null,
      selectedCategory: null,
      selectedTags: [],
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
    this.isSupportedProtocol = isSupportedProtocol(this.currentTab.url)
  },
  methods: {
    addArticle() {
      this.loading = true
      const config = {
        headers: { Authorization: `Bearer ${this.authToken}` },
      }
      const formData = {
        url: this.currentTab.url,
        category_id: this.selectedCategory,
        tags: this.selectedTags,
      }
      if (this.fromBrowser) {
        formData.html_content = this.currentTabContent
        formData.title = this.currentTab.title
      }
      postToRdltr(this.url, 'articles', formData, config)
        .then(res => {
          if (res.data.status === 'success') {
            this.message = 'Article added successfully!'
            this.loading = false
            return this.updateError(null)
          }
          return this.updateError(handleError())
        })
        .catch(err => this.updateError(handleError(err)))
    },
    addTag(newTag) {
      this.selectedTags.push(newTag)
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
        browser.tabs
          .sendMessage(currentTab.id, { req: 'source-code' })
          .then(response => {
            this.currentTabContent = response.content
          })
          .catch(err => console.error(err))
      }
    },
    updateError(error) {
      this.error = error
      this.loading = false
      if (error) {
        this.message = null
      }
    },
  },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="../assets/rdltr.css"></style>
