<template>
  <div id="nav">
    <h1>
      <router-link class="offwhite no-text-decoration" to="/">Citemap</router-link>
    </h1>
    <div class="search">
      <search-box/>
    </div>
  </div>
</template>

<script>
import SearchBox from '../components/SearchBox.vue'

export default {
  name: 'Navigation',
  components: {
    SearchBox
  }
}
</script>

<style scoped>
#nav {
  background-color: #426EFF;
  padding:1vw;
}

h1 {
  margin:0 1vw;
  display: inline-block;
  width: 15vw;
}

.search {
  width: 80vw;
  display: inline-block;
  text-align:center;
  padding: 0 auto;
}
</style>
