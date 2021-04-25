<template>
  <div>
    <h1>S2 Settings</h1>
    
    <div v-if="!this.authenticated" >
      <p>Set your API Key here</p>
      <form id="api-key-form" @submit.prevent="authApiKey">
        <input v-model="apiKey" name="apiKey" placeholder="Enter API key...">
        <button type="submit">Submit</button>
        <p style="color: red" v-if="error">Problem authenticating API key.</p>
      </form>
    </div>

    <div v-else>
      <p>Extension Authenticated</p>
      <p>{{this.apiKey}}</p><a href="#" @click="clearKey">Clear</a>
    </div>
    
  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'
import axios from 'axios'

const AUTH_ENDPOINT = 'http://speedto.ngrok.io/api/v1/extension/auth'

export default {
  name: 'App',
  components: {  },
  data() {
    return {
      apiKey: '',
      authenticated: false,
      error: false
    }
  },
  methods: {
    authApiKey: function() {
      let vue_this = this
      axios.post(AUTH_ENDPOINT, {
        key: this.apiKey,
      })
      .then(function (response) {
        chrome.storage.sync.set({ speed_to_ext_api_key: vue_this.apiKey }, function() {
          vue_this.authenticated = true
          vue_this.error = false
          console.log(response)
        })
      })
      .catch(function (error) {
        vue_this.authenticated = false
        vue_this.error = true
        console.log(error);
      })
    },

    loadApiKey: function() {
      let vue_this = this 
      chrome.storage.sync.get(['speed_to_ext_api_key'], function(result) {
        if (result.speed_to_ext_api_key) {
          vue_this.apiKey = result.speed_to_ext_api_key
          vue_this.authenticated = true
          vue_this.error = false
        } else {
          vue_this.apiKey = ""
          vue_this.authenticated = false
        }
      })
    },

    clearKey: function() {
      let vue_this = this 
      chrome.storage.sync.set({ speed_to_ext_api_key: ''}, function() {
        vue_this.apiKey = ""
        vue_this.authenticated = false
        vue_this.error = false
      })
    }
  },
  created() {
    this.loadApiKey()
  },
  computed: {
  }
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
