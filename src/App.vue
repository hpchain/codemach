<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {},
  created () {
    var editorState = window.localStorage.getItem('editorState')
    if (!editorState) {
      // 此处请求并获取初始化的editorState
      editorState = {
        'files': [
          {
            path: 'root/Example/token.js',
            title: 'token.js',
            content: ''
          },
          {
            path: 'root/Unititled/token.js',
            title: 'token.js',
            content: ''
          }
        ],
        'tree': [
          {
            path: 'root/Example',
            extend: true,
            title: 'Example',
            children: [
              {
                path: 'root/Example/token.js',
                title: 'token.js',
                content: ''
              }
            ]
          },
          {
            path: 'root/Unititled',
            extend: false,
            title: 'Unititled',
            children: [
              {
                path: 'root/Unititled/token.js',
                title: 'token.js',
                content: ''
              },
              {
                path: 'root/Unititled/test.js',
                title: 'test.js',
                content: ''
              }
            ]
          },
          {
            path: 'root/智能合约',
            extend: false,
            title: '智能合约',
            children: [
              {
                path: 'root/智能合约/token.js',
                title: 'token.js',
                content: ''
              }
            ]
          }
        ],
        'activeFile': 'root/Example/token.js',
        'dialog': {
          'dialogType': '',
          'visible': false,
          'actionType': ''
        },
        'sessions': {}
      }
      this.$store.dispatch('setEditorState', editorState).then((res) => {})
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
