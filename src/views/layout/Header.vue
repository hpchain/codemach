<template>
  <div class="header">
    <wibkit-warn></wibkit-warn>
    <div class="header-cont">
      <img class="header-logo" src="../../assets/CME-logo-01.png" />
      <el-menu v-if="0" class="ops-left"  background-color="#373955" text-color="#fff" active-text-color="#545c64" mode="horizontal">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-location"></i>文件</template>
          <el-menu-item index="1-1">新建文件</el-menu-item>
          <el-menu-item index="1-2">新建文件夹</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-edit"></i>编辑</template>
          <el-menu-item index="2-1">撤销</el-menu-item>
          <el-menu-item index="2-2">查找</el-menu-item>
          <el-menu-item index="2-3">替换</el-menu-item>
          <el-menu-item index="2-4">格式化</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"><i class="el-icon-menu"></i>视图</template>
          <el-menu-item index="3-1">✅控制台</el-menu-item>
          <el-menu-item index="3-2">✅文件树</el-menu-item>
          <el-menu-item index="3-3">✅操作区</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title"><i class="el-icon-rank"></i>动作</template>
          <el-menu-item index="4-1">发布沙箱环境</el-menu-item>
          <el-menu-item index="4-2">发布测试环境</el-menu-item>
          <el-menu-item index="4-3">发布主网环境</el-menu-item>
        </el-submenu>
        <el-menu-item index="5"><i class="el-icon-question"></i>帮助</el-menu-item>
      </el-menu>
      <el-menu class="ops-right" @select="switchEnvironment" background-color="#373955" default-active="sandbox" text-color="#fff" active-text-color="#00D080" mode="horizontal">
        <el-menu-item disabled index="production"><i class="iconfont icon-zhuwanghuanjing"></i>Main net</el-menu-item>
        <el-menu-item disabled index="development"><i class="iconfont icon-ceshihuanjing"></i>Test net</el-menu-item>
        <el-menu-item index="sandbox"><i class="iconfont icon-shaxianghuanjing"></i>Sandbox</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
import wibkitWarn from '@/components/webkitWarn.vue'
export default {
  name: 'Header',
  components: { wibkitWarn },
  data () {
    return {}
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    switchEnvironment (value) {
      this.$emit('switchEnvironment', value)
    }
  }
}
</script>

<style scoped>
  .header{background: #373955;min-height: 60px;}
  .header .header-cont{background: #373955;overflow: auto;}
  .header .header-logo{
    height: 35px;
    float: left;
    position: relative;
    left: 21px;
    top: 11px;
    margin-right: 20px;
  }
  .header .header-logo>img{
    height: 100%;
  }
  .header .header-cont .ops-left{
    float: left;
  }
  .header .header-cont .ops-right{float: right;padding-right: 21px;}
  .header .el-menu--horizontal{border-bottom: none;}
  #app .el-menu--horizontal>.el-submenu .el-submenu__icon-arrow{display: none;}
  .el-menu-item .iconfont{
    font-size: 22px;
    margin-right: 5px;
  }
</style>
