import {
	saveResumeInfoApi,
	baseInfoAddApi,
	saveCertificateApi,
	jobApplyBaseInfoCheckApi,
	jobApplyLimitCheckApi,
	recommendJobApi,
	applyJobListApi,
	applyJobApi
} from '../api/index.js'
import store from '@/store/index.js'
import { uploadJcid } from '@co/util.js'
import {
	parseTime
} from '@co/util.js'

// 报名前数据准备  选择时间
export function applyReady(that, applyDetail) {
	// checkApplyList(that)
	// return
	// 判断是否登录
	uploadJcid('apply')
	if(!store.state.hasLogin) {
		// that.openLogin()
		return
	}
	store.commit('setApplyDetail', applyDetail)
	let selectMinDate = (new Date()).valueOf()
	let selectMaxDate = applyDetail.apply_dead_time || ''
	let isAccurate = applyDetail.is_accurate_job
	let jobClassify = applyDetail.job_classify_type
	if (isAccurate && jobClassify == 2) {
		if (selectMaxDate - selectMinDate > 3600 * 24 * 1000) {
			that.$refs.workTimeSelect.openUcalendar(parseTime(selectMinDate), parseTime(selectMaxDate))
		} else {
			baseInfoCheck(that)
		}
	} else {
		baseInfoCheck(that)
	}

}

// 基础信息校验
export function baseInfoCheck(that) {

	let applyDetail = store.state.applyDetail
	if (applyDetail.job_classify_type != 1) {
		jobApplyBaseInfoCheckApi().then(res => {
			if (!res.data.content.result) {
				// let backContent = '{"trueName":0,"sex":0,"birthday":0,"cityId":0,"startWorkTime":1,"education":1}' //测试
				let backContent = JSON.stringify(res.data.content.fields)
				that.$router.push({
					path: '/pages/perfectBaseInfo/perfectBaseInfo',
					query: {
						backContent: backContent
					}
				})
			} else {
				jobApplyLimitCheck(that)
			}
		})
	} else {
		jobApplyLimitCheck(that)
	}
}

// 报名前限制条件校验
export function jobApplyLimitCheck(that, pageType = 0) {
	let applyDetail = store.state.applyDetail
	jobApplyLimitCheckApi({
		partTimeJobId: applyDetail.job_id || applyDetail.job_uuid
	}).then(res => {
		if (!res.data.content.result) {
			let backContent = JSON.stringify(res.data.content.fields)
			// let backContent = JSON.stringify({
			//     sex: 1,
			// birthday: 1,
			// startWorkTime: 1,
			// education: 1,
			// height: 1,
			// idCardVerifyStatus: 1,
			// lifePhotoUrl: 1,
			// healthCer: 1,
			// stuIdCard: 1,
			// userType: 1,
			// resumeExperience: 1,
			// })
			if (pageType === 0) {
				that.$router.push({
					path: '/pages/limitInfo/limitInfo',
					query: {
						backContent: backContent
					}
				})
			} else {
				that.$router.replace({
					path: '/pages/limitInfo/limitInfo',
					query: {
						backContent: backContent
					}
				})
			}
		} else {
			mainApplyJob(that)
		}
	})
}

// // 报名主流程
// export function mainApplyJob(that) {
// 	let selectMinDate = (new Date()).valueOf()
// 	let applyDetail = store.state.applyDetail
// 	let selectMaxDate = applyDetail.apply_dead_time || ''
// 	// let isAccurate = applyDetail.is_accurate_job
// 	// let jobClassify = applyDetail.job_classify_type
// 	// if (isAccurate && jobClassify == 2) {
// 	// 	if (selectMaxDate - selectMinDate > 3600 * 24 * 1000) {
// 	// that.$refs.workTimeSelect.openUcalendar(parseTime(selectMinDate), parseTime(selectMaxDate))
// 	// 	} else {
// 	mainApplyJobAfterSelectTime(that)
// 	// 	}
// 	// } else {
// 	// 	mainApplyJobAfterSelectTime(that)
// 	// }
// }

// 选择上岗时间后的报名流程
export function mainApplyJob(that) {
	let applyDetail = store.state.applyDetail
	let jobId = applyDetail.job_uuid
	let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
	let curRoute = routes[routes.length - 1].route
	applyJobApi({
		job_uuid: jobId,
		stu_work_time:  applyDetail.timeArry || []
	}).then(res => {
		let applyIdArr = store.state.applyIdArr || []
		if(res.data.errCode === 0) {
			applyIdArr.push(jobId)
			uploadJcid('reservation')
		}
		store.commit('setApplyIdArr', applyIdArr)
		// let res = {
		// 	data: {
		// 		errMsg: '报名成功'
		// 	}
		// }
		setApplyResultPage(applyDetail, res.data.errCode===0? '报名成功':res.data.errMsg)
		checkApplyList(that, applyDetail.job_id)
	})
}


