import {request} from '@/libs/request.js'
// 1.queryConfigJobList:首页,个人中心,推荐岗位,岗位列表,搜索结果
// 2.getEntryJobList : 特色入口
// 3.lookAndMoreJobs : 岗位详情,报名结果页
// 4.getQueryJobList :岗位列表,搜索结果
//  获取城市列表
export function getCityListApi(query) {
    return request({
        url: '/m/wechatApplet/getCityList',
        method: 'post',
        params: query
    })
}
//  获取岗位详情
export function getJobDetailApi(query) {
    if (wx.getStorageSync('location').longitude) {
        query.coord_longitude = wx.getStorageSync('location').longitude,
            query.coord_latitude = wx.getStorageSync('location').latitude,
            query.coord_use_type = 1
    }
    return request({
        url: '/m/wechatApplet/jobDetail',
        method: 'post',
        data: query
    })
}

//  获取首页信息列表
export function getGlobalInfoApi(query) {
    return request({
        url: '/m/wechatApplet/getWAGlobal',
        method: 'post',
        data: query
    })
}

//  取消收藏
export function cancelCollectedJobApi(query) {
    return request({
        url: '/m/wechatApplet/cancelCollectedJob',
        method: 'post',
        data: query
    })
}

//  收藏
export function collectJobApi(query) {
    return request({
        url: '/m/wechatApplet/collectJob',
        method: 'post',
        data: query
    })
}

// 获取雇主信息
export function getEmployerInfoApi(query) {
    return request({
        url: '/m/wechatApplet/getEntDetail',
        method: 'post',
        data: query,
    })
}

// 关注雇主
export function focusEntApi(query) {
    return request({
        url: '/m/wechatApplet/focusEnt',
        method: 'post',
        params: query,
    })
}


// 取消关注雇主
export function cancelFocusApi(query) {
    return request({
        url: '/m/wechatApplet/cancelFocus',
        method: 'post',
        params: query,
    })
}

// 获取雇主当前在招职位列表
export function getEntJobListApi(query) {
    if (wx.getStorageSync('location').longitude) {
        query.coord_longitude = wx.getStorageSync('location').longitude,
        query.coord_latitude = wx.getStorageSync('location').latitude,
        query.coord_use_type = 1
    }
    return request({
        url: '/m/wechatApplet/getEntJobList',
        method: 'post',
        params: query,
    })
}

//  记录广告点击
export function recordAdClickApi(query) {
    return request({
        url: '/m/wechatApplet/adClick',
        method: 'post',
        params: query
    })
}

//  记录服务号推送
export function recordJobPushApi(query) {
    return request({
        url: '/m/wechatApplet/wechatJobPushClick',
        method: 'post',
        params: query
    })
}

//  特色入口点击埋点
export function recordSpecialEntryClick(query) {
    return request({
        url: '/m/wechatApplet/specialEntryClick',
        method: 'post',
        params: query
    })
}

//  获取报名推荐岗位列表
export function getRecommendJobListApi(query) {
    return request({
        url: '/m/wechatApplet/recommendJob',
        method: 'post',
        params: query
    })
}

//  获取推荐岗位列表
export function getJobListApi(query) {
    if (wx.getStorageSync('location').longitude) {
        query.coord_longitude = wx.getStorageSync('location').longitude,
        query.coord_latitude = wx.getStorageSync('location').latitude,
        query.coord_use_type = 1
    }
    return request({
        url: '/m/wechatApplet/queryConfigJobList',
        method: 'post',
        params: query
    })
}

//  获取推荐岗位列表
export function getJobList2Api(query) {
    if (wx.getStorageSync('location').longitude) {
        query.coord_longitude = wx.getStorageSync('location').longitude,
            query.coord_latitude = wx.getStorageSync('location').latitude,
            query.coord_use_type = 1
    }
    return request({
        url: '/m/wechatApplet/getQueryJobList',
        method: 'post',
        params: query
    })
}

// 查询雇主列表
export function queryEnterpriseListApi(query) {
    return request({
        url: '/m/wechatApplet/queryEnterpriseList',
        method: 'post',
        params: query,
    })
}

