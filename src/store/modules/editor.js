const editor = {
  state: {
    editorState: null
  },
  mutations: {
    SET_EDITER_STATE: (state, data) => {
      state.editorState = data
    }
  },
  actions: {
    setEditorState ({ commit, state }, data) {
      return new Promise(resolve => {
        commit('SET_EDITER_STATE', data)
        window.localStorage.setItem('editorState', JSON.stringify(data))
        resolve(state.editorState)
      })
    },
    delVisitedViews ({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersViews ({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_VIEWS', view)
        resolve([...state.visitedViews])
      })
    }
  }
}

export default editor
