<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  };
</script>
<style lang="less">
  @import 'assets/css/reset.css';
  @import 'assets/css/fonts.css';
  @import 'assets/css/style.css';
  @import '~assets/css/public.less';

  #app {
    min-width: 1024px;
    margin: 0 auto;
  }

  #header .el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
  }

  .el-tabs__item.is-active {
    background: @mainColor;
    color: #fff;
  }

  .el-tabs__header {
    margin-bottom: 0;
  }
</style>
