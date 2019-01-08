import Vue from 'vue'
import Vuex from 'vuex'

import modules, {exportState, importState} from './modules'
import ipcBridge from './plugins/ipc-bridge'

Vue.use(Vuex)
let store = new Vuex.Store({
  modules,
  plugins: [ipcBridge(exportState, importState)],
  strict: process.env.NODE_ENV !== 'production'
})

export default store
