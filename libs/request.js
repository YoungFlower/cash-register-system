import store from '@/store'

import config from '@/config'

let BASEURL = config.baseUrl
let packageName = config.packageName
// 创建session
export const createSession = async function () {
    return await new Promise((resolve, reject) => {
        uni.request({
            url: BASEURL + '/m/wechatApplet/createSession',
            data: {},
            success: (res) => {
                store.commit('setLoginInfo', res.data.content)
                store.commit('setSessionKeyToken', res.data.content.sessionId)
                uni.setStorageSync('userToken', res.data.content.userToken);
                resolve(res.data)
            }
        });
    })
}


export  const request = (config) => {
    config.params = config.data || config.params || {}
    config.params.access_channel_code  = store.state.chanelCode ||'wechatapplet'
    config.params.city_id = config.params.city_id?config.params.city_id:store.state.currentCity.id
    config.params.package_name = `com.wechatapplet.${packageName}`
    config.params.user_type = 2 // 兼客
    config.params.is_from_wa = 1 // 兼客
    config.params.sessionId_sjk = uni.getStorageSync('token')
    // #ifndef H5
    // config.params.sessionId_sjk = store.state.sessionKeyToken
    // #endif
    //
    //  console.log('请求数据',config)
    return new Promise((resolve, reject) => {
        let sendRequest = uni.request({
            url: BASEURL + config.url,
            method: config.method,
            data: config.params,
            withCredentials: true,
            header: {
                'content-type': config.header ? config.header : 'application/x-www-form-urlencoded',
            },
            success: (res) => {
                if (res.data.errCode === 0 ) {
                    resolve(res)
                } else if (res.data.errCode === 15) {
                    store.commit('logout')
                } else if ((res.data.errCode == 1&&config.errCodeOnePass)|| res.data.errCode == 95){
					resolve(res)
				}
				else {
                    console.log(res.data.errMsg)
                    uni.showToast({
                        title: res.data.errMsg,
                        duration: 2000,
                        icon: 'none'
                    });
                }
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
            }
        })
    })
}


