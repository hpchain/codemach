<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { getList } from './api/index.js'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  mounted () {},
  computed: {
    ...mapGetters([
      'editorState'
    ])
  },
  created () {
    var editorState = window.localStorage.getItem('editorState')
    if (!editorState) {
      editorState = JSON.parse(JSON.stringify(this.editorState))
      // 此处请求并获取初始化的editorState
      getList().then((res) => {
        editorState.files = [
          {
            path: 'root/Example/' + res.result[0].title + '.js',
            title: res.result[0].title + '.js',
            content: res.result[0].content
          }
        ]
        for (var i = 0; i < res.result.length; i++) {
          editorState.tree[0].children.push({
            path: 'root/Example/' + res.result[i].title + '.js',
            title: res.result[i].title + '.js',
            content: res.result[i].content
          })
        }
        editorState.activeFile = 'root/Example/' + res.result[0].title + '.js'
        this.$store.dispatch('setEditorState', editorState).then((res) => {})
      })
    } else {
      this.$store.dispatch('setEditorState', JSON.parse(editorState)).then((res) => {})
    }
  }
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
