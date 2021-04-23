
<template>
  <view class="page-index">
    <!--  定位搜索-->
    <u-navbar :is-back="false" :title="title">
      <view class="slot-wrap" style="width: 100vw;">
        <view class="top flex-row flex-align-center">
          <view class="icon-img location-img flex-row flex-align-center" @click="gotoPage('/pages/citySelect/citySelect')">
            <img :src="locationBlueIcon" alt="">
            <text style="margin-left: 12rpx;">{{ currentCity.name }}</text>
          </view>
          <view class="search flex-row flex-align-center" @click="gotoPage('/pages/search/search')">
            <view class="icon-img icon-search">
              <img :src="searchGrayIcon" alt="">
            </view>
            <text style="margin-left: 8rpx;">搜索岗位、公司</text>
          </view>
        </view>
      </view>
    </u-navbar>
    <!--  轮播图-->
    <view class="banner" v-if="bannerList&&bannerList.length>0">
      <u-swiper :list="bannerList" :name="'img_url'" @click="bannerClick"></u-swiper>
    </view>
    <!--特色入口-->
    <view class="feature-entry" v-if="features&&features.length>0">
      <view class="flex-row">
        <view v-for="item in features" :key="item.special_entry_id" class="feature-item flex-col flex-align-center"
          @click="gotoFeaturePostPage(item)">
          <image :src="item.special_entry_icon" alt="" class="feature-img" mode="aspectFill" />
          <view class="feature-text">
            {{item.special_entry_title}}
          </view>
        </view>
      </view>

    </view>

    <!--  精选推荐-->
    <view class="job-list">
      <view class="job-list-top flex-row-sb-center">
        <view class="title-1">精选推荐~</view>
        <view class="flex-row flex-align-center" @click="gotoPage('/pages/jobList/jobList')"><text>更多</text>
          <img :src="arrowRightBlackIcon" alt="" style="width: 24rpx;height: 24rpx;margin-left: 8rpx;" />
        </view>
      </view>
      <view class="gray-line"></view>
      <view v-for="(job,index) in jobList" :key="job.id">
        <jk-ad-item v-if="adunitList[index]" :unit-id="adunitList[index]" ad-type="video" ad-theme="white"></jk-ad-item>
        <view class="job-item" :style="{'margin-top':adunitList[index]?'16rpx':''}">
          <jk-job-item :job="job" :type="'list'"></jk-job-item>
        </view>

        <view v-if="index===5" @click="gotoBJKMiniprogram">
          <image :src="jobAdImg" mode="widthFix" style="width: 100%"></image>
        </view>
      </view>

      <view class="no-more-data" v-if="!noData && finish">我是有底线的~</view>
      <view style="background-color: #FFFFFF">

        <jk-no-data v-if="noData" :type="1" :text="'暂时没有推荐岗位'"></jk-no-data>
      </view>

    </view>
    <jk-list-loading :show="showLoading"></jk-list-loading>
    <uni-popup ref="login">
      <jk-popup-login></jk-popup-login>
    </uni-popup>
    <uni-popup ref="ad">
      <jk-popup-ad :popAd="popAd"></jk-popup-ad>
    </uni-popup>
  </view>
</template>

<script>
import config from '@/config'
import { uploadJcid } from '@co/util.js'
import { mapState, mapMutations } from 'vuex'
import { getGlobalInfoApi, recordSpecialEntryClick, getJobListApi, getJobShareSettingApi } from '@/api/index'
import { adClick } from '@co/utils_two'
import ListMixin from '@/mixin/ListMixin'
import { createSession } from '@/libs/request'

