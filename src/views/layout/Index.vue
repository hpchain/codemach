<template>
  <div style="height: 100%">
    <Header></Header>
    <div class="main-content">
      <FileTree></FileTree>
      <Edit></Edit>
      <Opt></Opt>
    </div>
  </div>
</template>

<script>
import Header from './Header'
import FileTree from './FileTree'
import Edit from './Edit'
import Opt from './Opt'
export default {
  name: 'index',
  components: {Opt, Edit, FileTree, Header}
}
</script>

<style scoped>
  .main-content{display: flex;flex-wrap: nowrap;height: 100%;}
</style>
