import Vue from 'vue'
import Router from 'vue-router'

import maps from '@/views/map'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/maps',
      name: 'maps',
      component: maps,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ],
})
