import {
	saveResumeInfoApi,
	baseInfoAddApi,
	saveCertificateApi,
	jobApplyLimitAddApi,
	uploadPhotoApi
} from '../api/index.js'
import store from '@/store/index.js'
import {
	jobApplyLimitCheck,
	mainApplyJob
} from '@co/signUp.js'

// 个人简历保存
export function saveBaseInfo(that) {
	let userInfo = store.state.userInfo
	if (!verify(userInfo))
		return
	let param = {
		true_name: userInfo.true_name,
		city_id: userInfo.city_id ? userInfo.city_id : '',
		address_area_id: userInfo.address_area_id && userInfo.address_area_id != -1 ? userInfo.address_area_id : '',
		sex: userInfo.sex,
		user_type: (userInfo.user_type || userInfo.user_type == 0 ? userInfo.user_type : '').toString(),
		birthday: userInfo.birthday,
		education: userInfo.education || userInfo.education == 0 ? userInfo.education : '',
		start_work_time: setPostStart(userInfo.start_work_time_new),
		profile_url: userInfo.profile_url||'',  // 保存名字时候  若没有默认头像  会自动生成一个新的头像，  所以当前用户有头像的话 必须传一个头像参数
		profession: userInfo.profession || '',
		specialty: userInfo.specialty || ''
	}
	saveResumeInfoApi(param).then(res => {
		if (res.data.errCode == 0) {
			uni.showToast({
				title: '保存成功',
				icon: 'success',
				success() {
					store.dispatch('getUserInfo')
					that.$router.go(-1)
				}
			})

		}
	})
}

// 传参工作日期操作
export function setPostStart(workTime) {
	workTime = workTime ? workTime.substr(0, 4) : ''
	if (workTime == '应届生' || workTime == '毕业生') {
		return workTime
	} else {
		return workTime + '-01'
	}

	// let workColumns = ['在校生', '应届生']
	// let year = parseTime((new Date).valueOf()).substr(0, 4)
	// for (let i = year; i >= year - 9; i--) {
	// 	workColumns.push(i + '年')
	// 	if (i == year - 9)
	// 		workColumns.push((i - 1) + '年以前')
	// }
	// this.setData({
	// 	workColumns
	// })
}

// 个人简历保存校验
export function verify(userInfo) {
	let NAME = /^([A-Za-z]|[\u4E00-\u9FA5]){2,10}$/
	let flag = true
	let toastTitle = ''
	if (!userInfo.true_name) {
		toastTitle = '请填写姓名'
		flag = false
	} else if (!userInfo.true_name || !NAME.test(userInfo.true_name)) {
		toastTitle = '请填2~10位的中文字符'
		flag = false
	} else if ((!userInfo.sex && userInfo.sex != 0) || (userInfo.sex != 1 && userInfo.sex != 0)) {
		toastTitle = '请填写性别'
		flag = false
	} else if (!userInfo.birthday) {
		toastTitle = '请填写出生年月'
		flag = false
	} else if (!userInfo.city_name) {
		toastTitle = '请填写所在城市'
		flag = false
	} else if (!userInfo.start_work_time_new || userInfo.start_work_time_new == undefined || userInfo.start_work_time_new ==
		null) {
		toastTitle = '请填写参加工作年份'
		flag = false
	} else if (!userInfo.education_str) {
		toastTitle = '请选择您的最高学历'
		flag = false
	}
	if (!flag) {
		uni.showToast({
			title: toastTitle,
			icon: 'none'
		})
	}
	return flag
}

export function verifyPerfectBase(that) {
	let backContent = that.backContent
	if (!backContent.trueName)
		return true
	let NAME = /^([A-Za-z]|[\u4E00-\u9FA5]){2,10}$/
	let flag = true
	let toastTitle = ''
	if (!that.userInfo.true_name) {
		toastTitle = '请填写姓名'
		flag = false
	} else if (!NAME.test(that.userInfo.true_name)) {
		toastTitle = '请填2~10位的中文字符'
		flag = false
	}
	if (!flag) {

		uni.showToast({
			title: toastTitle,
			icon: 'none'
		})
	}
	return flag
}

