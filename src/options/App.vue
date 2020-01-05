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
    <form @submit.prevent="onSubmit()">
      <ul class="rdltr-form">
        <li>
          <label for="url">Instance url</label>
          <input
            type="text"
            id="url"
            placeholder="Enter your rdltr instance url"
            required
            v-model="url"
          />
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
          <button type="submit">
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
import axios from 'axios'

import { handleError } from '../utils'

export default {
  name: 'App',
  data() {
    return {
      authToken: null,
      error: null,
      password: null,
      url: null,
      user: {
        username: null,
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
      browser.storage.local.set({ authToken: newAuthToken })
    },
    user(newUser) {
      browser.storage.local.set({
        user: {
          username: newUser.username,
          email: newUser.email,
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
    updateError(error) {
      this.error = error
      if (error) {
        this.authToken = null
      }
    },
    onReset() {
      this.error = null
      this.authToken = null
    },
    onSubmit() {
      const formData = {
        email: this.user.email,
        password: this.password,
      }
      axios
        .create({
          baseURL: `https://${this.url}/api`,
        })
        .post(`/auth/login`, formData)
        .then(res => {
          if (res.data.status === 'success') {
            this.authToken = res.data.auth_token
            this.user = res.data.user
            return this.updateError(null)
          }
          return this.updateError(handleError())
        })
        .catch(err => this.updateError(handleError(err)))
    },
  },
}
</script>

<style src="../assets/rdltr.css"></style>
