<template>
  <div id="content">
    <header>
      车辆报修
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
    </header-router>
    <el-tabs v-model="activeType" type="card" @tab-click="handleClick">
      <el-tab-pane label="待处理" name="0"></el-tab-pane>
      <el-tab-pane label="已处理" name="1"></el-tab-pane>
      <el-tab-pane label="已挂起" name="2"></el-tab-pane>
    </el-tabs>
    <el-table
      :data="tableList"
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
        prop="repair_description"
        label="报修地点">
      </el-table-column>
      <el-table-column
        width="220"
        prop="repair_create_time"
        label="报修时间">
      </el-table-column>
      <el-table-column
        align="right"
        label="详情">
        <template slot-scope="scope">
          <div>
            <el-button @click.native="itemDetails(scope.row)" type="primary" size="mini">查看详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="paging" v-if="count>0">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total=count>
      </el-pagination>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="itemDetailDialog"
      width="500px">
      <div class="dialog-item" style="font-size: 16px;line-height: 32px">
        <div><span>车牌号:</span>{{tableItem.bike_number}}</div>
        <div><span>车辆位置:</span>{{tableItem.bike_position_name}}</div>
        <div><span>故障:</span>{{tableItem.repair_type_name}}</div>
        <div><span>报修人:</span>{{tableItem.repair_user_name}}</div>
        <div><span>报修时间:</span>{{tableItem.repair_create_time}}</div>
        <div><span>处理人:</span>{{tableItem.treat_user_name}}</div>
        <div><span>处理时间:</span>{{tableItem.treat_create_time}}</div>
        <div class="flex">
          <span>处理描述:</span>
          <div style="flex:1" v-if="activeType==='0'||activeType==='2'">
            <el-input
              type="textarea"
              resize="none"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="itemDetailsText">
            </el-input>
          </div>
          <div v-else>
            {{ tableItem.treat_description }}
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" v-if="activeType==='0'||activeType==='2'">
        <el-button type="primary" @click="upDateTreat(1)">处 理</el-button>
        <el-button type="danger" @click="upDateTreat(2)">挂 起</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
</style>
<script type="text/ecmascript-6">
  import HeaderRouter from 'common/header/header-router';
  import * as USER from "common/js/user";

  export default {
    data() {
      return {
        count: 0,
        routerName: '→共享单车→车辆报修',
        activeType: '0',
        tableList: [],
        tableItem: {},
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
        administrative_region_code: '100000',
        itemDetailDialog: false,
        itemDetailsText: ""
      };
    },
    components: {
      HeaderRouter
    },
    methods: {
      addBike() {
        this.$prompt('输入车牌号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          console.log(value);
        }).catch(() => {
        });
      },
      handleClick(e) {
        console.log(this.activeType);
        this.count = 0;
        this.getBikeList();
      },
      itemDetails(item) {
        console.log(item);
        this.tableItem = item;
        this.itemDetailDialog = true;
      },
      handleCurrentChange(page) {
        this.getBikeList(page);
      },
      getBikeList(page) {
        let self = this;
        const data = {
          administrative_region_code: this.administrative_region_code,
          repair_treat_status: this.activeType,
          pageIndex: page
        };
        const url = 'yourengongxiangdanche/RepairTreat/RetrieveListByParms';
        const ret = function (r) {
          console.log(r);
          if (r.status === 1) {
            self.tableList = r.data.list;
            self.count = r.data.count;
          } else {
            alert(r.retMsg);
          }
        };
        USER.ajax(url, 'GET', data, ret);
      },
      upDateTreat(type) {
        let self = this;
        const data = {
          "repair_treat_id": this.tableItem.repair_treat_id,
          "repair_treat_status": type,
          "treat_description": this.itemDetailsText
        };
        const url = 'yourengongxiangdanche/RepairTreat/UpdateTreat';
        const ret = function (r) {
          if (r.status === 1) {
            self.tableList = self.tableList.filter(function (i) {
              return i.repair_treat_id !== self.tableItem.repair_treat_id;
            });
            self.itemDetailDialog = false;
          } else {
            alert(r.message);
          }
        };
        USER.ajax(url, 'POST', data, ret);
      }
    },
    mounted() {
      this.getBikeList();
    },
    watch: {
      administrative_region_code() {
        this.getBikeList();
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
      top: 0;
      font-size: 13px;
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
      .item {
        display: flex;
        align-items: center;
        img {
          width: 30px;
        }
        p {
          margin: 12px 0 12px 12px;
          color: #777;
        }
      }
    }
  }

  .dialog-item {
    span {
      width: 120px;
      display: inline-block;
      padding-left: 6px;
    }
  }

  .paging {
    text-align: center;
    margin-top: 12px;
  }
</style>
