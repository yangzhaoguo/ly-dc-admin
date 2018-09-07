<template>
  <div id="content">
    <header>
      车辆管理
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
      <span slot="left" @click="addshopDialog=!addshopDialog">
        新增店铺
      </span>
    </header-router>
    <!--<el-tabs v-model="bike_status_valid" type="card" @tab-click="handleClick">-->
    <!--<el-tab-pane label="有效车辆" name="1"></el-tab-pane>-->
    <!--<el-tab-pane label="报废车辆" name="0"></el-tab-pane>-->
    <!--</el-tabs>-->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label=""
        width="80">
        <template slot-scope="scope">
          <div>
            <img style="width: 50px;height: 50px;top: 2px;" :src='scope.row.image_path' :onerror="errImg" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="220"
        label="分店名">
        <template slot-scope="scope">
          <span style="color: #cccccc;" v-if="!scope.row.branch_store_name">暂无数据</span>
          <span v-else>{{scope.row.branch_store_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="220"
        prop="create_time"
        label="创建时间">
      </el-table-column>
      <el-table-column
        width="220"
        prop="branch_store_address"
        label="分店地址">
      </el-table-column>
      <el-table-column
        align="right"
        label="">
        <template slot-scope="scope">
          <div>
            <el-button @click.native="goShopItem(scope.row.branch_store_id)" type="primary" size="mini">进入店铺</el-button>
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
    <el-dialog
      title="新增店铺"
      :visible.sync="addshopDialog"
      width="508px">
      <div>
        <div class="flex addShop">
          <uploadImg :imagelist="imagelist"></uploadImg>
        </div>
        <div class="flex addShop">
          <span class="title">店铺名称：</span>
          <el-input
            placeholder="请输入内容"
            v-model.trim="addShopData.branch_store_name">
          </el-input>
        </div>

        <div class="flex addShop">
          <span class="title">店铺位置：</span>
          <el-input
            v-model="shopPositionName"
            @focus="showMap=true"
            placeholder="地图选址">
          </el-input>
        </div>

        <div class="flex addShop">
          <span class="title">具体地址：</span>
          <el-input
            placeholder="请输入内容"
            v-model.trim="addShopData.branch_store_address">
          </el-input>
        </div>

        <div class="flex addShop">
          <span class="title">备注：</span>
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 3}"
            placeholder="请输入内容"
            v-model.trim="addShopData.remark">
          </el-input>
        </div>
        <div style="text-align: right">
          <el-button @click.native="addShop" type="primary">新增店铺</el-button>
        </div>
      </div>
    </el-dialog>
    <transition name="slide-fade">
      <SelectPosition style="z-index: 9999"
                      v-if="showMap"
                      :shopPositionName.sync="shopPositionName"
                      :lat.sync="addShopData.latitude"
                      :showMap.sync="showMap"
                      :lng.sync="addShopData.longitude">
      </SelectPosition>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderRouter from 'common/header/header-router';
  import SelectPosition from 'common/selectPosition/selectPosition';
  import UploadImg from 'common/uploadFile/uploadFile';
  import * as USER from "common/js/user";
  import errImg from "../../assets/img/error-img.png";

  export default {
    data() {
      return {
        imagelist: [],
        addshopDialog: false,
        showMap: false,
        itemDetailDialog: true,
        errImg: 'this.src="' + errImg + '"',
        count: 0,
        page: 1,
        bike_status_valid: "1",
        routerName: '→共享单车→店面管理',
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
        position: null,
        administrative_region_code: '100000',
        addShopData: {
          "branch_store_address": "",
          "branch_store_name": "",
          "image_path": "",
          "lease_firm_id": "57a0136259242e1cd867f28e",
          "latitude": "",
          "longitude": "",
          "remark": ""
        },
        shopPositionName: ''
      };
    },
    computed: {},
    methods: {
      getTabData(page) {
        let self = this;
        const data = {
          lease_firm_id: '57a0136259242e1cd867f28e',
          pageIndex: page
        };
        const url = "wurengongxiangdanche/BranchStore/RetrieveListByLeaseFirmId";
        const ret = function (r) {
          console.log(r);
          self.tableData = r.data.list;
        };
        USER.ajax(url, "GET", data, ret);
      },
      addShop() {
        let self = this;
        let list = [];
        this.imagelist.forEach(e => {
          list.push(e.url);
        });
        let data = self.addShopData;
        data.image_path = list.join(',');
        for (const key in data) {
          if (data[key] === "") {
            alert('请填写详细信息');
            return;
          }
        }

        const url = 'wurengongxiangdanche/BranchStore/Create';
        const ret = function (r) {
          if (r.status === 1) {
            self.getTabData();
          } else {
            alert(r.message);
          }
        };
        USER.ajax(url, 'POST', data, ret);
      },
      handleClick(e) {
        this.count = 0;
        this.getTabData();
      },
      handleCurrentChange(page) {
        this.getTabData(page);
      },
      goShopItem(lessorId) {
        localStorage.setItem('lessor_id', lessorId);
        this.$router.push({name: 'wradmin'});
      }
    },
    mounted() {
      this.getTabData();
    },
    watch: {
      administrative_region_code(e) {
        this.getTabData();
      }
    },
    components: {
      HeaderRouter,
      UploadImg,
      SelectPosition
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

  .addShop {
    margin-bottom: 12px;
    .title {
      width: 100px;
      line-height: 34px;
    }
  }

  .paging {
    text-align: center;
    margin-top: 12px;
  }
</style>
