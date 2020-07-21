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
  }
}
</script>
