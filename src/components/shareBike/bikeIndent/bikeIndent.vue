<template>
  <div id="content">
    <header>
      订单列表
      <!--<div class="right-button">-->
      <!--<el-select v-model="administrative_region_code" placeholder="请选择">-->
      <!--<el-option-->
      <!--v-for="item in options"-->
      <!--:key="item.value"-->
      <!--:label="item.label"-->
      <!--:value="item.value">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--</div>-->
    </header>
    <header-router>
      <span slot="right">
        {{routerName}}
      </span>
    </header-router>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        width="80"
        prop="bike_number"
        label="车牌号">
      </el-table-column>
      <el-table-column
        width="220"
        prop="begin_position_name"
        align="center"
        label="开始位置">
        <template slot-scope="scope">
          <span style="color: #cccccc;" v-if="!scope.row.begin_position_name">暂无数据</span>
          <span v-else>{{scope.row.begin_position_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="220"
        align="center"
        label="结束位置">
        <template slot-scope="scope">
          <span style="color: #cccccc;" v-if="!scope.row.end_position_name">暂无数据</span>
          <span v-else>{{scope.row.end_position_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        align="center"
        label="开始时间">
        <template slot-scope="scope">
          <span style="color: #cccccc;" v-if="!scope.row.begin_time">暂无数据</span>
          <span v-else>{{scope.row.begin_time}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        align="center"
        label="结束时间">
        <template slot-scope="scope">
          <span style="color: #cccccc;" v-if="!scope.row.end_time">暂无数据</span>
          <span v-else>{{scope.row.end_time}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        align="center"
        label="支付时间">
        <template slot-scope="scope">
          <span style="color: #cccccc;" v-if="!scope.row.pay_time">暂无数据</span>
          <span v-else>{{scope.row.pay_time}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        align="center"
        label="订单号">
        <template slot-scope="scope">
          <span style="color: #cccccc;" v-if="!scope.row.order_number">暂无数据</span>
          <span v-else>{{scope.row.order_number}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="80"
        align="center"
        label="支付费用">
        <template slot-scope="scope">
          <span style="color: #cccccc;" v-if="!scope.row.distance_expense">暂无数据</span>
          <span v-else>{{scope.row.distance_expense}}元</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="行程状态">
        <template slot-scope="scope">
          <div v-if="scope.row.distance_status==1">
            <span>进行中</span>
          </div>
          <div v-if="scope.row.distance_status==2">
            <span style="color:orange;">待支付</span>
          </div>
          <div v-if="scope.row.distance_status==3">
            <span style="color: limegreen;">已完成</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="paging" v-if="count>0">
      <el-pagination
        layout="prev, pager, next"
        :total=count
        :current-page.sync=page
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
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
        routerName: '→共享单车→订单列表',
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
        administrative_region_code: '100000'
      };
    },
    components: {
      HeaderRouter
    },
    methods: {
      getTabData(page) {
        let self = this;
        const data = {
          administrative_region_code: this.administrative_region_code,
          isOneself: 0,
          pageIndex: page
        };
        const url = "yourengongxiangdanche/Distance/RetrieveListByParms";
        const ret = function (r) {
          console.log(r);
          if (r.status === 1) {
            self.count = r.data.count;
            self.tableData = r.data.list;
          } else {
            alert(r.message);
          }
        };
        USER.ajax(url, "GET", data, ret);
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

  .tabContent {
    max-height: calc(100% - 185px);
    li {
      border-bottom: @border1px;
      height: 35px;
      padding: 6px 12px 6px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        img {
          margin-left: 4px;
          width: 30px;
        }
        p {
          margin: 12px 0 12px 12px;
          color: #777;
        }
      }
    }
  }

  .paging {
    text-align: center;
    margin-top: 12px;
  }
</style>
