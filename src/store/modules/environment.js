const environment = {
  state: {
    environmentType: 'sandbox',
    data: { // 不同环境对应不同数据
      production: {
        opt: {
          editor: {
            address: '--PROD',
            balance: '--'
          },
          issueResult: '',
          issueInitData: '',
          contractInfo: {
            address: '--',
            hash: '--'
          },
          invokData: {
            mainData: '',
            queryData: '',
            sendBu: ''
          }
        },
        console: {
          data: []
        },
        editorStatus: {
          row: 0,
          column: 0
        }
      },
      development: {
        opt: {
          editor: {
            address: '--DEVE',
            balance: '--'
          },
          issueResult: '',
          issueInitData: '',
          contractInfo: {
            address: '--',
            hash: '--'
          },
          invokData: {
            mainData: '',
            queryData: '',
            sendBu: ''
          }
        },
        console: {
          data: []
        },
        editorStatus: {
          row: 0,
          column: 0
        }
      },
      sandbox: {
        opt: {
          editor: {
            address: '--SAND',
            balance: '--'
          },
          issueResult: '',
          issueInitData: '',
          contractInfo: {
            address: '--',
            hash: '--'
          },
          invokData: {
            mainData: '',
            queryData: '',
            sendBu: ''
          }
        },
        console: {
          data: []
        },
        editorStatus: {
          row: 0,
          column: 0
        }
      }
    }
  },
  mutations: {
    SET_ENVIRONMENT_TYPE: (state, data) => {
      state.environmentType = data
    },
    SET_ENVIRONMENT_DATA: (state, data) => {
      state.data = data
    },
    SET_ENVIRONMENT_ISSUERESULT: (state, params) => {
      state.data[params.type].opt.issueResult = params.value
    },
    SET_ENVIRONMENT_CONTRACTINFO: (state, params) => {
      state.data[params.type].opt.contractInfo.address = params.address
      state.data[params.type].opt.contractInfo.hash = params.hash
    }
  },
  actions: {
    setEnvironment ({ commit, state }, data) {
      return new Promise(resolve => {
        commit('SET_ENVIRONMENT_DATA', data)
        window.localStorage.setItem('environment', JSON.stringify(data))
        resolve(state.environment)
      })
    }
  }
}

export default environment