//  查询收藏
export function getCollectedJobListApi(query) {
    if (wx.getStorageSync('location').longitude) {
        query.coord_longitude = wx.getStorageSync('location').longitude,
            query.coord_latitude = wx.getStorageSync('location').latitude,
            query.coord_use_type = 1
    }
    return request({
        url: '/m/wechatApplet/getCollectedJobList',
        method: 'post',
        params: query
    })
}


//************************************我申请的岗位页面接口**********************************/

//  岗位报名
export function getMyApplyListApi(query) {
    if (wx.getStorageSync('location').longitude) {
        query.coord_longitude = wx.getStorageSync('location').longitude,
            query.coord_latitude = wx.getStorageSync('location').latitude,
            query.coord_use_type = 1
    }
    return request({
        // url: '/m/wechatApplet/getMyApplyJobList',
        url: '/m/admin/getApplyJobList',
        method: 'post',
        params: query
    })
}
//  取消报名
export function cancelApplyApi(query) {
    return request({
        url: '/m/wechatApplet/cancelApplyJob',
        method: 'post',
        params: query
    })
}
//  获取举报原因列表
export function getComplaintReasonListApi(query) {
    return request({
        url: '/m/wechatApplet/getComplaintReason',
        method: 'post',
        params: query
    })
}
//  提交投诉理由
export function submitFeedbackApi(query) {
    return request({
        url: '/m/wechatApplet/submitFeedback',
        method: 'post',
        params: query
    })
}

//************************************完善简历相关接口**********************************/

//************************************岗位搜索页面接口**********************************/


// 热词日志记录接口
export function putHotWordLogApi(query) {
    return request({
        url: '/m/wechatApplet/putHotWordLog',
        method: 'post',
        params: query
    })
}

//  获取热门搜索词
export function getHotWordListApi(query) {
    return request({
        url: '/m/wechatApplet/getCityHotSearchWordList',
        method: 'post',
        params: query
    })
}

//  获取热门搜索词
export function getHotWrodListNewApi(query) {
    return request({
        url: '/m/wechatApplet/getHotWrodList',
        method: 'post',
        params: query
    })
}


//  获取城市信息,下属区域列表
export function getCityInfoApi(query) {
    return request({
        url: '/m/wechatApplet/getCityInfo',
        method: 'post',
        params: query
    })
}

// 3.7.0岗位分类
export function getJobClassifyFirstSecondListApi(query) {
    return request({
        url: '/m/wechatApplet/getJobClassifyFirstSecondList',
        method: 'post',
        params: query,

    })
}

//  登出
export function logoutApi (query) {
    return request({
        url: '/m/wechatApplet/logout ',
        method: 'post',
        params: query
    })
}

// 注销账号
export function userDestroyAccountVerifyApi(query) {
    return request({
        url: '/m/wechatApplet/userDestroyAccountVerify',
        method: 'post',
        params: query
    })
}

//  获取短信验证码
export function getSmsAuthenticationCodeApi(query) {
    return request({
        // url: '/m/wechatApplet/getSmsAuthenticationCode',
        url: '/m/inviteEmp/getSmsAuthCode',
        method: 'post',
        params: query
    })
}

//  保存个人信息
export function saveResumeInfoApi(query) {
    return request({
        url: '/m/wechatApplet/postResumeInfo',
        method: 'post',
        params: query
    })
}

//  获取特色入口
export function getEntryJobListApi(query) {
    if (wx.getStorageSync('location').longitude){
        query.coord_longitude = wx.getStorageSync('location').longitude,
            query.coord_latitude = wx.getStorageSync('location').latitude,
            query.coord_use_type = 1
    }
    return request({
        url: '/m/wechatApplet/getEntryJobList',
        method: 'post',
        params: query
    })
}

//  看了又看岗位列表
export function lookAndMoreJobsApi(query) {

    if (wx.getStorageSync('location').longitude) {
        query.coord_longitude = wx.getStorageSync('location').longitude,
            query.coord_latitude = wx.getStorageSync('location').latitude,
            query.coord_use_type = 1
    }
    return request({
        url: '/m/wechatApplet/lookAndMoreJobs',
        method: 'post',
        params: query
    })
}
