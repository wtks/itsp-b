<template>
  <div class="home" style="height: 90vh">
    <div id="network" style="height: 100%"/>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import { DataSet, Network } from 'vis-network/standalone'

let network

export default {
  name: 'Home',
  components: {},
  async mounted () {
    const paperData = (await axios.get('http://localhost:8080/t')).data
    // const references = (await axios.get('http://localhost:8080/a')).data
    // const citations = (await axios.get('http://localhost:8080/b')).data

    // create an array with nodes
    const nodes = new DataSet([])

    // let id = 0
    nodes.add([{ id: paperData.paperId, label: paperData.title }])
    paperData.citations.forEach(v => nodes.add([{ id: v.paperId, label: v.title, color: 'orange' }]))
    // citations.forEach(v => nodes.add([{ id: id++, label: v }]))

    // create an array with edges
    const edges = new DataSet([])
    paperData.citations.forEach(v => edges.add([{ from: paperData.paperId, to: v.paperId, arrows: 'to' }]))

    // create a network
    const container = document.getElementById('network')

    // provide the data in the vis format
    const graph = {
      nodes: nodes,
      edges: edges
    }
    const options = {}

    // initialize your network!
    network = new Network(container, graph, options)

    network.unselectAll()
  }
}
</script>
