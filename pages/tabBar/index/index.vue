<template>
  <div class='index-page'>
    <div class="nav-style"
      :style="{'height':(navBarHeight + systemInfo.statusBarHeight) + 'px','padding-top':systemInfo.statusBarHeight + 'px'}">
      收银小程序
    </div>

    <section class="content-view" :style="{'height':(systemInfo.windowHeight - navBarHeight - systemInfo.statusBarHeight)+'px'}">
      <modal-block v-for="(item,index) in operationList" :key="index" :name="item.name" />
    </section>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'indexPage',
  props: {},
  data() {
    return {
      operationList: [
        {
          name: '收银入口'
        },
        {
          name: '仓库管理'
        },
        {
          name: '收银入口'
        },
        {
          name: '仓库管理'
        },
        {
          name: '收银入口'
        },
        {
          name: '仓库管理'
        },
        {
          name: '仓库管理'
        }
      ]
    }
  },
  computed: {
    ...mapState(['systemInfo']),
    navBarHeight() {
      let height = this.systemInfo.platform == 'ios' ? 44 : 48
      return height
    }
  },
  mounted() {
    console.log(this.systemInfo)
  },
  methods: {}
}
</script>
<style lang='scss'>
$color1: #00bfff;
$color2: #87cefa;
$color3: #00ffff;
$color4: #add8e6;
$color5: #b0e0e6;
$color6: #afeeee;

.index-page {
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
  }

  background: $color6; /* Old browsers */
  background: -moz-linear-gradient(
    45deg,
     $color1 0%,
    $color2 17%,
      $color3 46%,
    $color3 46%,
    $color4 56%,
      $color5 92%,
    $color6 100%
  ); /* FF3.6+ */
  background: -webkit-gradient(
    linear,
    left bottom,
    right top,
    color-stop(0%, $color1),
    color-stop(17%, $color2),
    color-stop(46%, $color3),
    color-stop(46%, $color3),
    color-stop(56%, $color3),
    color-stop(92%, $color2),
    color-stop(100%, $color6)
  ); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(
    45deg,
     $color1 0%,
    $color2 17%,
    $color3 46%,
    $color3 46%,
    $color4 56%,
    $color5 92%,
    $color6 100%
  ); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(
    45deg,
     $color1 0%,
    $color2 17%,
    $color3 46%,
    $color3 46%,
    $color4 56%,
    $color5 92%,
    $color6 100%
  ); /* Opera 11.10+ */
  background: -ms-linear-gradient(
    45deg,
     $color1 0%,
    $color2 17%,
    $color3 46%,
    $color3 46%,
    $color4 56%,
    $color5 92%,
    $color6 100%
  ); /* IE10+ */
  background: linear-gradient(45deg,  $color1 0%, $color2 17%, $color3 46%, $color3 46%, $color4 56%, $color5 92%, $color6 100%); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='$color1', endColorstr='$color6',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
}
</style>