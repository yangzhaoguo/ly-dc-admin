<template>
  <div class="indent-item">
    <header>
      订单详情
    </header>
    <div id="mapCentent" class="content"></div>
    <div class="right-title" v-if="distance.distance_status==0">乘客 "<span>已取消</span>"。</div>
    <div class="right-title" v-if="distance.distance_status==1">车辆 "<span>正在等待出发</span>"。</div>
    <el-button @click="quxiaodingdan" >取消订单</el-button>
    <div class="right-title" v-if="distance.distance_status==2">车辆 "<span>正在路上</span>"。</div>
    <div class="right-title" v-if="distance.distance_status==3">车辆 "<span>已到达</span>"。</div>
    <div class="right-title" v-if="distance.distance_status==4">车辆 "<span>行驶中</span>"。</div>
    <div class="right-title" v-if="distance.distance_status==5">"<span>待支付</span>"。</div>
    <div class="right-title" v-if="distance.distance_status==6">乘客 "<span>已支付</span>"。</div>
    <div class="right-title" v-if="distance.distance_status==7">乘客 "<span>已评价</span>"。</div>
  </div>

</template>

<script type="text/ecmascript-6">
  import * as USER from "common/js/user";
  import BeginIcon from 'assets/img/qidian-icon.png';

  let gdmap;

  export default {
    data() {
      return {
        distance: {}
      };
    },
    methods: {
      getData() {
        let data = {
          distance_id: this.$route.query.distance_id
        };
        console.log(data);
        let url = 'wurengongxiangdanche/Distance/RetrieveDetailByDistanceId';
        const ret = r => {
          console.log(r);
          if (r.status === 1) {
            this.distance = r.data;
            gdmap.setCenter([r.data.begin_longitude, r.data.begin_latitude]);
            /* eslint-disable no-new */
            new AMap.Marker({
              map: gdmap,
              position: [
                r.data.begin_longitude,
                r.data.begin_latitude
              ],
              icon: new AMap.Icon({
                image: BeginIcon,
                size: new AMap.Size(64, 64),
                imageSize: new AMap.Size(34, 34)
              })
            });
          } else {
            this.$message.error(r.message);
          }
        };
        USER.ajax(url, 'GET', data, ret);
      },
      map_init() {
        gdmap = new AMap.Map('mapCentent', {
          resizeEnable: true,
          zoom: 18
        });
      },
      //取消订单
      quxiaodingdan() {
        this.$confirm('此操作将取消订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = {
            "distance_id": this.$route.query.distance_id
          };
          const url = 'wurengongxiangdanche/Distance/UpdateOfCancel';
          const retBackCall = (ret) => {
            if (ret.status === 1) {
              this.$message({
                type: 'success',
                message: '订单已取消!'
              });
              setTimeout(function () {
                window.location.reload();
              }, 1000);
            }
          };
          USER.ajax(url, 'post', data, retBackCall, 30000, false);
        }).catch(() => {
        });
      }
    },
    mounted() {
      this.map_init();
      this.getData();
    }
  };
</script>

<style scoped lang="less">
  @import '~assets/css/public.less';

  .indent-item {
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
  }

  .content {
    width: 100%;
    height: calc(100% - 85px);
  }

  .right-title {
    position: absolute;
    left: 60px;
    top: 80px;
    z-index: 99;
    background: #ffffff;
    line-height: 42px;
    padding: 12px;
    border-radius: 4px;
    text-align: center;
    span {
      color: orange;
    }
  }
</style>
