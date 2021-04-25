<template>
  <div>
    <h1>Web Performance</h1>
    <hr>
    <div v-if="!authenticated">
      <p>You aren't authenticated yet.</p>
      <a href="#" @click="openOptionsPage">Enter Your API Key</a>
    </div>
    <div v-else>
      <small>Run audit for: {{ target }}</small><br>
      <a href="#" @click="runAudit">Audit</a>
    </div>
    
  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'
import axios from 'axios'

const REPORT_ENDPOINT = 'http://speedto.ngrok.io/api/v1/extension/performance_reports'

export default {
  name: 'App',
  components: {  },
  data() {
    return {
      apiKey: '',
      authenticated: false,
      error: false,
      target: ''
    }
  },
  methods: {
    setCurrentUrl() {
      let vue_this = this 
      chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {

        let url = tabs[0].url;
        console.log(`setting url: ${url}`)
        vue_this.target = url 
      });
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

    openOptionsPage() {
      chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
    },

    runAudit() {
      let vue_this = this 

      axios.post(REPORT_ENDPOINT, {
        api_key: this.apiKey,
        url: this.target
      })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        vue_this.error = true
        console.log(error);
      })
    }

  },
  computed: {
  },
  created() {
    this.setCurrentUrl()
    this.loadApiKey()
  }

}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
