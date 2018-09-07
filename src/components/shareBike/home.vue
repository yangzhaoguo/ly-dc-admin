<template>
  <div id="content">
    <header>
      首页
      <span @click="map=!map" class="right-button">切换</span>
    </header>
    <header-router>
      <span slot="right">
        {{routerName}}
      </span>
      <span slot="left">
        <router-link :to="{name:'admin'}">车辆管理</router-link>
      </span>
      <span slot="left">
        <router-link :to="{name:'repairs'}">报修管理</router-link>
      </span>
      <span slot="left">
        <router-link :to="{name:'incomeStatistics'}">收入统计</router-link>
      </span>
      <span slot="left">
        <router-link :to="{name:'bikeIndent'}">订单管理</router-link>
      </span>
    </header-router>
    <div id="mapCentent" class="content" v-show="map"></div>
    <div class="tabContent" v-if="!map">
      <el-table
        :data="tableData"
        :show-header=false
        style="width: 100%">
        <el-table-column
          align="center"
          label="日期"
          width="60">
          <template slot-scope="scope">
            <div style="height: 30px">
              <img style="width: 30px;top: 2px;" src='../../assets/img/bike-icon.png' alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="120"
          prop="bike_number">
          <template slot-scope="scope">
            <span v-if="scope.row.bike_number===''">空</span>
            <span v-else>{{scope.row.bike_number}}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <span v-if="scope.row.position_name===''">未停放</span>
            <span v-else>{{scope.row.position_name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          width="90"
          label="地址">
          <template slot-scope="scope">
            <div style="cursor: pointer;">
              <div @click="getItemUser(scope.row.bike_position_id)" v-if="scope.row.bike_status=== 1"
                   style="color: #777777;font-size: 14px;">空闲<span
                class="el-icon-arrow-right"></span></div>
              <div v-if="scope.row.bike_status=== 2" style="color: #FF9900;font-size: 14px;">使用中<span
                class="el-icon-arrow-right"></span></div>
              <div @click="getItemUser(scope.row.bike_position_id)" v-if="scope.row.bike_status=== 3"
                   style="color: #2dff00;font-size: 14px;">已保修<span
                class="el-icon-arrow-right"></span></div>
              <div v-if="scope.row.bike_status=== 4" style="color: #ff0000;font-size: 14px;">已报废<span
                class="el-icon-arrow-right"></span></div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="count>0" class="paging">
      <el-pagination
        layout="prev, pager, next"
        :total=count
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderRouter from 'common/header/header-router';
  import * as USER from "common/js/user";
  import bikeIcon from 'assets/img/bike-icon.png';
  let gdmap, geolocation, circle, infoWindow;
  let markers = []; //地图api
  export default {
    data() {
      return {
        activeName: '0',
        routerName: '→共享单车→车辆监控',
        map: true,
        windowMessage: "",
        count: 0,
        position: [],
        tableData: [],
        t: 0,
        g: 0
      };
    },
    methods: {
      map_init() {
        gdmap = new AMap.Map('mapCentent', {
          resizeEnable: true,
          zoom: 14
        });
        this.geolocation();
      },
      geolocation() {
        //浏览器定位
        gdmap.plugin('AMap.Geolocation', () => {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,  //是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonPosition: 'RT'
          });
          gdmap.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', (data) => {
            //console.log(str);  //返回定位信息
            let position = [];
            position.push(data.position.getLng());
            position.push(data.position.getLat());
            this.position = position;
            if (!this.firstopen) {
              this.firstopen = true;
              this.circle();
              this.regeocoder();
              this.addListendrag();
            }
          });
          var time = setTimeout(function () {
            var center = document.getElementsByClassName('amap-marker')[0];
            if (center) {
              center.style.zIndex = 130;
              AMap.event.addDomListener(center, 'click', function () {
                infoWindow.open(gdmap, this.position);
              }, true);
            } else {
              clearTimeout(time);
            }
          }, 1000);
          AMap.event.addListener(geolocation, 'error', (err) => {
            console.log(err);
            this.$message.error('定位失败');
            this.addListendrag();
          });
        });
      },
      circle() {
        let _self = this;
        circle = new AMap.Circle({
          center: new AMap.LngLat(_self.position[0], _self.position[1]), // 圆心位置
          radius: 700, //半径
          strokeColor: "#409eff", //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 2, //线粗细度
          fillColor: "#409eff", //填充颜色
          fillOpacity: 0.25 //填充透明度
        });
        circle.setMap(gdmap);
      },
      regeocoder() {
        var self = this;
        var geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all"
        });
        geocoder.getAddress(this.position, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              var way = result.regeocode.addressComponent.street ? result.regeocode.addressComponent.street : result.regeocode.addressComponent.district;
              self.windowMessage = way + " " + result.regeocode.aois["0"].name;
            }
            this.infoWindow();
          }
        );
      },
      infoWindow() {
        AMapUI.loadUI(['overlay/SimpleInfoWindow'], (SimpleInfoWindow) => {
          infoWindow = new SimpleInfoWindow({
            infoTitle: `<style>
                          .amap-ui-infowindow-body{display: none}
                          strong{font-weight: 700}
                          .amap-ui-infowindow-title{padding:5px 24px 5px 5px;border:none;font-size: 15px;}
                        </style>
                      您在<strong> ${this.windowMessage} </strong>附近`,
            enableCloseOnClick: true,
            size: 8
          });
          infoWindow.open(gdmap, this.position);
          infoWindow.get$Container().on('click', (event) => {
//            alert('windowMessage 的点击事件');
          });
        });
      },
      marker(m) {
        markers = [];
        m.forEach((item) => {
          /*eslint-disable*/
          let maker = new AMap.Marker({
            map: gdmap,
            position: [item.position[0], item.position[1]],
            icon: new AMap.Icon({
              image: item.icon,
              size: new AMap.Size(64, 64),
              imageSize: new AMap.Size(60, 60)
            }),
          });
          markers.push(maker);
        });
      },
      addListendrag() {
        let self = this;
        AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
          var positionPicker = new PositionPicker({
            mode: 'dragMap', //设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
            map: gdmap //依赖地图对象
          });
          //TODO:事件绑定、结果处理等
          positionPicker.start();
          positionPicker.on('success', function (positionResult) {
            self.t = positionResult.position.lat;
            self.g = positionResult.position.lng;
            self.getAroundBike(positionResult.position.lng, positionResult.position.lat);
          });
        });
      },
      handleCurrentChange(e) {
        this.getAroundBike(this.g, this.t, e)
      },
      getAroundBike(lng, lat, e) {
        let self = this;
        let data = {
          "longitude": lng,
          "latitude": lat,
          'pageIndex': e || 1,
          'pageSize': 10
        };
        console.log(data);

        function ret(r) {
          console.log(r);
          self.tableData = r.data.list;
          self.count = r.data.count;
          let arrar = [];
          r.data.list.forEach((item) => {
            let data = {};
            let position = [];
            position.push(item.bike_longitude);
            position.push(item.bike_latitude);
            data.position = position;
            data.icon = bikeIcon;
            arrar.push(data);
          });
          self.marker(arrar);
        }
        const url = 'yourengongxiangdanche/BikePosition/RetrieveListByParms';
        USER.ajax(url, 'GET', data, ret, 30000, false);
      },
      getItemUser(id) {
        var self = this;
        const url = 'yourengongxiangdanche/Distance/RetrieveDetailByDistanceId';
        var data = {
          distance_id: id
        };
        var ret = function (r) {
          if (!r.data) {
            self.$alert(`<div>姓名:${r.data}</div><div style="margin-top: 12px">电话:${r.data}</div>`, '使用人信息', {
              dangerouslyUseHTMLString: true
            });
          }
        };
        USER.ajax(url, 'GET', data, ret);
      }
    },
    components: {
      HeaderRouter
    },
    mounted() {
      this.map_init();
    },
  };
</script>

<style scoped lang="less">
  @import '~assets/css/public.less';

  #content {
    height: 100%;
    overflow: hidden;
  }

  #mapCentent {
    height: calc(100% - 85px);
    &.amap-marker-content {
      z-index: 141;
    }
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

  .content {
    width: 100%;
    height: calc(100% - 85px);
  }

  .tabContent {
    max-height: calc(100% - 185px);
    li {
      border-bottom: @border1px;
      height: 34px;
      padding: 6px 12px 6px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        img {
          width: 30px;
        }
        p {
          margin: 12px 0 12px 12px;
        }
        p:first-child {
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
