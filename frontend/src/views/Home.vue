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

    // create an array with nodes
    const nodes = new DataSet([])
    const edges = new DataSet([])

    nodes.add([{ id: paperData.paperId, title: paperData.title }])
    paperData.references
      .forEach(v => {
        nodes.add([{
          id: v.paperId,
          title: v.title,
          color: 'orange'
        }])
        edges.add([{
          from: paperData.paperId,
          to: v.paperId,
          arrows: 'to'
        }])
      })
    paperData.citations
      .forEach(v => {
        nodes.add([{
          id: v.paperId,
          title: v.title,
          color: 'red'
        }])
        edges.add([{
          from: paperData.paperId,
          to: v.paperId,
          arrows: 'from'
        }])
      })

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
