import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './registerServiceWorker'

import axiosPlugin from './plugins/axios'
import iconPlugin from './plugins/icon'

Vue.use(axiosPlugin)
Vue.use(iconPlugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
