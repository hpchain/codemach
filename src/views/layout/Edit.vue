<template>
  <div class="edit-content">
    <el-tabs class="edit-main-content" :value="activeFile" @input="checkTab" type="card" closable @tab-remove="removeTab">
      <el-tab-pane
        v-for="(item, index) in fileTab"
        :key="index"
        :label="item.title"
        :name="item.path"
      >
        <editor ref="aceEditor"
          :value="item.content"
          @input="editing(item.path, index)"
          :path="item.path"
          @init="editorInit"
          lang="javascript"
          theme="solarized_dark"
          :options="editorOptions"
          width="100%"
          height="100%"></editor>
      </el-tab-pane>
    </el-tabs>
    <div class="edit-bottom-status">
      <span class="file-size">9.6K</span>
      <span class="current-row">行 7</span>
      <span class="current-column">列 30</span>
    </div>
    <Console></Console>
  </div>
</template>

<script>
import Console from './Console'
import { mapGetters } from 'vuex'
import editor from 'vue2-ace-editor'
export default {
  name: 'Edit',
  components: {Console, editor},
  data () {
    return {
      editTabsValue: '1',
      editTabs: [{
        title: 'token.js',
        name: '1',
        content: 'var Tab = 1\nfunction fun1() {\n  var a = "1";\n\n\n\n}'
      }, {
        title: 'Tab 2',
        name: '2',
        content: 'var Tab = 2'
      }],
      tabIndex: 1,
      editorOptions: {
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        highlightActiveLine: false,
        highlightGutterLine: true,
        showPrintMargin: false,
        fontSize: 14
      }
      // fileTab: this.$store.state.editor.editorState.files
    }
  },
  mounted () {
    console.log(this.$refs.aceEditor[0].editor)
  },
  created () {},
  computed: {
    ...mapGetters([
      'activeFile',
      'fileTab'
    ])
  },
  methods: {
    setCompletions (editor, session, pos, prefix, callback) {
      let wordList = ['test111']
      callback(null, wordList.map(function (word) {
        return {
          caption: word,
          value: word,
          name: 'test',
          meta: 'test',
          type: 'local',
          score: 1000 // 让test排在最上面
        }
      }))
    },
    removeTab (targetName) {
      let tabs = this.editTabs
      let activeName = this.editTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.editTabsValue = activeName
      this.editTabs = tabs.filter(tab => tab.name !== targetName)
    },
    checkTab (path) {
      var editorState = JSON.parse(window.localStorage.getItem('editorState'))
      editorState.activeFile = path
      this.$store.dispatch('setEditorState', editorState).then((res) => {})
    },
    editing (path, index) {
      this.$nextTick(() => {
        var content = this.$refs.aceEditor[index].contentBackup
        var editorState = JSON.parse(window.localStorage.getItem('editorState'))
        for (var i = 0; i < editorState.files.length; i++) {
          if (editorState.files[i].path === path) {
            editorState.files[i].content = content
          }
        }
        this.$store.dispatch('setEditorState', editorState).then((res) => {})
      })
    },
    editorInit: function (editor) {
      require('brace/ext/language_tools')
      require('brace/mode/html')
      require('brace/mode/javascript')
      require('brace/theme/solarized_dark')
      require('brace/snippets/javascript')
      require('brace/snippets/autohotkey')
    }
  },
  watch: {
    tabIndex: {
      handler: function (newValue, oldValue) {
        var editorState = JSON.parse(window.localStorage.getItem('editorState'))
        editorState.files = JSON.parse(JSON.stringify(newValue))
        this.$store.dispatch('setEditorState', editorState).then((res) => {})
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
  .edit-content{flex-grow: 1;margin-top: 3px;margin-right: 2px;margin-left: 2px;display: flex;flex-direction: column;}
  .ace-solarized-dark{background-color: #2C2D44;}
  .edit-bottom-status{
    background: #383956;
    height: 35px;
    line-height: 35px;
    text-align: right;
    padding-right: 10px;
    margin-bottom: 2px;
    flex-shrink: 0;
  }
</style>
