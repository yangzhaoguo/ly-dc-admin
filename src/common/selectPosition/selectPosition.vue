<template>
  <div id="map-w">
    <div class="content" id="container">
      <div class="map">
        <div id="panel" class="scrollbar1">
          <div id="searchBar">
            <input id="searchInput" placeholder="输入关键字搜索"/>
          </div>
          <div id="searchResults"></div>
        </div>
      </div>
      <div class="button">
        <el-button @click.native="setPosition" type="primary">确定位置</el-button>
      </div>
      <div class="close">
        <i @click="closeMap()" class="el-icon-error"></i>
      </div>
    </div>
  </div>
</template>
<style>
  .amap-copyright {
    bottom: -300px;
  }

  .amap-logo {
    bottom: -300px;
  }
</style>
<script type="text/ecmascript-6">
  import AMap from 'AMap';
  import AMapUI from 'AMapUI';

  let map, positionPicker, poiPicker;

  export default {
    data() {
      return {
        $lat: '',
        $lng: '',
        $address: ''
      };
    },
    props: ['lat', 'lng', 'showMap', 'shopPositionName'],
    methods: {
      mapInit() {
        let self = this;
        AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
          map = new AMap.Map('container', {
            zoom: 16
          });
          positionPicker = new PositionPicker({
            mode: 'dragMap', //设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
            map: map //依赖地图对象
          });
          //TODO:事件绑定、结果处理等
          positionPicker.start();
          positionPicker.on('success', (res) => {
            self.$lat = res.position.lat;
            self.$lng = res.position.lng;
            self.$address = res.address;
          });
        });
        AMapUI.loadUI(['misc/PoiPicker'], (PoiPicker) => {
          poiPicker = new PoiPicker({
            input: 'searchInput',
            placeSearchOptions: {
              map: map,
              pageSize: 5
            },
            searchResultsContainer: 'searchResults'
          });

          poiPicker.on('poiPicked', function (poiResult) {
            poiPicker.hideSearchResults();
            let source = poiResult.source;
            let poi = poiResult.item;

            if (source !== 'search') {
              //suggest来源的，同样调用搜索
              poiPicker.searchByKeyword(poi.name);
            } else {
              //console.log(poi);
            }
          });
//          poiPicker.onCityReady(function () {
//            poiPicker.searchByKeyword('美食');
//          });
        });
      },
      setPosition() {
        this.$emit('update:lat', this.$lat);
        this.$emit('update:lng', this.$lng);
        this.$emit('update:shopPositionName', this.$address);
        this.closeMap();
      },
      closeMap() {
        this.$emit('update:showMap', false);
      }
    },
    mounted() {
      this.mapInit();
    }
  };
</script>
<style scoped lang="less">
  #map-w {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .content {
      position: absolute;
      left: 50%;
      background: #f1f1f1;
      width: 960px;
      height: 600px;
      margin: 130px auto;
      margin-left: -480px;
      .button {
        position: absolute;
        bottom: 60px;
        left: 0;
        right: 0;
        text-align: center;
        z-index: 900;
      }
      .close {
        position: absolute;
        top: 24px;
        right: 24px;
        color: red;
        z-index: 900;
        background: #f0f0f0;
        border-radius: 50%;
        font-size: 30px;
      }
    }
  }

  #panel {
    position: absolute;
    top: 12px;
    bottom: 0;
    left: 0;
    height: 100%;
    overflow: auto;
    width: 300px;
    z-index: 999;
    border-left: 1px solid #eaeaea;
  }

  #searchBar {
    height: 30px;
    background: #ccc;
  }

  #searchInput {
    width: 100%;
    height: 40px;
    line-height: 40%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #00a0e9;
    padding: 0 5px;
  }

  #searchResults {
    overflow: auto;
    margin-top: 12px;
    height: calc(100% - 70px);
  }

  .amap_lib_placeSearch,
  .amap-ui-poi-picker-sugg-container {
    border: none !important;
  }

  .amap_lib_placeSearch .poibox.highlight {
    background-color: #CAE1FF;
  }

  .poi-more {
    display: none !important;
  }
</style>
