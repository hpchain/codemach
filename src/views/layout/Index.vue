<template>
  <div style="height: 100vh">
    <Header @switchEnvironment="switchEnvironment"></Header>
    <div class="main-content" :class="showWebkitWarn ? 'height-show-warn' : ''">
      <FileTree></FileTree>
      <Edit></Edit>
      <Opt :pubIng="pubIng" @publish="publish" @refreshAccountBalance="refreshAccountBalance" :refreshAccountBalanceIng="refreshAccountBalanceIng"></Opt>
    </div>
  </div>
</template>

<script>
import Header from './Header'
import moment from 'moment'
import FileTree from './FileTree'
import Edit from './Edit'
import Opt from './Opt'
import codeConfig from '../../axios/codeConfig.js'
import { mapGetters } from 'vuex'
import { createAccount, getBalance, recharge, createContract, moToBu } from '../../api'
export default {
  name: 'index',
  components: {Opt, Edit, FileTree, Header},
  data () {
    return {
      pubIng: false,
      refreshAccountBalanceIng: false
    }
  },
  computed: {
    ...mapGetters([
      'environmentType',
      'activeEnvironment',
      'environment',
      'editorState',
      'activeContent',
      'activeFileInitData',
      'showWebkitWarn'
    ])
  },
  created () {
    this.initSandbox()
  },
  mounted () {},
  methods: {
    initSandbox () {
      if (window.localStorage.getItem('sanboxAccount')) {
        var environment = JSON.parse(JSON.stringify(this.environment))
        let acc = JSON.parse(window.localStorage.getItem('sanboxAccount'))
        environment.sandbox.opt.editor.address = acc.address
        this.$store.dispatch('setEnvironment', environment).then((res) => {})
        getBalance({
          type: 'sandbox',
          address: acc.address
        }).then((res) => {
          if (res.errorCode === codeConfig.SUCCESS_CODE) {
            environment.sandbox.opt.editor.balance = moToBu(res.result.balance)
            this.$store.dispatch('setEnvironment', environment).then((res) => {})
          }
        })
      } else {
        createAccount().then((acc) => {
          var params = {
            type: 'sandbox',
            address: acc.address
          }
          var environment = JSON.parse(JSON.stringify(this.environment))
          environment.sandbox.opt.editor.address = acc.address
          this.$store.dispatch('setEnvironment', environment).then((res) => {})
          recharge(params).then((res) => {
            if (res.errorCode === codeConfig.SUCCESS_CODE) {
              window.localStorage.setItem('sanboxAccount', JSON.stringify(acc))
              setTimeout(() => {
                this.refreshAccountBalance(params)
              }, 1000)
            }
          })
        })
      }
    },
    refreshAccountBalance (params) {
      if (this.refreshAccountBalanceIng) {
        return false
      }
      this.refreshAccountBalanceIng = true
      getBalance(params).then((banlaceRes) => {
        // console.log(banlaceRes)
        if (banlaceRes.errorCode === codeConfig.SUCCESS_CODE) {
          try {
            this.refreshAccountBalanceIng = false
            let environment = JSON.parse(JSON.stringify(this.environment))
            environment[this.environmentType].opt.editor.balance = moToBu(banlaceRes.result.balance)
            this.$store.dispatch('setEnvironment', environment).then((res) => {})
          } catch (e) {
            this.refreshAccountBalanceIng = false
            this.refreshAccountBalance(params)
          }
        } else {
          this.refreshAccountBalanceIng = false
          this.refreshAccountBalance(params)
        }
      })
    },
    publish () {
      var fileList = JSON.parse(JSON.stringify(this.editorState.files))
      if (fileList.length === 0) {
        this.$message.error('Please select the contract you want to release')
        return false
      }
      if (this.pubIng) {
        return false
      }
      if (this.environmentType === 'sandbox') { // sandbox
        var acc = JSON.parse(window.localStorage.getItem('sanboxAccount'))
        var params = {
          type: 'sandbox',
          privateKey: acc.privateKey,
          contractCode: this.activeContent
        }
        if (this.activeFileInitData) {
          params.input = this.activeFileInitData
        }
        this.$store.commit('SET_ENVIRONMENT_ISSUERESULT', {type: this.environmentType, value: ''})
        this.$store.commit('SET_ENVIRONMENT_CONTRACTINFO', {type: this.environmentType, address: '--', hash: '--'})
        this.pubIng = true
        createContract(params).then((res) => {
          this.pubIng = false
          // console.log(res)
          if (res.errorCode === codeConfig.SUCCESS_CODE) {
            let environment = JSON.parse(JSON.stringify(this.environment))
            environment.sandbox.opt.issueResult = 'success'
            environment.sandbox.opt.contractInfo.hash = res.result.hash
            environment.sandbox.opt.contractInfo.address = res.result.contractAddressList[0].contract_address
            environment.sandbox.console.data.push(this.formatDeployConsoleInfo('finished', res.result))
            this.$store.dispatch('setEnvironment', environment).then((resEnvironment) => {})
          } else if (res.errorCode === codeConfig.NOT_ENOUGH_BANLANCE) {
            this.$message.error({
              type: 'error',
              message: 'The BU required for the deploy is insufficient, the system will recharge BU automatically for you, you can refresh the balance to checking  status',
              onClose: () => {}
            })
          } else {
            let environment = JSON.parse(JSON.stringify(this.environment))
            environment.sandbox.opt.issueResult = 'failed'
            environment.sandbox.console.data.push(this.formatDeployConsoleInfo('failed', res.errorDesc))
            this.$store.dispatch('setEnvironment', environment).then((res) => {})
          }
          setTimeout(() => {
            getBalance({
              type: 'sandbox',
              address: this.environment.sandbox.opt.editor.address
            }).then((banlaceRes) => {
              // console.log(banlaceRes)
              if (banlaceRes.errorCode === codeConfig.SUCCESS_CODE) {
                let environment = JSON.parse(JSON.stringify(this.environment))
                environment.sandbox.opt.editor.balance = moToBu(banlaceRes.result.balance)
                this.$store.dispatch('setEnvironment', environment).then((res) => {})
              }
            })
          }, 10)
        })
      } else { // production and development,弹窗输入私钥
        // console.log(this.environmentType)
      }
    },
    formatResult (obj) {
      var result = []
      if (typeof obj === 'object') {
        for (var item in obj) {
          var a = {
            title: item,
            detail: JSON.stringify(obj[item])
          }
          result.push(a)
        }
        return result
      } else {
        result.push({
          title: 'errorDesc',
          detail: obj
        })
        return result
      }
    },
    formatDeployConsoleInfo (status, res) {
      var result = {
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        action: 'Deploy',
        status: status,
        raw: this.formatResult(res),
        printInfoList: [],
        showRaw: false
      }
      if (status === 'finished') { // deploy contract for success
        for (let i = 0; i < res.contractAddressList.length; i++) {
          result.printInfoList.push({
            title: 'Contract address',
            dec: res.contractAddressList[i].contract_address
          })
        }
        result.printInfoList.push({
          title: 'Tx hash',
          dec: res.hash
        })
      } else if (status === 'failed') { // deploy contract for failed
        try {
          let basement = JSON.parse(res)
          if (basement.constructor === Array) {
            for (let i = 0; i < basement.length; i++) {
              let rowStr = basement[i].line ? (' at row ' + basement[i].line) : ''
              let colStr = basement[i].column ? (' and column ' + basement[i].column) : ''
              result.printInfoList.push({
                title: 'Error',
                dec: basement[i].message + rowStr + colStr
              })
            }
          } else if (basement.hasOwnProperty('exception')) {
            result.printInfoList.push({
              title: 'Exception',
              dec: basement.exception
            })
          } else {
            result.printInfoList.push({
              title: 'Error',
              dec: res
            })
          }
        } catch (e) {
          result.printInfoList.push({
            title: 'Error',
            dec: res
          })
        }
      }
      return result
    },
    switchEnvironment (value) {
      this.$store.commit('SET_ENVIRONMENT_TYPE', value)
    }
  }
}
</script>

<style scoped>
  .main-content{
    display: flex;
    flex-wrap: nowrap;
    height: calc(100vh - 60px);
  }
  .main-content.height-show-warn{
    height: calc(100vh - 100px);
  }
</style>
