<template>
  <div id="content">
    <header>
      订单列表
    </header>
    <header-router>
      <span slot="right">
        {{routerName}}
      </span>
      <!--<span slot="left" @click="addBike">-->
      <!--新增单车-->
      <!--</span>-->
    </header-router>
    <ul class="table-center">
      <li v-for="(list,index) in tableData" :key="index">
        <div class="title-text flex justify-between">
          <p>{{list.month}}月份</p>
          <p>收入:<span style="color: red;">{{list.income}}</span>元</p>
        </div>
        <ul v-for="(item,i) in list.listDistanceDetail" :key="i" class="item-center"
            @click="showItem(item.distance_id)">
          <li class="flex justify-between">
            <p style="width: 180px">车牌号:{{item.bike_number}}</p>
            <p style="width: 180px">收入:{{item.distance_expense}}</p>
            <p style="flex: 1;text-align: right">支付时间:{{item.pay_time}}</p>
          </li>
        </ul>
      </li>
    </ul>

    <el-dialog title="详情" :visible.sync="dialogTableVisible">
      <ul class="item-details">
        <li><span>车牌号:</span>{{statistics_detail.bike_number}}</li>
        <li><span>使用人:</span>{{statistics_detail.user_name}}</li>
        <li><span>手机号:</span>{{statistics_detail.mobile_number}}</li>
        <li><span>取车位置:</span>{{statistics_detail.begin_position_name}}</li>
        <li><span>还车位置:</span>{{statistics_detail.end_position_name}}</li>
        <li><span>取车时间:</span>{{statistics_detail.begin_time}}</li>
        <li><span>还车时间:</span>{{statistics_detail.end_time}}</li>
        <li><span>费用:</span>{{statistics_detail.distance_expense}} 元</li>
      </ul>
    </el-dialog>

    <!--<div class="paging" v-if="count>0">-->
    <!--<el-pagination-->
    <!--layout="prev, pager, next"-->
    <!--:total=count-->
    <!--:current-page.sync=page-->
    <!--@current-change="handleCurrentChange">-->
    <!--</el-pagination>-->
    <!--</div>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderRouter from 'common/header/header-router';
  import * as USER from "common/js/user";

  export default {
    data() {
      return {
        count: 0,
        page: 1,
        bike_status_valid: "1",
        routerName: '→共享单车→收入统计',
        options: [{
          value: '100000',
          label: '北京'
        }, {
          value: '200000',
          label: '上海'
        }, {
          value: '510000',
          label: '广州'
        }],
        tableData: [],
        administrative_region_code: '100000',
        dialogTableVisible: false,
        statistics_detail: {}
      };
    },
    components: {
      HeaderRouter
    },
    methods: {
      getTabData() {
        let self = this;
        const data = {
          administrative_region_code: this.administrative_region_code,
          bike_status_valid: this.bike_status_valid
        };
        const url = "yourengongxiangdanche/Statistics/RetrieveListOfIncome";
        const ret = function (r) {
          console.log(r);
          if (r.status === 1) {
            self.tableData = r.data;
          } else {
            alert(r.message);
          }
        };
        USER.ajax(url, "GET", data, ret);
      },
      showItem(id) {
        let self = this;
        const data = {
          distance_id: id
        };
        const url = 'yourengongxiangdanche/Statistics/RetrieveDetailOfIncomeByDistanceId';
        const ret = function (r) {
          if (r.status === 1) {
            self.statistics_detail = r.data;
            self.dialogTableVisible = true;
          } else {
            alert(r.message);
          }
        };
        USER.ajax(url, 'GET', data, ret);
      },
      handleClick(e) {
        this.count = 0;
        this.getTabData();
      },
      handleCurrentChange(page) {
        this.getTabData(page);
      },
      updateBikeStatus(id) {
        let self = this;
        this.$confirm('此单车将被报废, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const url = "yourengongxiangdanche/Bike/UpdateBikeStatus";
          const data = {
            bike_id: id
          };
          const ret = function (r) {
            if (r.status === 1) {
              self.tableData = self.tableData.filter((i) => {
                return i.bike_id !== id;
              });
            } else {
              alert(r.message);
            }
          };
          USER.ajax(url, "GET", data, ret);
        }).catch(() => {
        });
      }
    },
    mounted() {
      this.getTabData();
    },
    watch: {
      administrative_region_code(e) {
        this.getTabData();
      }
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
</style>
