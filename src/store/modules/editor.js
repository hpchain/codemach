const editor = {
  state: {
    editorState: {
      'files': [
        {
          path: '',
          title: '',
          content: ''
        }
      ],
      'tree': [
        {
          path: 'root/Example',
          extend: true,
          title: 'Example',
          children: []
        },
        {
          path: 'root/Customize',
          extend: false,
          title: 'Customize',
          children: []
        }
      ],
      'activeFile': 'root/Example',
      'sessions': {}
    }
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
    }
  }
}

export default editor
