<template>
  <div class="income">
    <div class="incomeBox">
      <div class="incomeBox_statistical">
        <div class="incomeBox_view">
          <schart :canvasId="canvasId"
                  :type=type
                  :width=width
                  :height=height
                  :data=data
          ></schart>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Schart from 'vue-schart';

  export default {
    data() {
      return {
        canvasId: 'myCanvas',
        type: 'line',
        width: 800,
        height: 400
      };
    },
    components: {
      Schart
    },
    props: ['data'],
    methods: {}
  };
</script>
<style lang="less" scoped>
  .income {
    width: 100%;
    height: 100%;
  }

  .incomeBox {
    width: 100%;
    border: none;
    .incomeBox_first {
      width: 100%;
      text-align: center;
      font-size: 16px;
      padding: 10px 0;
    }
    .incomeBox_statistical {
      width: 100%;
      text-align: center;
    }
  }

  .divEl {
    display: flex;
    width: 100%;
    justify-content: center;
  }
</style>
