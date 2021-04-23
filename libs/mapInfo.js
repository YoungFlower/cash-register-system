//获取位置信息
import { uploadJcid } from '@co/util.js'
let QQMapWX = require('./qqmap-wx-jssdk.min');
let qqmapsdk;
// 实例化腾讯地图API核心类
qqmapsdk = new QQMapWX({
    key: '6ZWBZ-EWYWQ-CBG5I-GME4Y-SMO5S-M6BST' // 必填
});
const mapInfo = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (res) => {
                if (res.authSetting.hasOwnProperty('scope.userLocation') && res.authSetting['scope.userLocation'] === false) {
                    wx.showModal({
                        title: '是否授权地理位置信息',
                        content: '你的位置信息将用于搜索和推送本地相关职业',
                        success: function (tip) {
                            if (tip.confirm) {
								uploadJcid('look_detail')
                                wx.openSetting({
                                    success: function (data) {
                                        if (data.authSetting["scope.userLocation"]) {
                                            wx.getLocation({
                                                success: function (res) {
                                                    let location = {
                                                        latitude: res.latitude,
                                                        longitude: res.longitude
                                                    }
                                                    wx.setStorageSync('location', location)
                                                    qqmapsdk.reverseGeocoder({
                                                        location: {
                                                            latitude: res.latitude,
                                                            longitude: res.longitude
                                                        },

                                                        success: function (addressRes) {
                                                            let address = addressRes.result
                                                            resolve(address);
                                                        },
                                                        fail: function (res) {
                                                            let add = { address_component: { city: '位置错误' } }
                                                            resolve(add);
                                                        },
                                                    })
                                                },
                                                fail: function () {
                                                }
                                            })
                                        } else {
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'none',
                                                duration: 2000
                                            })
                                        }
                                    }
                                })
                            }
                            else {
                                let address = { city: '定位失败' }
                                resolve(address);
                                let page = getCurrentPages()
                                if (page[page.length - 1].route == 'pages/index/index') {
                                    wx.navigateTo({
                                        url: '/pages/citySelect/index?type==6',
                                    })
                                }
                            }
                        },
                    })
                } else {
                    wx.getLocation({
                        success: (res)=> {
                            let location = {
                                latitude: res.latitude,
                                longitude: res.longitude
                            }
                            wx.setStorageSync('location', location)
                            qqmapsdk.reverseGeocoder({
                                location: {
                                    latitude: res.latitude,
                                    longitude: res.longitude
                                },
                                success: function (addressRes) {
                                    let address = addressRes.result
                                    resolve(address);
                                },
                                fail: function (res) {
                                    let add = { address_component: { city: '位置错误' } }
                                    resolve(add);
                                },
                            })
                        },
                        fail: ()=> {
                            wx.showModal({
                                title: '获取地理位置信息失败',
                                content: '请确认是否打开手机定位功能',
                                success: function (tip) {
                                    let address = { city: '定位失败' }
                                    resolve(address);
                                    let page = getCurrentPages()
                                    if (page[page.length - 1].route == 'pages/index/index') {
                                        wx.navigateTo({
                                            url: '/pages/citySelect/index?type==6',
                                        })
                                    }
                                },
                            })

                        }
                    })
                }
            },
        })
    })
}
module.exports = {
    $getMapInfo: mapInfo,
}
