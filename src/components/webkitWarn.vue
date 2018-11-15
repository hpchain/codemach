<template>
<div>
  <div v-if="showWebkitWarn" class="webkit-warning">
    <div class="wrap warning-cont">
      <i class="el-icon-warning"></i>We recommend using Chrome or Safari.
      <a href="javascript:;" @click="closeWarn()" class="btn-close"><i class="el-icon-circle-close-outline"></i></a>
    </div>
  </div>
</div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
export default {
  name: 'webkitWarn',
  data () {
    return {}
  },
  mounted () {
    this.initWarn()
  },
  created () {},
  computed: {
    ...mapGetters([
      'showWebkitWarn'
    ])
  },
  methods: {
    BrowserType() {
      var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串  
      var isOpera = userAgent.indexOf("Opera") > -1; // 判断是否Opera浏览器  
      var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; // 判断是否IE浏览器  
      var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; // 判断是否IE的Edge浏览器  
      var isFF = userAgent.indexOf("Firefox") > -1; // 判断是否Firefox浏览器  
      var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; // 判断是否Safari浏览器  
      var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; // 判断Chrome浏览器  
      if(isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if(fIEVersion == 7) {
          return "IE7";
        } else if(fIEVersion == 8) {
          return "IE8";
        } else if(fIEVersion == 9) {
          return "IE9";
        } else if(fIEVersion == 10) {
          return "IE10";
        } else if(fIEVersion == 11) {
          return "IE11";
        } else {
          return "0"
        } // IE版本过低  
      } // isIE end  
      if(isFF) {
        return "FF";
      }
      if(isOpera) {
        return "Opera";
      }
      if(isSafari) {
        return "Safari";
      }
      if(isChrome) {
        return "Chrome";
      }
      if(isEdge) {
        return "Edge";
      } else {
        return "-1" // 无法识别
      }
    },
    closeWarn () {
      this.$store.commit('SET_WEBKITWARN_STATE', false)
    },
    initWarn () {
      var browserType = this.BrowserType()
      console.log(browserType)
      if (browserType === 'Chrome' || browserType === 'Safari') {
        this.$store.commit('SET_WEBKITWARN_STATE', false)
      } else {
        this.$store.commit('SET_WEBKITWARN_STATE', true)
      }
    }
  }
}
</script>

<style scoped lang="less">
.webkit-warning{
  height: 40px;
  line-height: 40px;
  background: #FFE99A;
  font-size: 14px;
  color: #F56323;
  & .warning-cont{
    text-align: center;
    width: 1200px;
    margin: 0 auto;
    & .el-icon-warning{
      margin-right: 5px;
      font-size: 16px;
    }
    & .btn-close{
      float: right;
      &>i{
        color: #F56323;
        font-size: 18px;
      }
    }
  }
}
</style>
