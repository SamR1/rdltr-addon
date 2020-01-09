<template>
  <div>
    <div class="rdltr-status-box">
      <p>
        Status:
        <span :class="`rdltr-status-${authToken ? '' : 'not-'}connected`"
          >{{ authToken ? '' : 'not ' }}connected</span
        >
      </p>
      <button
        type="submit"
        class="rdltr-button"
        v-if="authToken"
        @click="onReset"
      >
        Disconnect
      </button>
    </div>
    <form @submit.prevent="onSubmit">
      <ul class="rdltr-form">
        <li>
          <label for="url">Instance url</label>
          <div class="input-prepend">
            <div class="input-prepend-text">https://</div>
            <input
              type="text"
              id="url"
              placeholder="Enter your rdltr instance url"
              required
              v-model="url"
            />
          </div>
        </li>
        <li>
          <label for="email">Email</label>
          <input type="email" id="email" required v-model.trim="user.email" />
        </li>
        <li>
          <label for="password">Password</label>
          <input type="password" id="password" required v-model="password" />
        </li>
        <li>
          <div class="rdltr-loading">
            <div class="rdltr-loader" v-if="loading"></div>
          </div>
          <button type="submit" :disabled="loading">
            {{ authToken && user.email ? 'Update' : 'Submit' }}
          </button>
        </li>
      </ul>
    </form>
    <p class="rdltr-error" v-if="error">
      {{ error }}
    </p>
  </div>
</template>

<script>
import { handleError, postToRdltr } from '../utils'

export default {
  name: 'App',
  data() {
    return {
      authToken: null,
      error: null,
      loading: false,
      password: null,
      url: null,
      user: {
        email: null,
        categories: [],
        tags: [],
      },
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
  watch: {
    authToken(newAuthToken) {
      if (newAuthToken) {
        browser.storage.local.set({ authToken: newAuthToken })
      }
    },
    user(newUser) {
      browser.storage.local.set({
        user: {
          categories: JSON.parse(JSON.stringify(newUser.categories)),
          tags: JSON.parse(JSON.stringify(newUser.tags)),
        },
      })
    },
    url(newUrl) {
      browser.storage.local.set({ url: newUrl })
    },
  },
  methods: {
    emptyStorage() {
      this.authToken = null
      browser.storage.local.remove('authToken')
      browser.storage.local.remove('user')
    },
    onReset() {
      this.error = null
      this.emptyStorage()
    },
    onSubmit(e) {
      const formData = {
        email: this.user.email,
        password: this.password,
      }
      this.loading = true
      postToRdltr(this.url, 'auth/login', formData)
        .then(res => {
          if (res.data.status === 'success') {
            this.authToken = res.data.auth_token
            this.user = {
              email: null,
              categories: res.data.user.categories,
              tags: res.data.user.tags,
            }
            this.password = null
            e.target.reset()
            return this.updateError(null)
          }
          return this.updateError(handleError())
        })
        .catch(err => this.updateError(handleError(err)))
    },
    updateError(error) {
      this.error = error
      this.loading = false
      if (error) {
        this.emptyStorage()
      }
    },
  },
}
</script>

<style src="../assets/rdltr.css"></style>
