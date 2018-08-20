<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
@import url("./assets/less/element-ui-reset.less");
.clearfix::after {
  content: "";
  display: block;
  height:0;
  clear: both;
}

.clearfix {
  *zoom: 1;
}

a{
  text-decoration: none;
}
.fl {
  float: left;
}

.fr {
  float: right;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#app {
  height: 100%;
  width: 100%;
  position: fixed;
  font-size: 14px;
  font-family: "microsoft yahei", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #666;
  background: #24253C;
}
</style>
