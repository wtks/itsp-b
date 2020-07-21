<template>
  <div>
    <form v-on:submit.prevent="onButtonClicked">
      <select v-model="searchOption">
        <option value="keyword">キーワード</option>
        <option value="doi">doi</option>
      </select>
      <input v-model="queryText" :placeholder="placeHolderText">
      <button>{{ searchOption === 'keyword' ? '検索' : '表示' }}</button>
    </form>
  </div>
</template>

<script>

export default {
  name: 'SearchBox',
  components: {},
  data: function () {
    return {
      queryText: '',
      searchOption: 'keyword'
    }
  },
  methods: {
    onButtonClicked: function () {
      if (this.searchOption === 'keyword') {
        this.$router.push({ name: 'SearchResult', query: { q: this.queryText } })
      } else if (this.searchOption === 'doi') {
        this.$router.push({ name: 'Graph', query: { id: this.queryText } })
      }
    }
  },
  computed: {
    placeHolderText () {
      if (this.searchOption === 'keyword') return 'Toward Unique Identifiers'
      return '10.1109/5.771073'
    }
  }
}
</script>
