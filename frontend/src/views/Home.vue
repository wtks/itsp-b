<template>
  <div>
    <div>
      <input type="checkbox" id="isFiltered" name="isFiltered" v-model="isChecked">
      <label for="isFiltered">フィルタリング</label>
    </div>
    <div>
      <input type="checkbox" id="isHierarchy" name="isHierarchy" v-model="isHierarchyChecked">
      <label for="isHierarchy">階層表示</label>
    </div>
    <div class="home" style="height: 90vh">
      <div id="network" style="height: 100%"/>
    </div>
    <div>
      <!-- memo
      [ DOI ] (表示) // エラーはアラートで
        -->
      <input v-model="queryText" id="queryText" placeholder="10.1109/5.771073">
      <button v-on:click="console.log(1)">表示</button>
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
      isChecked: false,
      isHierarchyChecked: false
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
    },
    isHierarchyChecked: function (val) {
      const options = {
        layout: {
          randomSeed: undefined,
          improvedLayout: true,
          hierarchical: {
            enabled: val,
            nodeSpacing: 100,
            treeSpacing: 200,
            blockShifting: true,
            edgeMinimization: true,
            parentCentralization: true,
            direction: 'UD', // UD, DU, LR, RL
            sortMethod: 'directed' // hubsize, directed
          }
        }
      }
      network.setOptions(options)
    }
  },
  async mounted () {
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

    this.createGraph('4be293210f1a0dc14cf002a0069cf61d494d7eb2')

    network.on('doubleClick', (e) => {
      if (e.nodes.length > 0) {
        this.createGraph(e.nodes[0])
      }
    })
  },
  methods: {
    createGraph: async function (paperId) {
      const paperData = (await axios.get(`http://localhost:8080/t/${paperId}`)).data

      nodes.clear()
      edges.clear()
      uninfluentialPapers.length = 0

      // create an array with nodes
      nodes.add([{ id: paperData.paperId, title: paperData.title }])
      paperData.references
        .forEach(v => {
          nodes.add([{
            id: v.paperId,
            title: v.title,
            color: 'orange',
            hidden: this.isChecked && !v.isInfluential
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
            color: 'red',
            hidden: this.isChecked && !v.isInfluential
          }])
          edges.add([{
            from: v.paperId,
            to: paperData.paperId,
            arrows: 'to'
          }])
          if (!v.isInfluential) {
            uninfluentialPapers.push(v.paperId)
          }
        })

      network.setData({
        nodes: nodes,
        edges: edges
      })
    },
    search: async function (queryText) {
      // const paperId = (await axios.get(`http://localhost:8080/t/${queryText}`)).data
    }
  }
}
</script>
