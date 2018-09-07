<template>
  <div id="content">
    <header>
      收入统计
    </header>
    <header-router>
      <span slot="right">
        {{routerName}}
      </span>
    </header-router>
    <div class="nav-bar-top">
      <el-radio-group v-model="select_type">
        <el-radio-button label="0">今日</el-radio-button>
        <el-radio-button label="1">本周</el-radio-button>
        <el-radio-button label="2">本月</el-radio-button>
        <el-radio-button label="3">本年</el-radio-button>
      </el-radio-group>
    </div>
    <div style="position: relative;width: 800px;margin: 0 auto">
      <div class="line-chart-title">收入单位:元</div>
      <line-chart :data="lineChartData"></line-chart>
    </div>
    <div style="width: 1100px;margin: 0 auto" v-if="listData">
      <div style="line-height: 40px;background: #f1f1f1;padding-left:18px ;">
        {{listData.time_tip}}
      </div>
      <ul v-if="listData">
        <li style="border-bottom: 1px solid #f1f1f1;line-height: 40px" v-for="(item,i) in listData.listDistanceDetail"
            :key="i">
          <div class="flex justify-between">
            <div>
              {{item.pay_time}}  <span style="margin-left: 24px"></span>
              {{item.bike_number}}
            </div>
            <div>+{{item.distance_expense}}</div>
          </div>
        </li>
      </ul>
    </div>
    <div style="line-height: 40px;background: #f1f1f1;padding-left:18px;" v-else>
      暂无记录
    </div>
    <!--<el-dialog title="详情" :visible.sync="dialogTableVisible">-->
    <!--<ul class="item-details">-->
    <!--<li><span>车牌号:</span>{{statistics_detail.bike_number}}</li>-->
    <!--<li><span>使用人:</span>{{statistics_detail.user_name}}</li>-->
    <!--<li><span>手机号:</span>{{statistics_detail.mobile_number}}</li>-->
    <!--<li><span>取车位置:</span>{{statistics_detail.begin_position_name}}</li>-->
    <!--<li><span>还车位置:</span>{{statistics_detail.end_position_name}}</li>-->
    <!--<li><span>取车时间:</span>{{statistics_detail.begin_time}}</li>-->
    <!--<li><span>还车时间:</span>{{statistics_detail.end_time}}</li>-->
    <!--<li><span>费用:</span>{{statistics_detail.distance_expense}} 元</li>-->
    <!--</ul>-->
    <!--</el-dialog>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import LineChart from 'common/header/lineChart';
  import HeaderRouter from 'common/header/header-router';
  import * as USER from "common/js/user";

  export default {
    data() {
      return {
        count: 0,
        page: 1,
        routerName: '→共享无人车→收入统计',
        select_type: 0,
        dialogTableVisible: false,
        statistics_detail: {},
        dayData: [
          {name: '1-3', value: 0, top: 0},
          {name: '4-6', value: 0, top: 0},
          {name: '7-9', value: 0, top: 0},
          {name: '10-12', value: 0, top: 0},
          {name: '13-15', value: 0, top: 0},
          {name: '16-18', value: 0, top: 0},
          {name: '19-21', value: 0, top: 0},
          {name: '22-24', value: 0, top: 0}
        ],
        weekData: [
          {name: '周一', value: 0, top: 0},
          {name: '周二', value: 0, top: 0},
          {name: '周三', value: 0, top: 0},
          {name: '周四', value: 0, top: 0},
          {name: '周五', value: 0, top: 0},
          {name: '周六', value: 0, top: 0},
          {name: '周日', value: 0, top: 0}
        ],
        monthData: [],
        yearData: [],
        apiData: {
          statistics_retrieve_income_day: {time_tip: null}
        }
      };
    },
    computed: {
      lineChartData() {
        if (this.select_type == 0) {
          return this.dayData;
        } else if (this.select_type == 1) {
          return this.weekData;
        } else if (this.select_type == 2) {
          return this.monthData;
        } else if (this.select_type == 3) {
          return this.yearData;
        }
      },
      listData() {
        if (this.select_type == 0) {
          return this.apiData.statistics_retrieve_income_day;
        } else if (this.select_type == 1) {
          return this.apiData.statistics_retrieve_income_week;
        } else if (this.select_type == 2) {
          return this.apiData.statistics_retrieve_income_month;
        } else if (this.select_type == 3) {
          return this.apiData.statistics_retrieve_income_year;
        }
      }

    },
    components: {
      HeaderRouter,
      LineChart
    },
    methods: {
      getTabData() {
        let self = this;
        const data = {
          "lessor_id": localStorage.getItem('lessor_id')
        };
        const url = "wurengongxiangdanche/Statistics/RetrieveListOfIncome";
        const ret = function (r) {
          console.log(r);
          if (r.status === 1) {
            self.apiData = r.data;
            self.day(r.data.statistics_retrieve_income_day);
            self.week(r.data.statistics_retrieve_income_week);
            self.month(r.data.statistics_retrieve_income_month);
            self.year(r.data.statistics_retrieve_income_year);
          } else {
            alert(r.message);
          }
        };
        USER.ajax(url, "GET", data, ret);
      },
      day(list) {
        if (!list) {
          return false;
        } else {
          list.listDistanceDetail.map(v => {
            let hour = parseInt(v.pay_time.split(' ')[1].split(':')[0]);
            if (hour >= 1 && hour <= 3) {
              let val = this.dayData[0].value + v.distance_expense;
              this.$set(this.dayData, 0, {name: '1-3', value: val});
            } else if (hour >= 4 && hour <= 6) {
              let val = this.dayData[1].value + v.distance_expense;
              this.$set(this.dayData, 1, {name: '4-6', value: val});
            } else if (hour >= 7 && hour <= 9) {
              let val = this.dayData[2].value + v.distance_expense;
              this.$set(this.dayData, 2, {name: '7-9', value: val});
            } else if (hour >= 10 && hour <= 12) {
              let val = this.dayData[3].value + v.distance_expense;
              this.$set(this.dayData, 3, {name: '10-12', value: val});
            } else if (hour >= 13 && hour <= 15) {
              let val = this.dayData[4].value + v.distance_expense;
              this.$set(this.dayData, 4, {name: '13-15', value: val});
            } else if (hour >= 16 && hour <= 18) {
              let val = this.dayData[5].value + v.distance_expense;
              this.$set(this.dayData, 5, {name: '16-18', value: val});
            } else if (hour >= 19 && hour <= 21) {
              let val = this.dayData[6].value + v.distance_expense;
              this.$set(this.dayData, 6, {name: '19-21', value: val});
            } else if (hour >= 22 && hour <= 24) {
              let val = this.dayData[7].value + v.distance_expense;
              this.$set(this.dayData, 7, {name: '22-24', value: val});
            }
          });
        }
      },
      week(list) {
        if (!list) {
          return false;
        } else {
          list.listDistanceDetail.map(v => {
            let w = new Date(v.pay_time).getDay();
            if (w == 1) {
              let val = this.weekData[0].value + v.distance_expense;
              this.$set(this.weekData, 0, {name: '周一', value: val});
            } else if (w == 2) {
              let val = this.weekData[1].value + v.distance_expense;
              this.$set(this.weekData, 1, {name: '周二', value: val});
            } else if (w == 3) {
              let val = this.weekData[2].value + v.distance_expense;
              this.$set(this.weekData, 2, {name: '周三', value: val});
            } else if (w == 4) {
              let val = this.weekData[3].value + v.distance_expense;
              this.$set(this.weekData, 3, {name: '周四', value: val});
            } else if (w == 5) {
              let val = this.weekData[4].value + v.distance_expense;
              this.$set(this.weekData, 4, {name: '周五', value: val});
            } else if (w == 6) {
              let val = this.weekData[5].value + v.distance_expense;
              this.$set(this.weekData, 5, {name: '周六', value: val});
            } else if (w == 0) {
              let val = this.weekData[6].value + v.distance_expense;
              this.$set(this.weekData, 6, {name: '周日', value: val});
            }
          });
        }
      },
      month(list) {
        if (!list) {
          return false;
        } else {
          let start = list.time_tip.split('至')[0];
          let y = start.split('年')[0];
          let m = start.split('年')[1].split('月')[0];
          let d = new Date(y, m, 0).getDate();
          for (let i = 0; i < d; i++) {
            this.$set(this.monthData, i, {name: i + 1, value: 0, top: 0});
            list.listDistanceDetail.map(v => {
              let day = new Date(v.pay_time).getDate();
              if (day === i + 1) {
                let val = this.monthData[i].value + v.distance_expense;
                this.$set(this.monthData, i, {name: i + 1, value: val});
              }
            });
          }
        }
      },
      year(list) {
        if (!list) {
          return false;
        } else {
          for (var i = 0; i < 12; i++) {
            this.$set(this.yearData, i, {name: i + 1 + '月', value: 0, top: 0});
            list.listDistanceDetail.map(v => {
              let day = new Date(v.pay_time).getMonth();
              if (day === i) {
                let val = this.yearData[i].value + v.distance_expense;
                this.$set(this.yearData, i, {name: i + 1, value: val});
              }
            });
          }
        }
      }
    },
    mounted() {
      this.getTabData();
    }
  };
</script>

<style scoped lang="less">
  @import '~assets/css/public.less';

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
      top: -2px;
    }
  }

  .content {
    width: 100%;
    height: calc(100% - 85px);
  }

  .table-center {
    position: relative;
    max-height: calc(100% - 185px);
    .title-text {
      padding: 12px;
      border-bottom: @border1px;
      background: #cccccc;
    }
    .item-center {
      padding: 12px;
      border-bottom: @border1px;
    }
    .item-center:hover {
      background: #f1f1f1;
    }
  }

  .item-details {
    li {
      padding: 12px;
      border-bottom: @border1px;
    }
    span {
      width: 80px;
      display: inline-block;
    }
  }

  .paging {
    text-align: center;
    margin-top: 12px;
  }

  .select-time {
    float: right;
    padding: 12px;
    padding-right: 0;
  }

  .nav-bar-top {
    margin-top: 16px;
    text-align: center;
  }

  .line-chart-title {
    position: absolute;
    color: #ccc;
    top: 30px;
    left: 60px;
  }
</style>
