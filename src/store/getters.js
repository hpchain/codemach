const getters = {
  editorState: state => state.editor.editorState,
  activeFile: state => state.editor.editorState.activeFile,
  fileTree: state => state.editor.editorState.tree,
  fileTab: state => state.editor.editorState.files
}
export default getters
