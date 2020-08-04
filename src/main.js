import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookie from 'vue-cookies'
import cloneDeep from 'lodash/cloneDeep'
import { Modal, Notification, Menu, Tabs, Message } from 'ant-design-vue'

import bootstrap from './core/bootstrap'

Vue.use(VueCookie)
Vue.use(Modal)
Vue.use(Notification)
Vue.use(Menu)
Vue.use(Tabs)
Vue.use(Message)

Vue.config.productionTip = false

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG = {}
window.SITE_CONFIG.storeState = cloneDeep(store.state)

Vue.prototype.$message = Message
Vue.prototype.$modal = Modal
Vue.prototype.$notification = Notification
new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
