<template>
  <div class="file-tree-cont">
    <div class="append-folder-cont clearfix">
      <div class="fr">
        <i class="el-icon-plus"></i>文件夹
      </div>
    </div>
    <div class="file-tree">
      <div v-for="(item, index) in fileTree" :key="index" class="tree-group" :class="item.extend ? 'is-extend' : ''">
        <div @click="switchGroup(index, item.path)" class="group-title">
          <span class="el-icon-caret-right"></span>
          <span class="group-name">{{item.title}}</span>
          <div v-if="item.path != 'root/Example'" class="group-handle">
            <span class="el-icon-plus"></span>
          </div>
        </div>
        <div class="group-children">
          <div v-for="(child, ins) in item.children"
            :key="ins"
            @click="checkFile(child)"
            class="tree-item"
            :class="child.path === activeFile ? 'is-checked' : ''">
            <div class="el-icon-tickets"></div>
            <div class="item-name">{{child.title}}</div>
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
    return {}
  },
  computed: {
    ...mapGetters([
      'activeFile',
      'fileTree'
    ])
  },
  methods: {
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
