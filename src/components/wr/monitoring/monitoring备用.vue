<template>
  <div id="">
    <header>
      收入统计
      <!--<span @click="map=!map" class="right-button">切换</span>-->
    </header>
    <header-router>
      <span slot="right">
        {{routerName}}
      </span>
    </header-router>

    <div class="block">
      <el-date-picker
        v-model="value7"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions2">
      </el-date-picker>
    </div>
    <el-radio-group class="radio-outer" v-model="radio3" @change="upData">
      <div>
        <el-radio-button label="今日"></el-radio-button>
      </div>
      <div>
        <el-radio-button label="本周"></el-radio-button>
      </div>
      <div>
        <el-radio-button label="本月"></el-radio-button>
      </div>
      <div>
        <el-radio-button label="本年"></el-radio-button>
      </div>
    </el-radio-group>
    <div class="title-time">当前时间 {{time}}</div>
    <line-chart :showData="showData"></line-chart>
    <div class="Analysis">
      <div class="AnalysisOne">
        <p><span>时间:2016年6月20日至24日</span><span>收入:￥{{week}}</span></p>
      </div>
      <div class="AnalysisTwo" v-for="(item, key) in showData" :key="key">
        <div class="layered">
          <div class="layeredOne">
            <p>收入-分享文章</p>
            <p>2016-06-24 12:00</p>
          </div>
          <div class="layeredTwo">
            <p>
              <span>+200</span>
              <span>1000</span>
            </p>
            <p>›</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderRouter from 'common/header/header-router';
  import LineChart from 'common/header/lineChart';
  import * as USER from "common/js/user";

  export default {
    data() {
      return {
        active: '0',
        time: USER.getNowFormatDate(),
        routerName: '→共享单车→收入统计',
        radio3: '今日',
        sum: 0,
        showData: [
          {name: '早上', value: 5},
          {name: '中午', value: 14},
          {name: '晚上', value: 13}
        ],
        data2: [
          {name: '周一', value: 2},
          {name: '周二', value: 2.9},
          {name: '周三', value: 5},
          {name: '周四', value: 6.1},
          {name: '周五', value: 7.6},
          {name: '周六', value: 7},
          {name: '周日', value: 7.9}
        ],
        data3: [
          {name: '第一周', value: 3},
          {name: '第二周', value: 2.9},
          {name: '第三周', value: 7},
          {name: '第四周', value: 6.1}
        ],
        data4: [
          {name: '一月', value: 3},
          {name: '二月', value: 2.9},
          {name: '三月', value: 4},
          {name: '四月', value: 6.1},
          {name: '五月', value: 7},
          {name: '六月', value: 6.5},
          {name: '七月', value: 7.1},
          {name: '八月', value: 9.1},
          {name: '九月', value: 10},
          {name: '十月', value: 9.9},
          {name: '十一月', value: 10.6},
          {name: '十二月', value: 11}
        ],
        data5: [
          {name: '早上', value: 5},
          {name: '中午', value: 14},
          {name: '晚上', value: 13}
        ]
      };
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleClick(v) {
        console.log(v);
      },
      setIntervalTime() {
        setInterval(() => {
          this.time = USER.getNowFormatDate();
        }, 1000);
      },
      upData() {
        if (this.radio3 === '本周') {
          if (this.showData !== this.data2) {
            this.showData = this.data2;
          }
        } else if (this.radio3 === '本月') {
          if (this.showData !== this.data3) {
            this.showData = this.data3;
          }
        } else if (this.radio3 === '本年') {
          if (this.showData !== this.data4) {
            this.showData = this.data4;
          }
        } else if (this.showData !== this.data5) {
          this.showData = this.data5;
        }
      }
    },
    components: {
      HeaderRouter,
      LineChart
    },
    computed: {
      week() {
        let aaa = 0;
        this.showData.forEach((item) => {
          aaa = aaa + item.value;
        });
        return aaa;
      }
    },
    mounted() {
      this.setIntervalTime();
    }
  };
</script>

<style scoped lang="less">
  @import '~assets/css/public.less';

  #content {
    height: 100%;
  }

  header {
    position: relative;
    height: 48px;
    line-height: 48px;
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

  .title-time {
    text-align: center;
    color: #777777;
    line-height: 60px;
  }

  .radio-outer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .AnalysisTwo {
    width: 100%;
    display: flex;
    justify-content: center;
    font-size: 16px;
    .layered {
      width: 50%;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ccc;
      margin-bottom: 10px;
      .layeredTwo {
        display: flex;
        width: 12%;
        justify-content: space-around;
        p:nth-child(1) {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          span:nth-child(1) {
            color: rgb(4, 86, 153);
          }
        }
        p:nth-child(2) {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .AnalysisOne {
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      width: 50%;
      display: flex;
      justify-content: space-between;
      color: rgba(73, 73, 73, 0.63);
      font-size: 18px;
      background-color: #ccc;
      margin-bottom: 10px;
    }
  }
</style>
