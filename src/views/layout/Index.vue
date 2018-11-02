<template>
  <div style="height: 100vh">
    <Header @switchEnvironment="switchEnvironment"></Header>
    <div class="main-content">
      <FileTree></FileTree>
      <Edit></Edit>
      <Opt :pubIng="pubIng" @publish="publish"></Opt>
    </div>
  </div>
</template>

<script>
import Header from './Header'
import moment from 'moment'
import FileTree from './FileTree'
import Edit from './Edit'
import Opt from './Opt'
// import codeBeautify from '../../tools/codeBeautify.js'
import { mapGetters } from 'vuex'
import { createAccount, getBalance, recharge, createContract, moToBu } from '../../api/index.js'
export default {
  name: 'index',
  components: {Opt, Edit, FileTree, Header},
  data () {
    return {
      pubIng: false
    }
  },
  computed: {
    ...mapGetters([
      'environmentType',
      'activeEnvironment',
      'environment',
      'editorState',
      'activeContent'
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
          if (res.errorCode === 0) {
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
            if (res.errorCode === 0) {
              window.localStorage.setItem('sanboxAccount', JSON.stringify(acc))
              setTimeout(() => {
                getBalance(params).then((innerRes) => {
                  if (innerRes.errorCode === 0) {
                    var environment = JSON.parse(JSON.stringify(this.environment))
                    environment.sandbox.opt.editor.balance = moToBu(innerRes.result.balance)
                    this.$store.dispatch('setEnvironment', environment).then((res) => {})
                  }
                })
              }, 10000)
            }
          })
        })
      }
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
      if (this.environmentType === 'sandbox') { // sandbox，直接发布
        var acc = JSON.parse(window.localStorage.getItem('sanboxAccount'))
        var params = {
          type: 'sandbox',
          privateKey: acc.privateKey,
          contractCode: this.activeContent
        }
        if (this.activeEnvironment.opt.issueInitData) {
          params.input = this.activeEnvironment.opt.issueInitData
        }
        this.$store.commit('SET_ENVIRONMENT_ISSUERESULT', {type: this.environmentType, value: ''})
        this.$store.commit('SET_ENVIRONMENT_CONTRACTINFO', {type: this.environmentType, address: '--', hash: '--'})
        this.pubIng = true
        createContract(params).then((res) => {
          this.pubIng = false
          if (res.errorCode === 0) {
            // console.log(res)
            let environment = JSON.parse(JSON.stringify(this.environment))
            environment.sandbox.opt.issueResult = 'success'
            environment.sandbox.opt.contractInfo.hash = res.result.hash
            environment.sandbox.opt.contractInfo.address = res.result.contractAddressList[0].contract_address
            environment.sandbox.console.data.push({
              status: 'success',
              result: this.formatResult(res.result),
              time: moment().format('YYYY-MM-DD HH:mm:ss')
            })
            this.$store.dispatch('setEnvironment', environment).then((resEnvironment) => {})
          } else if (res.errorCode === -1) {
            this.$message.error('The BU required for the deploy is insufficient, the system will recharge BU automatically for you, please try again later')
          } else {
            let environment = JSON.parse(JSON.stringify(this.environment))
            environment.sandbox.opt.issueResult = 'failed'
            environment.sandbox.console.data.push({
              status: 'failed',
              result: this.formatResult(res.errorDesc),
              time: moment().format('YYYY-MM-DD HH:mm:ss')
            })
            this.$store.dispatch('setEnvironment', environment).then((res) => {})
          }
          setTimeout(() => {
            getBalance({
              type: 'sandbox',
              address: this.environment.sandbox.opt.editor.address
            }).then((banlaceRes) => {
              // console.log(banlaceRes)
              if (banlaceRes.errorCode === 0) {
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
    switchEnvironment (value) {
      this.$store.commit('SET_ENVIRONMENT_TYPE', value)
    }
  }
}
</script>

<style scoped>
  .main-content{display: flex;flex-wrap: nowrap;height: calc(100vh - 60px);}
</style>
