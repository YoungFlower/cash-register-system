<template>
  <div class='index-page'>
    <div class="nav-style"
      :style="{'height':(navBarHeight + systemInfo.statusBarHeight) + 'px','padding-top':systemInfo.statusBarHeight + 'px'}">
      收银小程序
    </div>

    <section>
    </section>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'indexPage',
  props: {},
  data() {
    return {}
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
.index-page {
  .nav-style {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 600;
    // box-shadow: 0px 2px 5px #888888;
  }
}
</style>