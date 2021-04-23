<script>
import { mapMutations } from 'vuex'
import { weChatLoginApi } from '@/api/weChat'
import { getAccountInfoApi } from '@/api/index'
import { getCityListApi, getGlobalInfoApi } from '@/api/index'
import { createSession } from '@/libs/request'
// import {
//   $getMapInfo
// } from '@/libs/mapInfo'
import { getLocation } from '@co/citySelect.js'
export default {
  onLaunch: function(option) {
    uni.getSystemInfo({
      success: res => {
        this.$store.commit('setSystemInfo', res)
      }
    })
    this.getChannelId(option)
    this.setJcid(option)
    // #ifdef MP-WEIXIN
    this.wxLogin()
    this.loadAd()
    // #endif
    // #ifdef H5
    this.getUserInfo()
    // #endif
    this.getEnum()
    getLocation()
  },
  onPageNotFound(res) {
    this.$toast({
      title: '页面不存在,将返回首页',
      icon: 'none',
      duration: 2000,
      success: () => {
        this.$router.push({ path: '/pages/tabBar/index/index' })
      }
    })
  },
  onShow: function() {},
  onHide: function() {},
  methods: {
    ...mapMutations(['login', 'setSessionKeyToken', 'setUserInfo']),
    loadAd() {
      if (uni.preloadAd) {
        uni.preloadAd([
          {
            unitId: 'adunit-fa65c37b013ae43b', // 视频广告
            type: 'video' // 视频广告
          },
          {
            unitId: 'adunit-adcd3d90caafc115', // 视频广告
            type: 'video' // 视频广告
          },
          {
            unitId: 'adunit-f57a0f042173a6ec', // 视频广告
            type: 'video' // 视频广告
          },
          {
            unitId: 'adunit-9cdf7414388286c5', // banner广告广告单元
            type: 'banner' // banner广告
          },
          {
            unitId: 'adunit-f2030853e1b8d565', // banner广告广告单元
            type: 'banner' // banner广告
          },
          {
            unitId: 'adunit-ae8ae0cbfc9f2ecd', // banner广告广告单元
            type: 'banner' // banner广告
          },
          {
            unitId: 'adunit-b81689f49949ee62', // banner广告广告单元
            type: 'banner' // banner广告
          }
        ])
      }
    },
    // 获取枚举
    getEnum() {
      this.$store.dispatch('getEnum')
    },
    // 获取渠道码
    getChannelId(option) {
      let channelId = option.query['td_channelId'] || option.query['td_channelid']
      if (channelId) {
        this.$store.commit('setChanelCode', channelId)
      }
    },
    // 设置setJcid
    setJcid(option) {
      console.log(option)
      let setJcid = option.query['jcid']
      if (setJcid) {
        this.$store.commit('setJcid', setJcid)
      }
    },
    // 静默登录(通过判断是否有用户信息缓存判断)
    wxLogin() {
      if (!this.sessionKeyToken && uni.getStorageSync('usreInfo')) {
        createSession().then(session => {
          uni.login({
            provider: this.$store.state.provider,
            success: loginRes => {
              this.$store.commit('setOpenid', loginRes.code)
              let params = {
                code: loginRes.code,
                login: 1
              }
              weChatLoginApi(params).then(res => {
                this.getUserInfo(session)
                this.$store.dispatch('getGlobalInfo')
              })
            }
          })
        })
      } else {
        createSession()
      }
      this.$store.dispatch('getGlobalInfo')
    },
    /*    wxLogin() {
          if (uni.getStorageSync('usreInfo')) {
            uni.login({
              provider: this.$store.state.provider,
              success: (loginRes) => {
                this.$store.commit('setOpenid', loginRes.code)
                let params = {
                  code: loginRes.code,
                  login: 1
                }
                weChatLoginApi(params).then(res => {
                  if(res.content)
                  this.getUserInfo(session)
                  this.$store.dispatch('getGlobalInfo')
                })
              }
            });
          }

        },*/
    // 获取用户信息
    getUserInfo(session) {
      getAccountInfoApi().then(res => {
        if (res.data.errCode === 0) {
          console.log('静默登录成功')
          this.login()
          // #ifndef H5
          this.$store.commit('setSessionKeyToken', session.content.sessionId)
          uni.setStorageSync('token', session.content.sessionId)
          // #endif
          this.setUserInfo(res.data.content)
        } else {
          this.$store.dispatch('getUserOpenId')
          console.log('静默登录失败')
        }
      })
    },
    // 获取地理位置()
    setLocation() {
      //  设置位置信息
      $getMapInfo().then(res => {
        uni.getStorage({
          key: 'city_list',
          success: list => {
            console.log('rrr=', res)
            this.setLocationInfo(res, list.data)
          },
          fail: () => {
            getCityListApi().then(list => {
              let cityList = list.data.content.cities
              uni.setStorageSync('city_list', cityList)
              this.setLocationInfo(res, cityList)
            })
          }
        })
      })
    },
    //  设置位置信息
    setLocationInfo(location, cityList) {
      let cityInfo = {}
      if (location && getCityId(location.city, cityList)) {
        cityInfo = {
          name: location.city.replace('市', ''),
          id: getCityId(location.city, cityList)
        }
      } else {
        cityInfo = {
          name: '定位失败',
          id: -1
        }
      }
      wx.setStorageSync('locate_city', cityInfo)
      wx.setStorageSync('current_city', cityInfo)
    }
  }
}
</script>

<style lang="scss">
/* #ifndef APP-PLUS-NVUE */
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import './common/uni.css';
@import 'uview-ui/index.scss';
/*@import '/common/styles/index.scss';*/

/* #endif*/
</style>
