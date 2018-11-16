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
        // console.log(res)
        editorState.files = [
          {
            path: 'root/Example/' + res.result[0].title + '.js',
            title: res.result[0].title + '.js',
            content: res.result[0].content,
            hash: res.result[0].hash,
            invokeData: {
              init: '',
              main: '',
              query: ''
            }
          }
        ]
        var initData = '{"params": {"supply": "10","name": "xxx","symbol": "xxx","version": "1.0", "decimals": 8}}'
        var queryData = '{"method": "tokenInfo"}'
        var mainData = '{"method": "transfer", "params": {"to": "buQjAFL8iJxiDkaCRYD647xu44WfNeXyYHvh","value": "10"}}'
        for (var i = 0; i < res.result.length; i++) {
          editorState.tree[0].children.push({
            path: 'root/Example/' + res.result[i].title + '.js',
            title: res.result[i].title + '.js',
            content: res.result[i].content,
            hash: res.result[i].hash,
            invokeData: {
              init: res.result[i].title === 'demo' ? initData : '',
              main: res.result[i].title === 'demo' ? mainData : '',
              query: res.result[i].title === 'demo' ? queryData : ''
            }
          })
        }
        editorState.activeFile = 'root/Example/' + res.result[0].title + '.js'
        this.$store.dispatch('setEditorState', editorState).then((res) => {})
      })
    } else {
      editorState = JSON.parse(editorState)
      editorState.tree[0].children = []
      getList().then((res) => {
        // console.log(res)
        var initData = '{"params": {"supply": "100000000","name": "Contract Token Demo","symbol": "CTD","version": "1.0", "decimals": 8}}'
        var queryData = '{"method": "tokenInfo"}'
        var mainData = '{"method": "transfer", "params": {"to": "buQjAFL8iJxiDkaCRYD647xu44WfNeXyYHvh","value": "10"}}'
        for (var i = 0; i < res.result.length; i++) {
          editorState.tree[0].children.push({
            path: 'root/Example/' + res.result[i].title + '.js',
            title: res.result[i].title + '.js',
            content: res.result[i].content,
            hash: res.result[i].hash,
            invokeData: {
              init: res.result[i].title === 'demo' ? initData : '',
              main: res.result[i].title === 'demo' ? mainData : '',
              query: res.result[i].title === 'demo' ? queryData : ''
            }
          })
          for (let y = 0; y < editorState.files.length; y++) {
            if (editorState.files[y].title === res.result[i].title + '.js') {
              editorState.files[y].content = res.result[i].content
            }
          }
        }
        setTimeout(() => {
          this.$store.dispatch('setEditorState', editorState).then((res) => {})
        }, 10)
      })
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
