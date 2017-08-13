// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router'
import axios from 'axios'
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.filter("money",function (value,type) {
  return 'Y'+value.toFixed(2)+type
})
new Vue({
  el: '#app',
  //router,
  template: '<App/>',
  components: { App }
})
