import {request} from '@/libs/request.js'


//微信登陆
export function weChatLoginApi(query) {
    return request({
        url: '/m/wechatApplet/dealBindWechatAppletLogin',
        method: 'post',
        data: query
    })
}

//  利用微信返回加密的手机号到后台解析
export function getPhoneNumberApi(query) {
    return request({
        url: '/m/wechatApplet/getPhoneNumberFromWechat',
        method: 'post',
        data: query
    })
}

//微信绑定手机号
export function weChatPhoneBindApi(query) {
    return request({
        url: '/m/wechatApplet/bindPhone',
        method: 'post',
        data: query
    })
}

//微信小程序登出并解绑手机
export function weChatLogoutApi(query) {
    return request({
        url: '/mapi/wxAuth/logout',
        method: 'post',
        data: query
    })
}
