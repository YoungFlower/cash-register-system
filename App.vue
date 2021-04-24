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
    loadAd() {},
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
