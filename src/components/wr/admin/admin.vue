<template>
  <div id="content">
    <header>
      车辆管理
      <span @click="map=!map" class="right-button">切换</span>
    </header>
    <header-router>
      <span slot="right">
        {{routerName}}
      </span>
      <span slot="left" @click="openAddbike()" style="cursor:pointer;">
        新增单车
      </span>
      <!--<span slot="left" @click="getStopList" style="cursor:pointer;">-->
      <!--收车管理-->
      <!--</span>-->
      <span slot="left">
        <router-link :to="{name:'wrmonitoring'}">收入统计</router-link>
      </span>
      <span slot="left">
        <router-link :to="{name:'WrIndent'}"> 订单管理</router-link>
      </span>
    </header-router>
    <!--<el-tabs v-model="bike_status_valid" type="card" @tab-click="handleClick">-->
    <!--<el-tab-pane label="有效车辆" name="1"></el-tab-pane>-->
    <!--<el-tab-pane label="报废车辆" name="0"></el-tab-pane>-->
    <!--</el-tabs>-->
    <div v-show="map">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label=""
          width="120">
          <template slot-scope="scope">
            <img style="width: 70px;" :src='scope.row.image_path' :onerror="errImg" alt="">
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          prop="bike_name"
          label="单车名称">
        </el-table-column>
        <el-table-column
          width="120"
          prop="bike_number"
          label="车牌号码">
        </el-table-column>
        <el-table-column
          width="220"
          prop="create_time"
          label="创建时间">
        </el-table-column>
        <el-table-column
          width="220"
          label="当前停车场">
          <template slot-scope="scope">
            <span v-if="scope.row.car_park_name">{{scope.row.car_park_name}}</span>
            <span v-else>未停发在停车场</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.bike_status===1">
              空闲
            </div>
            <div v-if="scope.row.bike_status===2" style="color: orange;">
              使用中
            </div>
            <div v-if="scope.row.bike_status===3" style="color: red;">
              已保修
            </div>
            <div v-if="scope.row.bike_status===4" style="color: gray;">
              已报废
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="90"
          align="right"
          label="">
          <template slot-scope="scope">
            <el-button @click.native="shouCheGuanLi=true" type="primary" size="small">调度</el-button>
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
    <div id="mapCentent" class="content" v-show="!map"></div>
    <el-dialog
      title="新增单车"
      :visible.sync="addCar"
      width="508px">
      <div>
        <div class="flex addShop">
          <uploadImg :imagelist="imagelist"></uploadImg>
        </div>
        <div class="flex addShop">
          <span class="title">行政编码：</span>
          <el-input
            placeholder="请输入内容"
            v-model.trim="bike_create.administrative_region_code">
          </el-input>
        </div>
        <div class="flex addShop">
          <span class="title">单车名称：</span>
          <el-input
            placeholder="请输入内容"
            v-model.trim="bike_create.bike_name">
          </el-input>
        </div>
        <div class="flex addShop">
          <span class="title">单车牌号：</span>
          <el-input
            placeholder="请输入内容"
            v-model.trim="bike_create.bike_number">
          </el-input>
        </div>
        <div class="flex addShop">
          <span class="title">停车场：</span>
          <el-select style="width: 100%" v-model="bike_create.car_park_id" placeholder="请选择"
                     @visible-change="getStopList()">
            <el-option
              v-for="item in shopList"
              :key="item.car_park_id"
              :label="item.car_park_name"
              :value="item.car_park_id">
            </el-option>
          </el-select>
        </div>
        <div style="text-align: right">
          <el-button @click.native="postAddBike" type="primary">新增单车</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="收车管理"
      :visible.sync="shouCheGuanLi"
      width="508px">
      <div style="text-align: right;margin-top: -30px">
        <el-button @click="innerShouCheGuanLi = true;" type="primary">新增停车场</el-button>
      </div>
      <div style="min-height: 200px;max-height: 400px;overflow: auto;margin-top: 10px">
        <div v-for="item in shopList" :key="item.car_park_id" style="padding: 8px; overflow:hidden">
          <el-radio v-model="car_park_id" :label="item.car_park_id">{{item.car_park_name}}-{{item.car_park_address}}
          </el-radio>
        </div>
        <el-dialog
          width="50%"
          title="新增停车场"
          :visible.sync="innerShouCheGuanLi"
          append-to-body>
          <div class="flex addShop">
            <span class="title" style="width: 130px">停车场地址：</span>
            <el-input
              placeholder="选择地址"
              @focus="showMap=true"
              v-model.trim="addstop.car_park_address">
            </el-input>
          </div>
          <div class="flex addShop">
            <span class="title" style="width: 130px">停车场名字：</span>
            <el-input
              placeholder="请输入内容"
              v-model.trim="addstop.car_park_name">
            </el-input>
          </div>
          <div style="text-align: right">
            <el-button @click="addStopFun()" type="primary">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <div style="text-align: right;margin-top: 12px">
        <el-button @click.native="createOfManual(1)" type="primary">手动调度</el-button>
        <el-button @click.native="createOfManual(2)" type="primary">自动调度</el-button>
      </div>
    </el-dialog>
    <transition name="slide-fade">
      <selectMap style="z-index: 9999"
                 v-if="showMap"
                 :shopPositionName.sync="addstop.car_park_address"
                 :lat.sync="addstop.latitude"
                 :showMap.sync="showMap"
                 :lng.sync="addstop.longitude">
      </selectMap>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderRouter from 'common/header/header-router';
  import * as USER from "common/js/user";
  import UploadImg from 'common/uploadFile/uploadFile';
  import selectMap from 'common/selectPosition/selectPosition';
  import errImg from "../../../assets/img/car-icon.png";

  let gdmap, markers;
  export default {
    data() {
      return {
        map: true,
        count: 0,
        page: 1,
        bike_status_valid: "1",
        routerName: '→共享单车→车辆管理',
        tableData: [],
        imagelist: [],
        shopList: [],
        addCar: false,
        shouCheGuanLi: false,
        innerShouCheGuanLi: false,
        showMap: false,
        car_park_id: '',
        errImg: 'this.src="' + errImg + '"',
        bike_create: {
          "administrative_region_code": '',
          "bike_name": "",
          "bike_number": "",
          "bike_status": 0,
          "image_path": "",
          "lease_type": 2,
          "lessor_id": localStorage.getItem('lessor_id'),
          "car_park_id": ''
        },
        addstop: {
          "car_park_address": "",
          "car_park_name": "",
          "latitude": 0,
          "longitude": 0,
          "lessor_id": localStorage.getItem('lessor_id')
        },
        options: [{
          value: '100000',
          label: '北京'
        }, {
          value: '200000',
          label: '上海'
        }, {
          value: '510000',
          label: '广州'
        }]
      };
    },
    components: {
      HeaderRouter,
      UploadImg,
      selectMap
    },
    methods: {
      getTabData(page) {
        if (localStorage.getItem('lessor_id') === undefined) {
          this.router.push({name: 'shopList'});
          return false;
        }
        let self = this;
        const data = {
          lessor_id: localStorage.getItem('lessor_id'),
          pageIndex: page
        };
        const url = "wurengongxiangdanche/Bike/RetrieveListByLessorId";
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
      postAddBike() {
        let self = this;
        let list = [];
        this.imagelist.forEach(e => {
          list.push(e.url);
        });
        let data = this.bike_create;
        data.image_path = list.join(',');
        console.log(data);
        if (data.bike_name === "" || data.bike_number === "" || data.image_path === "") {
          this.$alert('缺少重要参数，请重新输入', {
            title: '提示',
            confirmButtonText: '确定'
          });
          return false;
        }
        const url = 'wurengongxiangdanche/Bike/Create';
        const retbakcall = function (r) {
          if (r.status === 1) {
            self.addCar = false;
            window.location.reload();
          }
        };
        USER.ajax(url, 'post', data, retbakcall);
      },
      openAddbike() {
        this.bike_create = {
          "administrative_region_code": '',
          "bike_name": "",
          "bike_number": "",
          "bike_status": 0,
          "image_path": "",
          "lease_type": 2,
          "lessor_id": localStorage.getItem('lessor_id'),
          "car_park_id": ''
        };
        this.addCar = true;
      },
      getStopList() {
        let self = this;
        const url = 'wurengongxiangdanche/CarPark/RetrieveListByLessorId';
        const data = {
          lessor_id: localStorage.getItem('lessor_id')
        };
        const retBackcall = (ret) => {
          if (ret.status === 1) {
            self.shopList = ret.data.list;
            self.car_park_id = ret.data.list[0].car_park_id;
          } else {
            this.$alert(ret.message);
          }
        };
        USER.ajax(url, 'get', data, retBackcall, 30000, false);
      },
      addStopFun() {
        let self = this;
        let data = this.addstop;
        const url = 'wurengongxiangdanche/CarPark/Create';
        const retBackcall = (ret) => {
          console.log(ret);
          if (ret.status === 1) {
            self.innerShouCheGuanLi = false;
            self.shopList.unshift(self.addstop);
          } else {
            this.$alert(ret.message);
          }
        };
        USER.ajax(url, 'post', data, retBackcall);
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
          const url = "wurengongxiangdanche/Bike/UpdateBikeStatus";
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
      },
      createOfManual(type) {
        const data = {
          "bike_id": this.bike_id,
          "car_park_id": this.car_park_id
        };
        const ret = (r) => {
          console.log(r);
          if (r.status === 1) {
            this.$message({
              message: r.message,
              type: 'success'
            });
            this.bike_id = "";
            this.shouCheGuanLi = false;
            this.getTabData();
          } else {
            this.$alert(r.message);
          }
        };
        let url = '';
        if (type === 1) {
          url = 'wurengongxiangdanche/Dispatch/CreateOfManual';
        } else {
          url = 'wurengongxiangdanche/Dispatch/CreateOfAuto';
        }
        USER.ajax(url, 'POST', data, ret);
      },
      map_init() {
        gdmap = new AMap.Map('mapCentent', {
          resizeEnable: true,
          zoom: 14
        });
        this.marker();
      },
      marker() {
        markers = [];
        this.tableData.forEach((item) => {
          /*eslint-disable*/
          let maker = new AMap.Marker({
            map: gdmap,
            position: [item.bike_latitude, item.bike_longitude],
            icon: new AMap.Icon({
              image: item.image_path,
              size: new AMap.Size(64, 64),
              imageSize: new AMap.Size(60, 60)
            }),
          });
          markers.push(maker);
        });
      },
    },
    mounted() {
      this.getTabData();
      this.getStopList();
      this.map_init();
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

  .addShop {
    margin-bottom: 12px;
    .title {
      width: 100px;
      line-height: 34px;
    }
  }

  .right-button {
    position: absolute;
    right: 14px;
    top: 0;
    font-size: 13px;
  }

  #content {
    height: 100%;
    overflow: hidden;
  }
</style>