const defaultCity = { id: 211, name: '福州' }
let interstitialAd = null
export default {
  mixins: [ListMixin],
  components: {},
  data() {
    return {
      locationBlueIcon: `${config.imgSrc}location-blue-icon.png`,
      searchGrayIcon: `${config.imgSrc}search-gray-icon.png`,
      arrowRightBlackIcon: `${config.imgSrc}arrow-right-black-icon.png`,
      jobAdImg: `${config.imgSrc}job-ad-img.png`,
      defaultBannerImg: `${config.imgSrc}default-banner-img.png`,
      showLoading: true,
      title: '',
      options: {},
      isFirstTime: true,
      features: [],
      bannerList: [],
      popAd: [],
      shareInfo: {},
      adunitList: {
        3: 'adunit-f57a0f042173a6ec',
        8: 'adunit-adcd3d90caafc115',
        11: 'adunit-fa65c37b013ae43b'
      }
    }
  },
  watch: {},
  computed: {
    ...mapState(['hasLogin', 'userInfo', 'systemInfo', 'currentCity', 'setGloabData'])
  },
  methods: {
    // 初始化数据
    init() {
      this.features = []
      this.bannerList = []
      this.popAd = []
      this.pageNum = 1
      this.jobList = []
    },
    // 打开登录弹窗
    openLogin() {
      this.$store.dispatch('getUserOpenId')
      this.$refs.login.open()
    },
    // 打开广告弹窗
    openAd() {
      this.$refs.ad.open()
    },
    // 获取广告列表
    getIndexInfoList() {
      getGlobalInfoApi({
        city_id: this.currentCity.id ? this.currentCity.id : -1
      }).then(res => {
        let gloabData = res.data.content
        if (gloabData) {
          this.features = gloabData.index_special_entry_list
          this.bannerList = gloabData.banner_ad_list || []
          this.bannerList.push({ img_url: this.defaultBannerImg, ad_type: 9 })
          this.popAd = gloabData.stu_pop_up_ad_list && gloabData.stu_pop_up_ad_list.length > 0 ? gloabData.stu_pop_up_ad_list[0] : ''
          this.$store.commit('setAdInfo', gloabData)
          if (this.isFirstTime && this.popAd) {
            this.openAd()
            this.isFirstTime = false
          }
        }
      })
    },
    // 获取详情分享配置
    getJobShareSetting() {
      getJobShareSettingApi({ shareType: 1 }).then(res => {
        this.shareInfo = res.data.content
      })
    },
    // 获取推荐岗位列表
    getJobList() {
      this.showLoading = true
      let param = {
        is_index: 1,
        city_id: this.$store.state.currentCity.id ? this.$store.state.currentCity.id : defaultCity.id,
        page_size: this.pageSize,
        page_num: this.pageNum,
        timestamp: Date.parse(new Date())
      }
      getJobListApi(param).then(res => {
        let list = []
        if (res.data.errCode == 1) {
          this.showLoading = false
        } else {
          this.showLoading = false
          list = res.data.content.self_job_list
        }
        this.dealList(list)
        uni.stopPullDownRefresh()
      })
    },

    // 轮播图点击
    bannerClick(e) {
      if (this.bannerList[e].ad_type === 9) {
        this.gotoBJKMiniprogram()
        return
      } else {
        adClick(this.bannerList[e], this)
      }
    },
    // 跳转贝兼客小程序
    gotoBJKMiniprogram() {
      let env = 'trial'
      if (config.nodeEnv === 'production') {
        env = 'release'
      }
      wx.navigateToMiniProgram({
        appId: 'wx5edd0cf661cf457e',
        path: 'pages/center/center',
        envVersion: env,
        success(res) {
          // 打开成功
        }
      })
    },
    // 页面跳转
    gotoPage(url, needLogin) {
      if (this.hasLogin || !needLogin) {
        this.$router.push({ path: url })
      } else if (needLogin && !this.hasLogin) {
        this.openLogin()
      }
    },
    // 跳转特色入口
    gotoFeaturePostPage(item) {
      const employerInfoPath = '/pages/employerInfo/employerInfo'
      const featurePostPath = '/pages/featurePost/featurePost'
      const webViewPath = '/pages/webView/webView'
      recordSpecialEntryClick({
        special_entry_id: item.special_entry_id
      }).then(res => {})
      let id = item.special_entry_id
      let title = item.special_entry_title
      let type = item.special_entry_type_new
      if (type === 8) {
        {
          this.$router.push({ path: employerInfoPath, query: { accountId: item.special_entry_url } })
        }
      } //  雇主广告
      else if (type === 1 || type === 2) {
        {
          this.$router.push({
            path: webViewPath,
            query: { url: encodeURIComponent(item.special_entry_url), title: item.special_entry_title }
          })
        }
      } // 打开H5
      // else if (type === 7) {
      //   {
      //     this.$router.push({path:item.special_entry_url})
      //   }
      // }  // 打开原生
      else {
        this.$router.push({ path: featurePostPath, query: { id: id, title: title } })
      } // 特色入口
    },
    // 定义创建插屏广告实例
    createProperty() {
      // 在页面onLoad回调事件中创建插屏广告实例
      if (wx.createInterstitialAd) {
        interstitialAd = wx.createInterstitialAd({
          adUnitId: 'adunit-c0818f95480a52f4'
        })
        interstitialAd.onLoad(() => {
          setTimeout(() => {
            console.log('interstitialAd')
            interstitialAd.show().catch(err => {
              console.error(err)
            })
          }, 2000)
          console.log('onLoad event emit')
        })
        interstitialAd.onError(err => {
          console.log('onError event emit', err)
        })
        interstitialAd.onClose(res => {
          console.log('onClose event emit', res)
        })
      }
    }
  },
  onLoad(options) {
    this.options = options
    this.getJobShareSetting()
    uploadJcid('enter_page')
    this.createProperty()
  },
  onReady() {},
  onShow() {
    this.init()
    this.getIndexInfoList()
    if (!uni.getStorageSync('token')) {
      createSession().then(res => {
        this.getJobList()
      })
    } else {
      this.getJobList()
    }
  },
  onHide() {},
  onUnload() {},
  onReachBottom() {},
  onPullDownRefresh() {
    this.getIndexInfoList()
    this.getJobList()
  },
  onShareAppMessage() {
    return {
      title: this.shareInfo.title || '轻工作',
      imageUrl: this.shareInfo.image,
      path: '/pages/tabBar/index/index',
      success: res => {
        uni.showToast({
          title: '转发成功'
        })
      },
      fail: () => {
        uni.showToast({
          title: '转发失败',
          icon: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '@s/styles/index.scss';
.page-index {
  background-color: $pbc;
  min-height: 100vh;
  padding-bottom: 100rpx;
  .u-border-bottom:after {
    border-bottom-width: 0;
  }

  .top {
    width: 100%;
    background-color: #ffffff;
    padding: 0 30rpx;
    .location-img {
      img,
      image {
      }
      text {
        font-size: 28rpx;
        color: #333333;
        line-height: 40rpx;
      }
    }
    .search {
      width: 388rpx;
      height: 64rpx;
      margin-left: 24rpx;
      padding: 0 24rpx;
      background: #f5f7f7;
      border-radius: 32rpx;
      .icon-search {
        line-height: 18rpx;
        img,
        image {
        }
      }
      text {
        font-size: 28rpx;
        color: #7f8080;
        line-height: 40rpx;
      }
    }
  }
  .banner {
    background-color: #ffffff;
    padding: 30rpx;
  }
  .feature-entry {
    background-color: #ffffff;
    padding: 30rpx;
    border-radius: 0px 0px 32rpx 32rpx;
    .feature-item {
      width: 20%;
      margin-bottom: 10rpx;
      img,
      image {
        width: 88rpx;
        height: 88rpx;
      }
    }
    .feature-text {
      font-size: 24rpx;
      color: #333333;
      line-height: 33rpx;
      margin-top: 20rpx;
    }
  }
  .job-list {
    margin-top: 24rpx;
    .job-list-top {
      width: 100%;
      height: 105rpx;
      padding: 0 30rpx;
      background: #ffffff;
      border-radius: 32rpx 32rpx 0px 0px;
      text {
        font-size: 28rpx;
        color: #333333;
        line-height: 40rpx;
      }
    }
    .job-item {
      margin-bottom: 16rpx;
      padding: 32rpx;
      background-color: #ffffff;
    }
  }
}
</style>
