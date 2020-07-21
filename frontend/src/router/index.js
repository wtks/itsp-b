import Vue from 'vue'
import VueRouter from 'vue-router'
import Graph from '../views/Graph.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/graph',
    name: 'Graph',
    component: Graph
  }
]

const router = new VueRouter({
  routes
})

export default router
