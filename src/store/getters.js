const getters = {
  editorState: state => state.editor.editorState,
  activeFile: state => state.editor.editorState.activeFile,
  fileTree: state => state.editor.editorState.tree,
  fileTab: state => state.editor.editorState.files,
  activeContent: state => {
    for (var i = 0; i < state.editor.editorState.files.length; i++) {
      if (state.editor.editorState.files[i].path === state.editor.editorState.activeFile) {
        return state.editor.editorState.files[i].content
      }
    }
  },
  environmentType: state => state.environment.environmentType,
  environment: state => state.environment.data,
  activeEnvironment: state => state.environment.data[state.environment.environmentType],
  activeFileInitData: state => {
    var result = ''
    for (var x = 0; x < state.editor.editorState.tree.length; x++) {
      for (var y = 0; y < state.editor.editorState.tree[x].children.length; y++) {
        if (state.editor.editorState.tree[x].children[y].path === state.editor.editorState.activeFile) {
          result = state.editor.editorState.tree[x].children[y].invokeData.init
          break
        }
      }
    }
    return result
  },
  activeFileQueryData: state => {
    var result = ''
    for (var x = 0; x < state.editor.editorState.tree.length; x++) {
      for (var y = 0; y < state.editor.editorState.tree[x].children.length; y++) {
        if (state.editor.editorState.tree[x].children[y].path === state.editor.editorState.activeFile) {
          result = state.editor.editorState.tree[x].children[y].invokeData.query
          break
        }
      }
    }
    return result
  },
  activeFileMainData: state => {
    var result = ''
    for (var x = 0; x < state.editor.editorState.tree.length; x++) {
      for (var y = 0; y < state.editor.editorState.tree[x].children.length; y++) {
        if (state.editor.editorState.tree[x].children[y].path === state.editor.editorState.activeFile) {
          result = state.editor.editorState.tree[x].children[y].invokeData.main
          break
        }
      }
    }
    return result
  },
  showWebkitWarn: state => state.base.showWebkitWarn
}
export default getters
