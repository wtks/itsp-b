<template>
  <div>
    <navigation />
    <div class="bg-lightblue">
      <div>
        {{ searchResults.length }} 件見つかりました。
      </div>
      <ul>
        <li v-for="result in searchResults" :key="result.doi">
          <router-link tag="div" class="pointed-cursor result-item" :to="{ name: 'Graph', query: {id: result.doi}}">
            <p class="title">{{ result.title }}</p>
            <p class="authors">{{ result.authors.join(', ') }}</p>
            <span class="year">{{ result.year }}</span>
            <span class="doi">{{ result.doi }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

.title {
  font-size: 22px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.authors {
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.year {
  font-weight: bold;
}

.doi {
  font-size: 50%;
}

li {
  border-top: 1px solid grey;
}

.pointed-cursor {
  cursor: pointer;
}

.result-item {
  min-height: 13vh;
  padding: 5px 10px;
}

</style>

<script>
import axios from 'axios'
import Navigation from '../components/Navigation.vue'

export default {
  data: function () {
    return {
      searchResults: []
    }
  },
  components: {
    Navigation
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
