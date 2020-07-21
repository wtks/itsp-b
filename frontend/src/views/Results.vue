<template>
  <div>
    <ul>
      <li v-for="result in searchResults" :key="result.doi">
        <span class="title">{{ result.title }}</span>,{{ result.authors }},{{ result.year }}. {{ result.doi }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      searchResults: []
    }
  },
  watch: {
    $route: 'initialize'
  },
  mounted: async function () {
    this.initialize()
  },
  methods: {
    search: async function (query) {
      try {
        const res = (await axios.get(`http://localhost:8080/s/${query}`))
        return res.data
      } catch (e) {
        console.log(e)
        return null
      }
    },
    initialize: async function () {
      if (this.$route.query.q) {
        this.searchResults = await this.search(this.$route.query.q)
      }
    }
  }
}
</script>
