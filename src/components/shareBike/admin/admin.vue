<template>
  <div id="content">
    <header>
      车辆管理
      <div class="right-button">
        <el-select v-model="administrative_region_code" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </header>
    <header-router>
      <span slot="right">
        {{routerName}}
      </span>
      <span slot="left" @click="addBike">
        新增单车
      </span>
    </header-router>
    <el-tabs v-model="bike_status_valid" type="card" @tab-click="handleClick">
      <el-tab-pane label="有效车辆" name="1"></el-tab-pane>
      <el-tab-pane label="报废车辆" name="0"></el-tab-pane>
    </el-tabs>
    <el-table
      :data="tableData"
      :show-header=false
      style="width: 100%">
      <el-table-column
        label="日期"
        width="50">
        <template slot-scope="scope">
          <div style="height: 30px">
            <img style="width: 30px;top: 2px;" src='../../../assets/img/bike-icon.png' alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        prop="bike_number"
        label="车牌号">
      </el-table-column>
      <el-table-column
        width="220"
        prop="create_time"
        label="创建时间">
      </el-table-column>
      <el-table-column
        width="220"
        label="创建人">
        <template slot-scope="scope">
          <span style="color: #cccccc;" v-if="!scope.row.create_user_name">暂无数据</span>
          <span v-else>{{scope.row.create_user_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        label="地址">
        <template slot-scope="scope">
          <div v-if="scope.row.bike_status<4&&scope.row.bike_status>0">
            <el-button @click.native="updateBikeStatus(scope.row.bike_id)" type="primary" size="mini">报废</el-button>
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
        routerName: '→共享单车→车辆管理',
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
          bike_status_valid: this.bike_status_valid,
          pageIndex: page
        };
        const url = "yourengongxiangdanche/Bike/RetrieveListByParms";
        const ret = function (r) {
          if (r.status === 1) {
            self.count = r.data.count;
            self.tableData = r.data.list;
          } else {
            alert(r.message);
          }
        };
        USER.ajax(url, "GET", data, ret);
      },
      addBike() {
        let self = this;
        function inputValidator(num) {
          const reg = /^\+?[1-9][0-9]*$/;
          return reg.test(num);
        }
        this.$prompt('输入车牌号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: inputValidator,
          inputErrorMessage: '请输入数字'
        }).then(({value}) => {
          const data = {
            "administrative_region_code": this.administrative_region_code,
            "bike_number": value
          };
          const url = 'yourengongxiangdanche/Bike/Create';
          const ret = function (r) {
            if (r.status === 1) {
              self.getTabData();
            } else {
              alert(r.message);
            }
          };
          USER.ajax(url, 'POST', data, ret);
        }).catch(() => {
        });
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
