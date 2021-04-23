<template>
  <view class="mine" :style="{backgroundImage:`url(${topImg})` }">
    <view class="page-container ">
      <view class="page-top">

        <view class="base-info flex-row-sb flex-align-center">
          <view class="flex-row flex-align-center position-relative">
            <jk-btn-login-transparent />
            <view class="profile">
              <template v-if="hasLogin">
                <img v-if="userInfo.profile_url" :src="userInfo.profile_url" mode="widthFix" @click="upLoadImage">
                <open-data v-else type="userAvatarUrl"></open-data>
              </template>
              <template v-else>
                <img :src="defaultProfileImg" alt="" mode="widthFix" @click="openLogin">
              </template>
            </view>
            <view class="user-name flex-col-center">
              <template v-if="hasLogin">
                <view class="title-1" v-if="userInfo.true_name">
                  {{userInfo.true_name}}
                </view>
                <open-data v-else type="userNickName"></open-data>
              </template>
              <view class="title-1" v-else @click="openLogin">
                请先登录哦~
              </view>
              <!-- <jk-btn-certification type="person"></jk-btn-certification> -->
              <jk-btn-certification v-if="userInfo.id_card_verify_status===3" type="person"></jk-btn-certification>
            </view>
          </view>
          <view class="setting" style="margin-right: 26rpx;" @click="gotoPage('/pages/setting/setting')">
            <img :src="settingIcon" alt="">
          </view>
        </view>
      </view>
      <view class="my-resume position-relative">
        <jk-btn-login-transparent />
        <view class="top flex-row-sb flex-row-center">
          <view class="title-1" style="height: 36rpx;">我的简历</view>
          <view class="to-complete flex-center-center" @click="gotoPage('/pages/baseInfo/baseInfo',true)">
            去完善
            <img :src="whiteRightIcon" alt="">
          </view>
        </view>
        <view class="apply-collection flex-row-sb">
          <view class="apply-collection-item flex-row-sb" @click="gotoPage('/pages/applyList/applyList',true)">
            <img :src="myApplyIcon" alt="">
            <view>
              <view class="title-2">我的报名</view>
              <view class="num">{{userInfo.myApplyNum || 0}}</view>
            </view>
          </view>
          <view style="background:#E6E6E6;height: 96rpx;width: 1px;" />
          <view class="apply-collection-item flex-row-sb" @click="gotoPage('/pages/collection/collection',true)">
            <img :src="collectionIcon" alt="">
            <view>
              <view class="title-2">我的收藏</view>
              <view class="num">{{userInfo.stu_collect_job_count || 0}}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 个人中心下的广告 -->
      <jk-ad-item unit-id="adunit-9cdf7414388286c5" style="margin-top:16rpx;display:block"></jk-ad-item>
      <view class="job-recommend">
        <view class="flex-row flex-align-end">
          <view class="title-1">职位推荐</view>
          <view class="small-gray-text">职为你甄选~</view>
        </view>
        <scroll-view v-if="jobList&&jobList.length>0&&jobListFlag" class="scroll-view" scroll-x="true">
          <view v-for="(job,index) in jobList" v-if="index<=6" class="scroll-view-item" style="width: 337rpx;overflow: hidden;">
            <jk-job-item :job="job" :type="'card'"></jk-job-item>
          </view>
          <view v-if="jobListCount>6" class="more-recommend-box flex-center-center">
            <view class="more-recommend" @click="gotoPage('/pages/recommendList/recommendList')">更多推荐</view>
          </view>

        </scroll-view>
        <view v-else-if="jobListFlag" class="no-recommend flex-col-center flex-align-center" @click="gotoBJKMiniprogram">
          <img :src="noRecommendImg" alt="">
          <view class="to-miniprogarm">你想要的工作这里都有~</view>
        </view>

      </view>
      <view class="money-bag flex-row-sb flex-align-center position-relative" @click="gotoBJKMiniprogram">

        <view class="flex-center-center">
          <view class="title-1">
            我的钱包
          </view>
          <view class="money-bag-num">
            余额 <text style="padding-left: 8rpx;">¥{{ userInfo.acct_amount/100 || 0 }}</text>
          </view>
        </view>
        <jk-btn-login-transparent />
        <img :src="grayRightIcon" alt="">

      </view>
    </view>
    <uni-popup ref="login">
      <jk-popup-login></jk-popup-login>
    </uni-popup>

  </view>
