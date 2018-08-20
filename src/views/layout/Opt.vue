<template>
  <div class="opt-content">
    <div class="opt-wraper">
      <div class="opt-box issue-contract">
        <h3 class="opt-box-title">发布者</h3>
        <div class="opt-box-cont">
          <p>buQtEJrkWPuaJFLto3Cnky794mKjeb3CB8Dt</p>
          <p>10.99929292BU</p>
        </div>
      </div>
      <div class="opt-box issue-contract">
        <h3 class="opt-box-title">发布合约</h3>
        <div class="opt-box-cont">
          <p>将编写好的合约发布到沙箱环境</p>
          <el-button class="opt-box-btn" size="small" type="primary">发布</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Opt'
}
</script>

<style scoped>
  .opt-content{flex-shrink: 0;width: 200px;background: #373955;margin-top: 3px;}{}
  .opt-box{padding: 10px;}
  .opt-box .opt-box-title{font-size: 14px;color: #fff;padding-bottom: 15px;}
  .opt-box .opt-box-cont p{font-size: 12px;color: #fff;opacity: 0.5;word-wrap:break-word;padding-bottom: 5px;}
  .opt-box .opt-box-cont .opt-box-btn{margin-top: 19px;}
</style>
