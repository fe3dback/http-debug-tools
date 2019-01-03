import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import './../../static/bootstrap-4.2.1-dist/css/bootstrap.min.css'
import './../../static/fontawesome-free-5.6.3-web/css/all.min.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