// 校验是否一键报名
export function checkApplyList(that, jobId) {
	recommendJobApi({
		job_id: jobId,
		city_id: store.state.userInfo.city_id
	}).then(res => {
		// that.$refs.popupApplyList.openApplyList([{jobId: 930580, jobSalary: "1122-22222元/次", jobTitle: "要女的"},
		// 	 {jobId: 930554, jobSalary: "250-300元/日", jobTitle: "线上岗位-3"},
		// 	{jobId: 930502, jobSalary: "5000-8000元/次", jobTitle: "全职发的发顺丰"}])
		if (res.data.errCode==0 && res.data.content.is_recommend) {
			that.$refs.popupApplyList.openApplyList(res.data.content.job_imformation_list)
		} else {
			goToApplyResult(that)
		}
	})
}

// 一键报名
export function applyListFun(that, jobIdArry) {
	if (jobIdArry.length > 0) {
		uni.showToast({
			title: '加载中',
			icon: 'loading',
			mask: true,
		})
		applyJobListApi({
			job_ids: JSON.stringify(jobIdArry)
		}).then(res => {
			uni.hideToast()
			goToApplyResult(that,res.data.errCode==0?res.data.content.apply_result_list:[])
		})
	} else {
		goToApplyResult(that)
	}
}


// 前往报名结果页
export function goToApplyResult(that, applyList = []) {
	let pages = getCurrentPages();
	let currentPage = pages[pages.length - 1].route
	that.closeApplyList&&that.closeApplyList()
	if (currentPage == 'pages/limitInfo/limitInfo' ||
		currentPage == 'pages/perfectBaseInfo/perfectBaseInfo') {
		that.$router.replace({
			path: '/pages/applyResult/applyResult',
			query: {
				applyDetail: store.state.applyResultDetail,
				applyList: JSON.stringify(applyList)
			}
		})
	} else {
		that.$router.push({
			path: '/pages/applyResult/applyResult',
			query: {
				applyDetail: store.state.applyResultDetail,
				applyList: JSON.stringify(applyList)
			}
		})
	}
}


// 设置报名结果页面需要的参数
export function setApplyResultPage(jobData, errMsg = '报名成功') {
	var contactData = {};
	if (jobData.wechat_public) {
		contactData = {
			type: 1,
			contact: jobData.wechat_public
		}
	} else if (jobData.qq_group) {
		contactData = {
			type: 5,
			contact: jobData.qq_group
		}
	} else if (jobData.wechat_number) {
		contactData = {
			type: 2,
			contact: jobData.wechat_number
		}
	} else if (jobData.qq_number) {
		contactData = {
			type: 3,
			contact: jobData.qq_number
		}
	} else if (jobData.other) { //TODO 备用联系方式
		contactData = {
			type: 6,
			contact: jobData.other
		}
	} else {
		contactData = {
			type: 4,
			contact: jobData.contact && jobData.contact.phone_num
		}
	}
	contactData.jobId = jobData.job_id
	contactData.jobType = jobData.job_classify_type
	contactData.accountId = jobData.account_id
	contactData.errMsg = errMsg
	contactData.otherContact = (jobData.contact && jobData.contact.spare_phone_number) || ''
	// return JSON.stringify(contactData)
	store.commit('setApplyResultDetail', JSON.stringify(contactData))
}

// 报名前工作经历校验（精准简历
export function jobPreciseResumeCheck(callBack, jobId) {
	jobPreciseResumeCheckApi({
		partTimeJobId: jobId
	}).then(res => {
		if (res.data.content.result) {
			wx.showModal({
				title: '提示',
				content: '完善工作经历可以大大提升您的录取率哦',
				confirmText: '继续投递',
				confirmColor: '#19C7EA',
				cancelText: '立即完善',
				success: function(res) {
					if (res.confirm) {
						callBack()
					} else if (res.cancel) {
						let pages = getCurrentPages();
						let prevPage = pages[pages.length - 1];
						if (prevPage.route != 'perfectResume/pages/perfectLimit/index' && prevPage.route !=
							'perfectResume/pages/basicInfo/index') {
							wx.navigateTo({
								url: '/pages/workExperience/index?jobId=' + jobId + '&saveType=2',
							})
						} else {
							wx.redirectTo({
								url: '/pages/workExperience/index?jobId=' + jobId + '&saveType=2',
							})
						}
					}
				}
			})
		} else {
			callBack()
		}
	})
}
