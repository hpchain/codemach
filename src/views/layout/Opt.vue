<template>
  <div class="opt-content">
    <div class="opt-wraper">
      <div class="opt-box issue-editor">
        <h3 class="opt-box-title">Account</h3>
        <div class="opt-box-cont">
          <p>{{activeEnvironment.opt.editor.address}}</p>
          <p>{{activeEnvironment.opt.editor.balance}} BU</p>
        </div>
      </div>
      <div class="opt-box issue-contract">
        <h3 class="opt-box-title">Deploy the contract</h3>
        <div class="opt-box-cont">
          <p>The init function argument (optional)</p>
          <el-input type="textarea" :value="activeEnvironment.opt.issueInitData" :autosize="true" resize="none" @input="changeIssueData"></el-input>
          <el-button class="opt-box-btn" @click="publish()" size="small" type="primary"><i v-if="pubIng" class="el-icon-loading"></i>Deploy</el-button>
          <div class="issue-result-cont">
            <div v-if="activeEnvironment.opt.issueResult !== ''" class="result-item" :class="activeEnvironment.opt.issueResult">
              {{activeEnvironment.opt.issueResult === 'success' ? 'Deploy success' : 'Deploy failer！Check the console for details'}}
              <a href="javascript:;" class="result-delet" @click="closeResult">×</a>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeEnvironment.opt.contractInfo.address !== '--'" class="opt-box issue-msg">
        <h3 class="opt-box-title">Contract information</h3>
        <div class="msg-item">
          <div class="msg-title">Contract address：</div>
          <div class="msg-info">{{activeEnvironment.opt.contractInfo.address}}</div>
        </div>
        <div class="msg-item">
          <div class="msg-title">Hash：</div>
          <div class="msg-info">{{activeEnvironment.opt.contractInfo.hash}}</div>
        </div>
      </div>
      <div class="opt-box invok-cont" v-if="activeEnvironment.opt.contractInfo.address.length > 30">
        <h3 class="opt-box-title">Invoke the contract</h3>
        <el-tabs v-model="invokDataType" @tab-click="switchInvokDataType">
          <el-tab-pane label="main" name="main">
            <el-input
              type="textarea"
              :autosize="true"
              resize="none"
              placeholder="The input argument of the main function"
              :value="activeEnvironment.opt.invokData.mainData"
              @input="changeInvokMianData">
            </el-input>
            <div class="main-num-send">
              <p>Amount of BU to be sent to the contract address</p>
              <el-input
                size="mini"
                placeholder="Please enter the amount of BU"
                type="number"
                @input="changeInvokSendBu"
                :value='activeEnvironment.opt.invokData.sendBu'></el-input>
            </div>
            <div class="invok-handle">
              <el-button class="opt-box-btn" size="small" @click="debugMain" type="primary"><i v-if="invokIng" class="el-icon-loading"></i>Invoke</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="query" name="query">
            <el-input
              type="textarea"
              :autosize="true"
              resize="none"
              placeholder="The input argument of the query function"
              :value="activeEnvironment.opt.invokData.queryData"
              @input="changeInvokQueryData">
            </el-input>
            <div class="invok-handle">
              <el-button class="opt-box-btn" size="small" @click="debugQuery" type="primary"><i v-if="invokIng" class="el-icon-loading"></i>Invoke</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { debugForMain, debugForQuery, getBalance, moToBu, buToMo } from '../../api/index.js'
