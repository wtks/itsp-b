<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="aaaaa to Your Vue.js App"/>
    <div id="network"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { DataSet, Network } from 'vis-network/standalone'

let network

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  mounted () {
    // create an array with nodes
    const nodes = new DataSet([
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
      { id: 4, label: 'Node 4' },
      { id: 5, label: 'Node 5' }
    ])

    // create an array with edges
    const edges = new DataSet([
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 2, to: 5 }
    ])

    // create a network
    const container = document.getElementById('network')

    // provide the data in the vis format
    const data = {
      nodes: nodes,
      edges: edges
    }
    const options = {}

    // initialize your network!
    network = new Network(container, data, options)

    network.unselectAll()
  }
}
</script>