</template>

<script>
import config from '@/config'
import LoginMixin from '@/mixin/LoginMixin'
import { mapState, mapMutations } from 'vuex'
import { getJobListApi, saveResumeInfoApi, getAccountInfoApi } from '@/api/index'
export default {
  mixins: [LoginMixin],
  components: {},
  data() {
    return {
      topImg: `${config.imgSrc}mine-top-img.png`,
      defaultProfileImg: `${config.imgSrc}default-profile.png`,
      collectionIcon: `${config.imgSrc}collection-icon.png`,
      grayRightIcon: `${config.imgSrc}gray-right-icon.png`,
      myApplyIcon: `${config.imgSrc}my-apply-icon.png`,
      settingIcon: `${config.imgSrc}setting-icon.png`,
      whiteRightIcon: `${config.imgSrc}white-right-icon.png`,
      noRecommendImg: `${config.imgSrc}no-recommend-img.png`,
      options: {},
      jobList: [], //假数据
      jobListCount: 0,
      jobListFlag: false
    }
  },
  watch: {},
  computed: {
    ...mapState(['hasLogin', 'userInfo', 'systemInfo', 'currentCity'])
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    init() {
      this.pageNum = 1
      this.jobList = []
      this.jobListFlag = false
    },
    // 获取用户信息
    getUserInfo(session) {
      getAccountInfoApi().then(res => {
        if (res.data.errCode === 0) {
          this.setUserInfo(res.data.content)
        }
      })
    },
    //  上传头像
    upLoadImage() {
      uni.chooseImage({
        count: 1, //选择的图片数量
        success: res => {
          wx.showLoading({
            title: '正在加载中....',
            mask: true
          })
          const tempFilePaths = res.tempFilePaths
          uni.uploadFile({
            url: config.domain + '/m/fileUpload/ossFileUpload', //服务端地址
            filePath: tempFilePaths[0],
            name: 'file', //图片的key
            formData: {}, //除了图片的其他参数
            success: res => {
              //请求成功回调 这里收到的是服务端下发 的数据
              let data = res.data
              if (typeof data == 'string') {
                data = JSON.parse(data)
              }
              // 获取图片url
              this.userInfo.profile_url = data.content.fileUrl
              uni.hideLoading()
              this.save(data.content.fileUrl)
            }
          })
        }
      })
    },
    //  保存
    save(image_url) {
      let param = {
        true_name: this.userInfo.true_name,
        profile_url: image_url
      }
      saveResumeInfoApi(param).then(res => {})
    },
    // 页面跳转
    gotoPage(url, needLogin) {
      if (this.hasLogin || !needLogin) {
        this.$router.push({
          path: url
        })
      } else if (needLogin && !this.hasLogin) {
        this.openLogin()
      }
    },
    // 获取推荐岗位列表
    getJobList() {
      let params = {
        is_index: 2,
        city_id: this.currentCity.id || 211,
        page_size: 10,
        page_num: 1,
        timestamp: Date.parse(new Date())
      }
      getJobListApi(params).then(res => {
        this.jobListFlag = true
        this.jobList = res.data.content.self_job_list
        this.jobListCount = res.data.content.self_job_list.length
      })
    },
    // 跳转贝兼客小程序
    gotoBJKMiniprogram() {
      if (!this.hasLogin) {
        // this.openLogin()
      } else {
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
      }
    }
  },
  onLoad(options) {
    this.options = options
    this.getJobList()
    if (!this.hasLogin) {
      this.openLogin()
    }
  },
  onReady() {},
  onShow() {
    this.init()
    this.getJobList()
    if (this.hasLogin) {
      this.getUserInfo()
    }
  },
  onHide() {},
  onUnload() {},
  onReachBottom() {},
  onPullDownRefresh() {},
  onShareAppMessage() {}
}
</script>

