import Vue from 'vue'
import Vuex from 'vuex'
import VuexUndoRedo from 'vuex-undo-redo'

import modules from './modules'
import ipcBridge from './plugins/ipc-bridge'

Vue.use(Vuex)
Vue.use(VuexUndoRedo)

export default new Vuex.Store({
  modules,
  plugins: [ipcBridge],
  strict: process.env.NODE_ENV !== 'production'
})
