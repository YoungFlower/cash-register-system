<template>
  <view class="jk-popup-ad">
    <div class="close-icon flex-row-end">
      <img :src="closeWhiteIcon" alt="" @click="close">
    </div>
    <div class="content" @click="popAdClick">
      <img :src="popAd.img_url" alt="" mode="widthFix">
    </div>
  </view>
</template>

<script>
import config from "@/config";
import {createSession} from '@/libs/request'
import {getAccountInfoApi} from '@/api/index'
import {weChatPhoneBindApi, getPhoneNumberApi, weChatLoginApi} from '@/api/weChat'
import {mapState, mapMutations} from 'vuex'
import {adClick} from '@co/utils_two'
export default {
  name: "uniPopupLogin",
  data() {
    return {
      closeWhiteIcon: `${config.imgSrc}close-white-icon.png`
    }
  },
  props:{
    popAd:{type:[Object,Array]}
  },
  inject: ['popup'],
  watch: {},
  computed: {
    ...mapState(['hasLogin', 'userInfo', 'systemInfo', 'sessionKeyToken', 'provider'])
  },
  created() {
  },
  mounted() {

  },
  methods: {
    ...mapMutations(['login', 'setUserInfo']),
    close() {
      this.popup.close()
    },
    // 弹窗广告点击
    popAdClick(){
      adClick(this.popAd,this)
    },

  },
}
</script>

<style lang="scss" scoped>
@import "@/static/jianzhike/styles/variables.scss";

.jk-popup-ad {
  .close-icon{
    img,image{
      width: 48rpx;
      height: 48rpx;
    }
  }
  .content {
    margin-top: 32rpx;
    img,image{
      width: 560rpx;
      height: 660rpx;
      border-radius: 16rpx;
      overflow: hidden;
    }
  }
}

</style>
