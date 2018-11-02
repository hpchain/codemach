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
  activeEnvironment: state => state.environment.data[state.environment.environmentType]
}
export default getters
