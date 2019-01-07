import Vue from 'vue'
import axios from 'axios'
import VModal from 'vue-js-modal'

import App from './App'
import router from './router'
import store from './store'

// app static
import './../../static/bootstrap-custom.css'
import './../../static/fontawesome-free-5.6.3-web/css/all.min.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VModal, { componentName: 'vue-modal' })

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
