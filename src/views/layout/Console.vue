<template>
    <div class="console">
      <ul class="console-list">
        <li class="console-item" :key="index" v-for="(item, index) in consoleData">
          <div class="item-title clearfix" :class="item.status">
            <span class="title-status fl">{{item.status}}</span>
            <span class="item-time fr">{{item.time}}</span>
          </div>
          <div class="item-dec">
            <div :key="ins" v-for="(inner, ins) in item.result" class="dec-item">
              <div class="title">{{inner.title}}</div>
              <div class="detail" v-html="beautyJson(inner.detail)"></div>
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
      'activeEnvironment'
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
    }
  },
  watch: {
    consoleData: {
      handler (newValue, oldValue) {
        this.$nextTick(() => {
          if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
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
    & .console-item{
      margin-bottom: 10px;
      font-size: 12px;
      border-bottom: 1px solid #24253C;
      & .item-title{
        line-height: 20px;
        &.success{
          color: #00AA00;
        }
        &.failed{
          color: #CC0000;
        }
        & .item-time{
          color: #999;
        }
      }
      & .item-dec{
        padding-left: 30px;
        color: #fff;
        & .dec-item{
          & .title{
            margin-top: 12px;
            font-size: 14px;
          }
        }
      }
      &:last-child{
        border-bottom: none;
      }
    }
  }
</style>