// import codeBeautify from '../../tools/codeBeautify.js'
export default {
  name: 'Opt',
  data () {
    return {
      invokDataType: 'query',
      invokData: '',
      invokIng: false
    }
  },
  props: {
    pubIng: {
      type: Boolean,
      default: false
    }
  },
  mounted () {},
  created () {},
  computed: {
    ...mapGetters([
      'activeEnvironment',
      'environment',
      'environmentType'
    ])
  },
  methods: {
    switchInvokDataType (tab, event) {
      // console.log(tab.name)
    },
    changeInvokQueryData (value) {
      var environment = JSON.parse(JSON.stringify(this.environment))
      environment[this.environmentType].opt.invokData.queryData = value
      this.$store.dispatch('setEnvironment', environment).then((res) => {})
    },
    changeInvokMianData (value) {
      var environment = JSON.parse(JSON.stringify(this.environment))
      environment[this.environmentType].opt.invokData.mainData = value
      this.$store.dispatch('setEnvironment', environment).then((res) => {})
    },
    changeIssueData (value) {
      var environment = JSON.parse(JSON.stringify(this.environment))
      environment[this.environmentType].opt.issueInitData = value
      this.$store.dispatch('setEnvironment', environment).then((res) => {})
    },
    changeInvokSendBu (value) {
      var environment = JSON.parse(JSON.stringify(this.environment))
      environment[this.environmentType].opt.invokData.sendBu = value
      this.$store.dispatch('setEnvironment', environment).then((res) => {})
    },
    publish () {
      this.$emit('publish')
    },
    debugMain () {
      if (this.invokIng) {
        return false
      }
      if (this.environmentType === 'sandbox') {
        let inputData = this.activeEnvironment.opt.invokData.mainData
        let acc = JSON.parse(window.localStorage.getItem('sanboxAccount'))
        let params = {
          type: this.environmentType,
          input: inputData,
          privateKey: acc.privateKey,
          contractAddress: this.activeEnvironment.opt.contractInfo.address
        }
        if (this.activeEnvironment.opt.invokData.sendBu) {
          params.buAmount = buToMo(this.activeEnvironment.opt.invokData.sendBu)
        }
        this.invokIng = true
        debugForMain(params).then((res) => {
          // console.log(res)
          this.invokIng = false
          if (res.errorCode === 0) {
            let environment = JSON.parse(JSON.stringify(this.environment))
            environment.sandbox.console.data.push({
              status: 'success',
              result: this.formatResult(res.result),
              time: moment().format('YYYY-MM-DD HH:mm:ss')
            })
            this.$store.dispatch('setEnvironment', environment).then((res) => {})
          } else if (res.errorCode === 151) {
            let environment = JSON.parse(JSON.stringify(this.environment))
            environment.sandbox.console.data.push({
              status: 'failed',
              result: this.formatResult(res.errorDesc),
              time: moment().format('YYYY-MM-DD HH:mm:ss')
            })
            this.$store.dispatch('setEnvironment', environment).then((res) => {})
          } else {
            let environment = JSON.parse(JSON.stringify(this.environment))
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
      }
    },
    debugQuery () {
      if (this.invokIng) {
        return false
      }
      if (this.environmentType === 'sandbox') {
        let inputData = this.activeEnvironment.opt.invokData.queryData
        this.invokIng = true
        debugForQuery({
          type: this.environmentType,
          input: inputData,
          contractAddress: this.activeEnvironment.opt.contractInfo.address
        }).then((res) => {
          this.invokIng = false
          // console.log(res)
          if (res.errorCode === 0) {
            let environment = JSON.parse(JSON.stringify(this.environment))
            environment.sandbox.console.data.push({
              status: 'success',
              result: this.formatResult(res.result),
              time: moment().format('YYYY-MM-DD HH:mm:ss')
            })
            this.$store.dispatch('setEnvironment', environment).then((res) => {})
          } else {
            let environment = JSON.parse(JSON.stringify(this.environment))
            environment.sandbox.console.data.push({
              status: 'failed',
              result: this.formatResult(res.errorDesc),
              time: moment().format('YYYY-MM-DD HH:mm:ss')
            })
            this.$store.dispatch('setEnvironment', environment).then((res) => {})
          }
        })
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
    closeResult () {
      this.$store.commit('SET_ENVIRONMENT_ISSUERESULT', {type: this.environmentType, value: ''})
    }
  }
}
</script>

<style lang="less" scoped>
.opt-content{
  flex-shrink: 0;
  width: 250px;
  background: #373955;
  margin-top: 3px;
  padding: 0px 20px;
  overflow-y: scroll;
  height: calc(100vh - 63px);
  &::-webkit-scrollbar-track{
    background-color: #373955;
  }
}
.opt-box{
  padding: 20px 0px 10px;
  border-bottom: 1px dashed #999;
  &:last-child{
    border-bottom: none;
  }
}
.opt-box .opt-box-title{font-size: 18px;color: #fff;padding-bottom: 15px;font-weight: normal;}
.opt-box .opt-box-cont p{font-size: 14px;color: #999; word-wrap:break-word;padding-bottom: 10px;}
.opt-box .opt-box-cont .opt-box-btn{margin-top: 10px;}
.issue-contract{
  & .opt-box-btn{
    min-width: 100px;
    font-size: 16px;
    padding: 6px 10px;
  }
  & .issue-result-cont{
    padding-top: 15px;
    & .result-item{
      position: relative;
      padding-right: 25px;
      padding-left: 10px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #fff;
      margin-bottom: 10px;
      border-radius: 3px;
      &.failed{
        background-color: #FF765E;
      }
      &.success{
        background-color: #00D080;
      }
      &>.result-delet{
        position: absolute;
        right: 0px;
        width: 25px;
        text-align: center;
        line-height: 20px;
        top: 0px;
        display: block;
        color: #fff;
        font-size: 16px;
      }
    }
  }
}
.issue-msg{
  & .msg-item{
    margin-bottom: 10px;
    & .msg-title{
      font-size: 14px;
      color: #999;
      margin-bottom: 10px;
    }
    & .msg-info{
      font-size: 14px;
      color: #999;
      word-break: break-word;
    }
  }
}
.invok-cont{
  & .invok-handle{
    margin-top: 20px;
    padding-bottom: 20px;
    & .opt-box-btn{
      min-width: 100px;
      font-size: 16px;
      padding: 6px 10px;
    }
  }
}
</style>
