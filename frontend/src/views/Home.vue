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
    <div>
      <!-- memo
      [ DOI ] (表示) // エラーはアラートで
        -->
      <form>
        <input v-model="queryText" id="queryText" placeholder="10.1109/5.771073">
        <button v-on:click="onButtonClicked">表示</button>
      </form>
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
      isChecked: false,
      isHierarchyChecked: false,
      queryText: ''
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

    network.on('doubleClick', async (e) => {
      if (e.nodes.length > 0) {
        const paperData = await this.search(e.nodes[0])
        if (paperData) {
          this.createGraph(paperData)
        } else {
          alert('サーバにエラーがありました。')
        }
      }
    })
  },
  methods: {
    createGraph: function (paperData) {
      nodes.clear()
      edges.clear()
      uninfluentialPapers.length = 0

      // create an array with nodes
      nodes.add([{ id: paperData.paperId, title: paperData.title }])
      if (paperData.references) {
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
      }
      if (paperData.citations) {
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
      }

      network.setData({
        nodes: nodes,
        edges: edges
      })
    },
    search: async function (queryText) {
      try {
        const res = (await axios.get(`http://localhost:8080/t/${queryText}`))
        return res.data
      } catch (e) {
        console.log(e)
        return null
      }
    },
    onButtonClicked: async function (queryText) {
      const paperData = (await this.search(this.queryText))

      if (!paperData) {
        alert('該当する結果がありませんでした。')
        return
      }

      this.createGraph(paperData)
    }
  }
}
</script>
