<template>
  <div class="file-tree-cont">
    <div class="append-folder-cont clearfix">
      <div class="fr" @click="addFolder">
        <i class="el-icon-plus"></i>Folder
      </div>
    </div>
    <div class="file-tree">
      <div v-for="(item, index) in fileTree" :key="index" class="tree-group" :class="item.extend ? 'is-extend' : ''">
        <div @click="switchGroup(index, item.path)" class="group-title">
          <span class="el-icon-caret-right"></span>
          <span class="group-name">{{item.title}}</span>
          <div @click.stop="addFile(index)" v-if="item.path != 'root/Example'" class="group-handle">
            <span class="el-icon-plus"></span>
          </div>
        </div>
        <div class="group-children">
          <div v-for="(child, ins) in item.children"
            :key="ins"
            @contextmenu="showMenu(index, ins)"
            @click="checkFile(child)"
            class="tree-item"
            :class="child.path === activeFile ? 'is-checked' : ''">
            <div class="el-icon-tickets"></div>
            <div class="item-name">{{child.title}}</div>
           <vue-context-menu :contextMenuData="contextMenuData"
                             :transferIndex="index.toString() + ins.toString()"
                             :activeMenu="activeMenu"
                             @addFile="addFile(index)"
                             @deletFile="deletFile(index ,ins)"></vue-context-menu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FileTree',
  data () {
    return {
      activeMenu: '', // Show the menu that was clicked
      contextMenuData: {
        menuName: 'fileHandle',
        axis: {
          x: null,
          y: null
        },
        menulists: [
          {
            fnHandler: 'addFile',
            icoName: '',
            btnName: 'add file'
          },
          {
            fnHandler: 'deletFile',
            icoName: '',
            btnName: 'delete file'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'activeFile',
      'fileTree',
      'editorState'
    ])
  },
  methods: {
    showMenu (index, ins) {
      if (index === 0) {
        return
      }
      this.activeMenu = index.toString() + ins.toString() // tranfer index to child component
      event.preventDefault()
      var x = event.clientX
      var y = event.clientY
      this.contextMenuData.axis = {
        x, y
      }
    },
    deletFile (index, ins) {
      var editorState = JSON.parse(window.localStorage.getItem('editorState'))
      var path = editorState.tree[index].children[ins].path
      for (let i = 0; i < editorState.files.length; i++) {
        if (editorState.files[i].path === path) {
          if (editorState.activeFile === path) {
            editorState.activeFile = editorState.files[i + 1] ? editorState.files[i + 1].path : (editorState.files[i - 1] ? editorState.files[i - 1].path : '')
          }
          editorState.files.splice(i, 1)
        }
      }
      editorState.tree[index].children.splice(ins, 1)
      this.$store.dispatch('setEditorState', editorState).then((res) => {})
    },
    switchGroup (index, path) {
      var editorState = JSON.parse(window.localStorage.getItem('editorState'))
      editorState.tree[index].extend = !editorState.tree[index].extend
      this.$store.dispatch('setEditorState', editorState).then((res) => {})
    },
    checkFile (item) {
      var editorState = JSON.parse(window.localStorage.getItem('editorState'))
      editorState.activeFile = item.path
      if (!this.checkPathExit(item.path, editorState.files)) {
        editorState.files.push(item)
      }
      this.$store.dispatch('setEditorState', editorState).then((res) => {})
    },
    checkPathExit (path, arr) {
      var result = false
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].path === path) {
          result = true
          break
        }
      }
      return result
    },
    addFile (index) {
      var editorState = JSON.parse(window.localStorage.getItem('editorState'))
      editorState.tree[index].extend = true
      this.$prompt('Please enter file name', 'Prompt', {
        confirmButtonText: 'Enter',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (value !== 'null' && !value.trim()) {
            return 'The file name cannot be empty'
          } else {
            for (var i = 0; i < editorState.tree[index].children.length; i++) {
              if (editorState.tree[index].children[i].title === (value + '.js')) {
                return 'File name already exists'
              }
            }
          }
        }
      }).then(({ value }) => {
        var baseContent = ''
        for (var i = 0; i < editorState.tree[0].children.length; i++) {
          if (editorState.tree[0].children[i].title === 'base.js') {
            baseContent = editorState.tree[0].children[i].content
            break
          }
        }
        var file = {
          title: value + '.js',
          path: editorState.tree[index].path + '/' + value + '.js',
          content: baseContent,
          invokeData: {
            init: '',
            main: '',
            query: ''
          }
        }
        editorState.files.push(file)
        editorState.tree[index].children.splice(0, 0, file)
        editorState.activeFile = editorState.tree[index].children[0].path
        this.$store.dispatch('setEditorState', editorState).then((res) => {})
      }).catch(() => {})
    },
    addFolder () {
      var editorState = JSON.parse(window.localStorage.getItem('editorState'))
      this.$prompt('Please enter a folder name', 'Prompt', {
        confirmButtonText: 'Enter',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (value !== 'null' && !value.trim()) {
            return 'The folder name cannot be empty'
          } else {
            for (var i = 0; i < editorState.tree.length; i++) {
              if (editorState.tree[i].title === value) {
                return 'Folder name already exists'
              }
            }
          }
        }
      }).then(({ value }) => {
        var folder = {
          path: 'root/' + value,
          extend: false,
          title: value,
          children: []
        }
        editorState.tree.push(folder)
        this.$store.dispatch('setEditorState', editorState).then((res) => {})
      }).catch(() => {})
    }
  },
  mounted () {},
  created () {},
  destroyed () {}
}
</script>

<style scoped lang="less">
.file-tree-cont{
  width: 250px;
  background: #373955;
  margin-top: 3px;
  flex-shrink: 0;
  & .append-folder-cont{
    padding: 0px 20px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #999;
    & .fr{
      cursor: pointer;
    }
    & .el-icon-plus{
      margin-right: 5px;
    }
  }
  & .file-tree{
    padding: 10px 8px 20px 30px;
    & .tree-group{
      & .group-title{
        line-height: 40px;
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        & .el-icon-caret-right{
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        & .group-name{
          flex-grow: 1;
          -webkit-user-select: none;
          font-size: 16px;
          margin-left: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        & .group-handle{
          font-size: 18px;
          flex-shrink: 0;
          padding-right: 10px;
        }
      }
      & .group-children{
        margin-left: 30px;
        border-left: 1px dashed #999;
        max-height: 0px;
        overflow: hidden;
        transition: all 0.3s ease;
        & .tree-item{
          padding-left: 10px;
          color: #999;
          line-height: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          & .el-icon-tickets{
            flex-shrink: 0;
            font-size: 18px;
          }
          & .item-name{
            flex-grow: 1;
            margin-left: 5px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          &.is-checked{
            color: #00D080;
          }
        }
      }
      &.is-extend{
        & .group-title{
          & .el-icon-caret-right{
            transform: rotate(90deg);
          }
        }
        & .group-children{
          max-height: 1000px;
        }
      }
    }
  }
}
</style>
