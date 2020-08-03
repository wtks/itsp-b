<template>
  <div class="container">
    <h1>Citemap</h1>
    <SearchBox />
  </div>
</template>

<style scoped>
h1 {
  margin: 15vh 0 3px 0;
  display: inline-block;
  color: #F0F0F0;
}

.container {
  text-align: center;
  background-color: #426EFF;
  width: 100vw;
  height: 100vh;
}

</style>

<script>
import SearchBox from '../components/SearchBox.vue'
export default {
  components: {
    SearchBox
  }
}
</script>
