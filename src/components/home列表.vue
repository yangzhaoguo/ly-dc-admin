<template>
  <div id="">
    <header>
      首页
      <span class="right-button">切换</span>
    </header>
    <header-router>
      <span slot="right">
        →共享单车→单车管理
      </span>
      <span slot="left">新增店面</span>
    </header-router>
    <div class="content">
      <ul>
        <li class="flex justify-between">
          <div class="flex">
            <img src="../assets/img/bike-icon.png" alt="">
            <div class="flex item-text">
              <div>大望路店</div>
              <div>朝阳区大望路18号</div>
            </div>
          </div>
          <div class="time">2017-12-12 10:00:00</div>
        </li>
        <li class="flex justify-between">
          <div class="flex">
            <img src="../assets/img/bike-icon.png" alt="">
            <div class="flex item-text">
              <div>大望路店</div>
              <div>朝阳区大望路18号</div>
            </div>
          </div>
          <div class="time">2017-12-12 10:00:00</div>
        </li>
        <li class="flex justify-between">
          <div class="flex">
            <img src="../assets/img/bike-icon.png" alt="">
            <div class="flex item-text">
              <div>大望路店</div>
              <div>朝阳区大望路18号</div>
            </div>
          </div>
          <div class="time">2017-12-12 10:00:00</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderRouter from 'common/header/header-router';

  export default {
    data() {
      return {};
    },
    methods: {

    },
    components: {
      HeaderRouter
    }
  };
</script>

<style scoped lang="less">
  @import '~assets/css/public.less';

  header {
    position: relative;
    height: 42px;
    line-height: 42px;
    text-align: center;
    background: @mainColor;
    color: #ffffff;
    font-size: 18px;
    .right-button {
      position: absolute;
      right: 14px;
      top: 0;
      font-size: 13px;
    }
  }

  .content {
    color: #555;
    border: @border1px;
    border-top: 0;
    min-height: 800px;
    height: 800px;
    ul {
      padding: 0 6px 0 6px;
      li {
        border-bottom: @border1px;
        > div {
          height: 80px;
          padding: 10px;
          img {
            height: 60px;
            width: 60px;
            margin: auto;
          }
        }
        .item-text {
          padding: 12px;
          flex-direction: column;
          justify-content: space-between;
        }
        .time {
          display: flex;
          flex-direction: column-reverse;
        }
      }
    }
  }
</style>