<style lang="scss">
@import '@s/styles/index.scss';

.mine {
  width: 100%;
  background-size: 100% 426rpx;
  background-repeat: no-repeat;
  background-color: $pbc;

  .page-container {
    background-color: rgba(255, 255, 255, 0);
    padding-top: 156rpx;
  }

  .page-top {
    .base-info {
      .profile {
        width: 128rpx;
        height: 128rpx;
        border: 2rpx solid #ffffff;
        border-radius: 50%;
        overflow: hidden;

        img,
        image {
          width: 128rpx;
          height: 128rpx;
        }
      }

      .user-name {
        margin-left: 24px;
        font-size: 36rpx;
        font-weight: 600;
        color: #333333;
        line-height: 36rpx;
      }

      .personal-certificate-icon {
        margin-top: 16rpx;
        padding: 8rpx;
        padding-right: 12rpx;
        background: #e6f7ff;
        border-radius: 10px;
        font-size: 24rpx;
        color: $mc1;
        line-height: 24rpx;

        img {
          width: 28rpx;
          height: 28rpx;
          margin-right: 8rpx;
        }
      }

      .setting {
        img {
          width: 40rpx;
          height: 40rpx;
        }
      }
    }
  }

  .my-resume {
    margin-top: 40rpx;

    .top {
      width: 100%;
      padding: 28rpx;
      background-color: #e6f7ff;
      border-radius: 16rpx 16rpx 0px 0px;

      .to-complete {
        padding: 11rpx 16rpx;
        background: $mc1;
        line-height: 26rpx;
        border-radius: 24rpx;
        color: #ffffff;
        font-size: 26rpx;
        img {
          margin-left: 8rpx;
          width: 18rpx;
          height: 18rpx;
        }
      }
    }

    .apply-collection {
      padding: 40rpx;
      background: #ffffff;
      border-radius: 0px 0px 16px 16px;

      .apply-collection-item {
        img {
          width: 80rpx;
          height: 80rpx;
          margin-right: 40rpx;
        }

        .num {
          margin-top: 16rpx;
          font-size: 48rpx;
          font-weight: 600;
          color: #b4b8b8;
          line-height: 48rpx;
        }
      }
    }
  }

  .job-recommend {
    margin-top: 40rpx;

    margin-right: -32rpx;

    .small-gray-text {
      margin-left: 16rpx;
      font-size: 24rpx;
      color: #b4b8b8;
      line-height: 24rpx;
    }

    .scroll-view {
      width: 570 rpx;
      white-space: nowrap;

      .scroll-view-item {
        margin-top: 23rpx;
        margin-right: 16rpx;
        display: inline-block;
        width: 375rpx;
      }
    }

    .more-recommend-box {
      display: inline-block;
      height: 300rpx;
    }

    .more-recommend {
      margin-top: 23rpx;
      margin-left: 32rpx;
      margin-right: 46rpx;
      padding: 22rpx 20rpx 16rpx 20rpx;
      -webkit-writing-mode: vertical-rl;
      writing-mode: vertical-rl;
      background: #ffeee0;
      border-radius: 36rpx;
      font-size: 28rpx;
      color: #ff983f;
      line-height: 28rpx;
      letter-spacing: 6px;
    }

    .no-recommend {
      width: 690rpx;
      height: 375rpx;
      margin-top: 24rpx;
      background: #ffffff;
      border-radius: 16rpx;

      img,
      image {
        width: 280rpx;
        height: 192rpx;
      }

      .to-miniprogarm {
        width: 420rpx;
        height: 64rpx;
        margin-top: 24rpx;
        text-align: center;
        border-radius: 36rpx;
        border: 1rpx solid $mc1;
        font-size: 28rpx;
        color: $mc1;
        line-height: 64rpx;
      }
    }
  }

  .money-bag {
    width: 100%;
    margin-top: 24rpx;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 34rpx 28rpx;

    img {
      width: 24rpx;
      height: 24rpx;
    }

    .money-bag-num {
      margin-left: 22rpx;
      font-size: 28rpx;
      color: #969999;
      line-height: 28rpx;
    }
  }
}
</style>
