<template>
  <div>
    <div>
      <input type="checkbox" id="isFiltered" name="isFiltered" v-model="isChecked">
      <label for="isFiltered">フィルタリング</label>
    </div>
    <div class="home" style="height: 90vh">
      <div id="network" style="height: 100%"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import { DataSet, Network } from 'vis-network/standalone'

let network
const nodes = new DataSet([])
const edges = new DataSet([])
const uninfluentialPapers = []

export default {
  name: 'Home',
  components: {},
  data: function () {
    return {
      isChecked: false
    }
  },
  watch: {
    isChecked: function (val) {
      const updateNodes = []

      for (const uninfluentialNodeId of uninfluentialPapers) {
        updateNodes.push({ id: uninfluentialNodeId, hidden: val })
      }
      nodes.update(updateNodes)
      // edges.update()は不要？？
    }
  },
  async mounted () {
    const paperData = (await axios.get('http://localhost:8080/t')).data

    // create an array with nodes
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
        if (!v.isInfluential) {
          uninfluentialPapers.push(v.paperId)
        }
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
        if (!v.isInfluential) {
          uninfluentialPapers.push(v.paperId)
        }
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
