<template>
  <div class="good-list back-color">
    <div
      class="nav-style"
      :style="{
        height: navBarHeight + systemInfo.statusBarHeight + 'px',
        'padding-top': systemInfo.statusBarHeight + 'px'
      }"
    >
      仓库管理
    </div>

    <div class="content-view">
      <!-- 查询条件or全表操作 -->
      <div></div>
      <div class="add-goods" @click="addGoods">添加商品</div>

      <!-- 表格 -->
      <div style="margin-top:24rpx;">
        <u-table>
          <u-tr class="u-tr">
            <u-th class="u-th">编号</u-th>
            <u-th class="u-th">价格</u-th>
            <u-th class="u-th">产品名</u-th>
            <u-th class="u-th">库存</u-th>
            <!-- <u-th class="u-th">操作</u-th> -->
          </u-tr>
          <u-tr v-for="item in goodList" :key="item.code" class="u-tr">
            <u-td class="u-td">{{ item.code }}</u-td>
            <u-td class="u-td">{{ item.price }}</u-td>
            <u-td class="u-td">{{ item.name }}</u-td>
            <u-td class="u-td">{{ item.count }}</u-td>
            <!-- <u-td class="u-td">修改</u-td> -->
          </u-tr>
        </u-table>
      </div>
    </div>

    <u-popup v-model="show" mode="bottom">
      <u-input v-model="current.code" disabled ></u-input>
      <u-input v-model="current.name"></u-input>
      <u-input v-model="current.count"></u-input>
      <u-input v-model="current.price"></u-input>
    </u-popup>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { goodList } from "./goodList";
export default {
  name: "GoodList",
  props: {},
  data() {
    return {
      goodList,
      show:true,
      current:{
          code:'1111',
          name:'',
          count:'',
          price:''
      }
    };
  },
  computed: {
    ...mapState(["systemInfo"]),
    navBarHeight() {
      let height = this.systemInfo.platform == "ios" ? 44 : 48;
      return height;
    }
  },
  mounted() {
    console.log(goodList);
  },
  methods: {
    //   添加商品
    addGoods() {
      let that = this;
      uni.scanCode({
        success(res) {
          that.current.code = res.result;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.good-list {
  min-height: 100vh;
  .nav-style {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 600;
    // box-shadow: 0px 2px 5px #888888;
  }

  .content-view {
    width: 100vw;
    padding: 33rpx;
    min-height: 100%;
  }
  .add-goods {
    width: 100%;
    height: 60rpx;
    border-radius: 10rpx;
    overflow: hidden;
    text-align: center;
    line-height: 60rpx;
    background: #f2f2f2;
  }
}
</style>
