import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticated: false,
    apiKey: ''
  },
  mutations: {
    authenticate() {
      state.authenticated = true 
    },

    setKey(state, key) {
      state.apiKey = key
    }
  },
  actions: {
  },
  modules: {
  }
})
