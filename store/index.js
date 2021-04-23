import Vue from 'vue'
import Vuex from 'vuex'

import config from "@/config";
import {getAccountInfoApi,getPostParttimeJobEnumApi} from '@/api/index'
import {getGlobalInfoApi} from '@/api/index'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        provider:'weixin',
        hasLogin: false,
        loginProvider: "",
		applyResultDetail: "", // 报名后需要传给报名结果页的岗位详情
        openid: null,
        testvuex: false,
        colorIndex: 0,
        colorList: ['#FF0000', '#00FF00', '#0000FF'],
		applyIdArr:[],
        systemInfo: {},
        userInfo: {true_name:''},
        adInfo:{},
        serviceNum:'', // 客服联系号码
        configData: {},
        loginState: false,
        navigateTitle: '带货达人',
        gloabData: {
            bottom_job_detail_ad:'',
            top_img_url: '',
            redirect_url: '',
            job_list_apply:1
        },
        jobUuId: '',
        activityId: '',
        currentCity: {
            id: 211,
            name: '福州'
        },
		locationCity: {
		    id: '',
		    name: '正在定位...'
		},
        chanelCode: '',
        routerQuery: {},
        completeInfo: {
            baseInfo: {},
            workIntention: {},
            selfAssessment: ''
        },
        workType: {
            id: '',
            name: ''
        },
        workExperience: {},
        school: {
            id: '',
            name: ''
        },
        educationExperience: {},
        wxAccount: '',
        sessionKeyToken: '',
        loginInfo: '',
		enum:{},
		applyDetail:{},// 当前报名的岗位详情
		jiGuang: {
			product_id: 336,
			jcid: config.nodeEnv == 'production'?'':'4385a50735f8474f7c6de82d504eea46'
		}
    },
    mutations: {
        login(state, provider) {
            state.hasLogin = true;
            state.loginProvider = provider;
            state.videoTime = 0;
        },
        logout(state) {
            state.hasLogin = false
            state.userInfo = {}
            uni.removeStorageSync('token')
            state.openid = null
            state.sessionKeyToken = ''
        },
        setOpenid(state, openid) {
            state.openid = openid
        },
        setSystemInfo(state, value) {
            state.systemInfo = value
        },
        setUserInfo(state, value) {
            state.userInfo = value
        },
        setChanelCode(state, value) {
            state.chanelCode = value
        },
        setGloabData(state, value) {
            state.gloabData = value
        },
        setNavigateTitle(state, value) {
            state.navigateTitle = value
            uni.setNavigationBarTitle({
                title: value
            });
        },
        setCityInfo(state, value) {
            state.currentCity = value
        },
		setLocationInfo(state, value) {
		    state.locationCity = value
            if(value.location){
                uni.setStorageSync('location', {longitude:value.location.lng,latitude:value.location.lat});
            }
		},
		// 完善简历中选择所在城市后对userInfo中的所在城市信息进行修改
		setSelectLocationCity(state, value) {
			state.userInfo.city_id = value.id
			state.userInfo.city_name = value.name
			state.userInfo.address_area_id = value.areaId
			state.userInfo.address_area_name = value.areaName
			state.userInfo = JSON.parse(JSON.stringify(state.userInfo))
		},
		// 完善简历中选择出生年月
		setUserInfoBirthday(state, value) {
			state.userInfo.birthday = value
			state.userInfo = JSON.parse(JSON.stringify(state.userInfo))
		},
		// 完善简历中选择工作年份
		setUserStartWorkTimeNew(state,value) {
			state.userInfo.start_work_time_new = value
			state.userInfo = JSON.parse(JSON.stringify(state.userInfo))
		},
		// 填写认证信息后状态回填
		setVerifyState(state,value) {
			state.userInfo.id_card_verify_status = value
			state.userInfo = JSON.parse(JSON.stringify(state.userInfo))
		},
		// 填写教育经历后的回填
		setUserEducation(state,value) {
			state.userInfo.education_str = value.name
			state.userInfo.education = value.id
			state.userInfo = JSON.parse(JSON.stringify(state.userInfo))
		},

		// 完善证件信息回填
		setUserInfoKeyValue(state,value) {
			state.userInfo[value.key]=value.value
			state.userInfo = JSON.parse(JSON.stringify(state.userInfo))
		},

		// 获取报名的岗位详情
		setApplyDetail(state,value) {
			state.applyDetail = value
			state.applyDetail = JSON.parse(JSON.stringify(state.applyDetail))
		},

		// 设置报名结束岗位详情
		setApplyResultDetail(state,value) {
			state.applyResultDetail = value
		},
		// 设置报名Id
		setApplyIdArr(state,value) {
			state.applyIdArr = value
		},
        setSessionKeyToken(state, value) {
            uni.setStorageSync('token', value);
            state.sessionKeyToken = value
        },
        setLoginInfo(state, value) {
            state.loginInfo = value
        },
        setAdInfo(state, value) {
            state.adInfo = value
        },
		// 设置全局枚举
		setEnum(state, value) {
			state.enum = value
		},
		
		// 设置极光jcid
		setJcid(state, value) {
			state.jiGuang.jcid = value
			state.jiGuang = JSON.parse(JSON.stringify(state.jiGuang))
		}
    },
    getters: {
        currentColor(state) {
            return state.colorList[state.colorIndex]
        },
		currentCity(state) {
			return state.currentCity
		},
		locationCity(state) {
			return state.locationCity
		}
    },
    actions: {
        // 获取openId
        getUserOpenId: async function ({commit, state}, callBack) {
            return await new Promise((resolve, reject) => {
                uni.login({
                    provider:state.provider,
                    success: (loginRes) => {
                        commit('setOpenid', loginRes.code)
                        console.log(loginRes.code,'getCode')
						callBack&&callBack()
                        resolve(loginRes.code)
                    },
                    fail: (err) => {
                        console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
                        reject(err)
                    }
                })
            })
        },
        // 获取用户信息
        getUserInfo: async function ({commit, state}) {
            return await new Promise((resolve, reject) => {
                    getAccountInfoApi().then(res=>{
                        commit('setUserInfo',res.data.content)
                        resolve(res.data.content)
                    })

            })
        },
        //  获取全局数据
        getGlobalInfo: async function ({commit, state}) {
            return await new Promise((resolve, reject) => {
            getGlobalInfoApi({city_id:state.currentCity.id}).then(res=>{
              commit('setGloabData',res.data.content)
                resolve(res.data.content)
            })
            })
        },
		// 获取全局枚举
		getEnum: async function ({commit, state}) {
            return await new Promise((resolve, reject) => {
				getPostParttimeJobEnumApi().then(res=>{
					commit('setEnum',res.data.content.enumList)
					resolve(res.data.content.enumList)
				})
            })
        },

    }
})

export default store
