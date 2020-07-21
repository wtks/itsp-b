import Vue from 'vue'
import VueRouter from 'vue-router'
import Graph from '../views/Graph.vue'
import Results from '../views/Results.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: 'Home',
    // component: Home
    redirect: { name: 'Graph' }
  },
  {
    path: '/graph',
    name: 'Graph',
    component: Graph
  },
  {
    path: '/search',
    name: 'SearchResult',
    component: Results
  }
]

const router = new VueRouter({
  routes
})

export default router
