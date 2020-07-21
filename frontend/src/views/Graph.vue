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
      <search-box />
    </div>
    <div class="home" style="height: 90vh; width: 78vw; display: inline-block;">
      <div id="network" style="height: 100%"/>
    </div>
    <div style="height: 90vh; width: 18vw; display: inline-block; overflow: scroll;">
      <ul>
        <li v-for="paper in history" :key="paper.paperId">
          {{ paper.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import { DataSet, Network } from 'vis-network/standalone'
import SearchBox from '../components/SearchBox.vue'

let network
const nodes = new DataSet([])
const edges = new DataSet([])
const uninfluentialPapers = []

export default {
  name: 'Home',
  components: {
    SearchBox
  },
  data: function () {
    return {
      isChecked: false,
      isHierarchyChecked: false,
      queryText: '',
      history: []
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
        },
        physics: {
          enabled: false
        }
      }
      network.setOptions(options)
    },
    '$route': initialize
  },
  async mounted () {
    // create a network
    const container = document.getElementById('network')

    // provide the data in the vis format
    const graph = {
      nodes: nodes,
      edges: edges
    }
    const options = {
      physics: {
        enabled: false
      }
    }

    // initialize your network!
    network = new Network(container, graph, options)

    network.on('doubleClick', async (e) => {
      if (e.nodes.length > 0) {
        const paperData = await this.search(e.nodes[0])
        if (paperData) {
          this.updateGraph(paperData)
        } else {
          alert('サーバにエラーがありました。')
        }
      }
    })

    this.initialize()
  },
  methods: {
    createGraph: function (paperData) {
      nodes.clear()
      edges.clear()
      uninfluentialPapers.length = 0

      // create an array with nodes
      nodes.add([{
        id: paperData.paperId,
        title: paperData.title,
        label: paperData.authors.length > 1 ? (paperData.authors[0]).name + ' et al.,' + paperData.year : (paperData.authors[0]).name + ',' + paperData.year
      }])
      if (paperData.references) {
        paperData.references
          .forEach(v => {
            nodes.add([{
              id: v.paperId,
              title: v.title,
              color: 'orange',
              label: v.authors.length > 1 ? (v.authors[0]).name + ' et al., ' + v.year : (v.authors[0]).name + ', ' + v.year,
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
              label: v.authors.length > 1 ? (v.authors[0]).name + ' et al., ' + v.year : (v.authors[0]).name + ', ' + v.year,
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
    updateGraph: function (paperData) {
      this.createGraph(paperData)

      const updateNodes = []
      updateNodes.push({ id: this.history[this.history.length - 2].paperId, shape: 'diamond' })
      nodes.update(updateNodes)
    },
    search: async function (queryText) {
      try {
        const res = (await axios.get(`http://localhost:8080/t/${queryText}`))
        this.history.push(res.data)
        return res.data
      } catch (e) {
        console.log(e)
        return null
      }
    },
    createGraphFromQueryText: async function (queryText) {
      this.history.splice(-this.history.length)
      const paperData = (await this.search(queryText))

      if (!paperData) {
        alert('該当する結果がありませんでした。')
        return
      }

      this.createGraph(paperData)
    },
    initialize: async function () {
      if (this.$route.query.id) {
        const doi = this.$route.query.id
        this.createGraphFromQueryText(doi)
      }
    }
  }
}
</script>
