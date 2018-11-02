// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'
import App from './App'
import store from './store'
import router from './router'
import VueContextMenu from './components/VueContextMenu/index.js'
import './assets/css/reset.css'
import './assets/css/element-reset.css'
Vue.use(VueContextMenu)
Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
export default vm