// 完善简历保存
export function savePerfectBaseInfo(that) {
	let userInfo = that.userInfo
	if (verifyPerfectBase(that)) {
		baseInfoAddApi({
			true_name: userInfo.true_name ? userInfo.true_name : '',
			resume_city_id: userInfo.city_id ? userInfo.city_id : '',
			address_area_id: userInfo.address_area_id ? userInfo.address_area_id : '',
			sex: (userInfo.sex || userInfo.sex == 0) ? userInfo.sex : '',
			birthday: userInfo.birthday ? userInfo.birthday : '',
			education: userInfo.education || userInfo.education == 0 ? userInfo.education : '',
			start_work_time: setPostStart(userInfo.start_work_time_new),
		}).then(res => {
			if (res.data.errCode == 0) {
				uni.showToast({
					title: '保存成功',
					success() {
						store.dispatch('getUserInfo')
						jobApplyLimitCheck(that, 1)
					}
				})
			}
		})
	}
}

// 保存相关证件信息
export function saveVerifyInfo(that) {
	if (verifyVerifyInfo(that)) {
		let param = {
			resume_certificate_id: '',
			type: that.cardType == 0 ? 2 : 1,
			name: that.fromList[that.cardType].title,
			photo_url: that.userInfo[that.fromList[that.cardType].key + 'CardUrl'],
			card_number: that.userInfo[that.fromList[that.cardType].key + 'CardCode']
		}
		saveCertificateApi(param).then(res => {
			let temp = {
				key: that.fromList[that.cardType].key + 'State',
				value: 1
			}
			store.commit('setUserInfoKeyValue', temp)
			that.$router.go(-1)
		})
	}
}


// 证件信息校验
export function verifyVerifyInfo(that) {
	let flag = true
	let toastTitle = ''
	if (!that.userInfo[that.fromList[that.cardType].key + 'CardCode']) {
		toastTitle = '请填写证件号码'
		flag = false
	} else if (!that.userInfo[that.fromList[that.cardType].key + 'CardUrl']) {
		toastTitle = '请选择证件图片'
		flag = false
	}
	if (!flag) {
		uni.showToast({
			title: toastTitle,
			icon: 'none'
		})
	}
	return flag
}


// 保存限制条件
export function saveLimitInfo(that) {
	uploadPhotoEvent(that, () => {
		let userInfo = that.userInfo
		jobApplyLimitAddApi({
			sex: (userInfo.sex || userInfo.sex == 0) ? userInfo.sex : '',
			birthday: userInfo.birthday ? userInfo.birthday : '',
			height: userInfo.height ? userInfo.height : '',
			lifePhotoUrl: that.photo_url,
			userType: (userInfo.user_type || userInfo.user_type == 0) ? userInfo.user_type : ''
		}).then(res => {
			if (res.data.errCode == 0) {
				wx.showToast({
					title: '保存成功',
					success() {
						store.dispatch('getUserInfo')
						mainApplyJob(that)
						// jobPreciseResumeCheck(() => mainApplyJob(that,wx.getStorageSync('jobUuid'), wx.getStorageSync('successUrl')), that.data.jobId)
					}
				})
			}
		})
	})
}



// 保存生活照
export function uploadPhotoEvent(that, callBack) {
	if(that.photo_url) {
		uploadPhotoApi({
			photo_url: that.photo_url,
			photo_type: 1,
		}).then(res => {
			if (res.data.errCode == 0) {
				callBack && callBack()
			} else {
				uni.showToast({
					title: '上传生活照失败',
					icon: 'none'
				})
			}
		})
	} else {
		callBack && callBack()
	}
	
}
