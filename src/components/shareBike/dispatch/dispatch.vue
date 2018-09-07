<template>
  <div id="">
    <header>
      车辆调度
      <!--<span @click="map=!map" class="right-button">切换</span>-->
    </header>
    <header-router>
      <span slot="right">
        {{routerName}}
      </span>
    </header-router>
    <el-tabs v-model="active" type="card" @tab-click="handleClick">
      <el-tab-pane label="未调度" name="0"></el-tab-pane>
      <el-tab-pane label="已调度" name="1"></el-tab-pane>
    </el-tabs>
    <div class="tab-content">
      <el-table
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="30">
        </el-table-column>
        <el-table-column
          align="center"
          label="全选"
          width="80">
          <template slot-scope="scope">
            <img style="height:30px;margin-top: 4px" :src="scope.row.img" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="name">
        </el-table-column>
        <el-table-column
          prop="address"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div class="count">已选中 <span>{{count}} </span>辆</div>
      <div class="button" v-show="count>0">
        <el-button type="primary" size="mini">开始调度</el-button>
      </div>
    </div>
    <div class="paging">
      <el-pagination
        layout="prev, pager, next"
        :total="50">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderRouter from 'common/header/header-router';
  import img from 'assets/img/bike-icon.png';

  export default {
    data() {
      return {
        active: '0',
        tableData3: [
          {
            img: img,
            name: '1231313',
            address: '2018.07.07'
          },
          {
            img: img,
            name: '1231313',
            address: '2018.07.07'
          },
          {
            img: img,
            name: '1231313',
            address: '2018.07.07'
          },
          {
            img: img,
            name: '1231313',
            address: '2018.07.07'
          },
          {
            img: img,
            name: '1231313',
            address: '2018.07.07'
          },
          {
            img: img,
            name: '1231313',
            address: '2018.07.07'
          },
          {
            img: img,
            name: '1231313',
            address: '2018.07.07'
          },
          {
            img: img,
            name: '1231313',
            address: '2018.07.07'
          },
          {
            img: img,
            name: '1231313',
            address: '2018.07.07'
          },
          {
            img: img,
            name: '1231313',
            address: '2018.07.07'
          }
        ],
        multipleSelection: [],
        routerName: '→共享单车→车辆调度'
      };
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleClick(v) {
        console.log(v);
      }
    },
    components: {
      HeaderRouter
    },
    computed: {
      count() {
        return this.multipleSelection.length;
      }
    }
  };
</script>

<style scoped lang="less">
  @import '~assets/css/public.less';

  #content {
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

    .right-button {
      position: absolute;
      right: 14px;
      top: 0;
      font-size: 13px;
    }
  }

  .el-table__header-wrapper {
    position: absolute;
    border-bottom: 0;
  }

  .tab-content {
    position: relative;
    .count {
      position: absolute;
      top: 16px;
      left: 110px;
      font-size: 15px;
      color: #909399;
      span {
        color: @mainColor;
      }
    }
    .button {
      position: absolute;
      top: 10px;
      left: 236px;
    }
  }

  .paging {
    text-align: center;
    margin-top: 12px;
  }
</style>
