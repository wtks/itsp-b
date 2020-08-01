<template>
  <div style="background-color: #426EFF;">
    <h1>Citemap</h1>
    <SearchBox/>
  </div>
</template>

<style scoped>
h1 {

  margin:0 1vw;
  display: inline-block;
  color: #F0F0F0;
}

#search-box {
  text-align:center;
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
