import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/layout/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    }
  ]
})
