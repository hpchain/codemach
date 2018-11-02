import Vue from 'vue'
import Vuex from 'vuex'
import editor from './modules/editor'
import environment from './modules/environment'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    editor,
    environment
  },
  getters
})

export default store
