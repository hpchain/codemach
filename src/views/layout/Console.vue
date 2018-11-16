<template>
    <div class="console">
      <ul class="console-list">
        <li class="console-item" :key="index" v-for="(item, index) in consoleData">
          <div class="item-top" :class="item.status">
            <div class="item-time">{{item.time}}</div>
            <div class="item-action-status">{{item.action}} {{item.status}}</div>
          </div>
          <div class="printinfo-list">
            <div class="print-item clearfix" :class="print.title" :key="printIndex" v-for="(print, printIndex) in item.printInfoList">
              <div class="print-title fl">{{print.title}}</div>
              <div class="print-dec fl">{{print.dec}}</div>
            </div>
          </div>
          <div class="item-raw">
            <div class="raw-switch-btn-cont">
              <a href="javascript:;" @click="switchShowRawContent(index)" class="raw-btn">{{item.showRaw ? 'Close source data' : 'Show source data'}}</a>
            </div>
            <div class="raw-cont" v-show="item.showRaw">
              <div :key="ins" v-for="(inner, ins) in item.raw" class="raw-item">
                <div class="title">{{inner.title}}</div>
                <div class="detail" v-html="beautyJson(inner.detail)"></div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import codeBeautify from '../../tools/codeBeautify.js'
export default {
  name: 'Console',
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'activeEnvironment',
      'environment'
    ]),
    consoleData () {
      return this.activeEnvironment.console.data
    }
  },
  created () {},
  mounted () {},
  methods: {
    beautyJson (value) {
      if (value === null || typeof value === 'undefined') {
        return ''
      } else {
        return '<pre><code class="json">' + codeBeautify.jsBeautify(value) + '</code></pre>'
      }
    },
    switchShowRawContent (index) {
      let environment = JSON.parse(JSON.stringify(this.environment))
      for (let i = 0; i < environment.sandbox.console.data.length; i++) {
        if (i !== index) {
          environment.sandbox.console.data[i].showRaw = false
        }
      }
      environment.sandbox.console.data[index].showRaw = !environment.sandbox.console.data[index].showRaw
      this.$store.dispatch('setEnvironment', environment).then((res) => {})
    }
  },
  watch: {
    consoleData: {
      handler (newValue, oldValue) {
        this.$nextTick(() => {
          if (newValue.length !== oldValue.length) {
            var conDom = document.querySelector('.console')
            conDom.scrollTop = conDom.scrollHeight
          }
        })
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="less">
  .console{
    height: 20%;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: #383956;
    padding: 10px;
    box-sizing: border-box;
    z-index: 10;
    flex-shrink: 0;
    overflow-y: auto;
    &::-webkit-scrollbar-track{
      background-color: #373955;
    }
  }
  .console-list{
    padding-bottom: 45px;
    color: #ccc;
    & .console-item{
      margin-bottom: 10px;
      font-size: 12px;
      border-bottom: 1px solid #24253C;
      & .item-top{
        line-height: 20px;
        & .item-time{
          color: #666;
        }
        &.failed{
          & .item-action-status{
            color: red;
          }
        }
      }
      & .printinfo-list{
        padding-left: 30px;
        line-height: 20px;
        & .print-item{
          display: flex;
          & .print-title{
            padding-right: 20px;
            flex-shrink: 0;
            color: #68e600;
          }
          & .print-dec{
            flex-grow: 1;
          }
          &.Error{
            & .print-title{
              color: red;
            }
            & .print-dec{
              color: red;
            }
          }
          &.Exception{
            & .print-title{
              color: #e6a23c;
            }
            & .print-dec{
              color: #e6a23c;
            }
          }
        }
      }
      & .item-raw{
        padding: 10px 30px;
        & .raw-btn{
          text-decoration: underline;
          color: #0B97C4;
        }
        & .raw-cont{
          margin-top: 10px;
          padding: 10px;
          border-radius: 5px;
          background: #24253C;
          overflow: auto;
          word-break: break-all;
          transition: all 0.2s ease;
        }
      }
      &:last-child{
        border-bottom: none;
      }
    }
  }
</style>
