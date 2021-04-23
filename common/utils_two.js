import {
	recordAdClickApi
} from '@/api/index'

//  根据广告类型去不同页面
export function adClick(data, Vue) {
	const jobDetailPath = '/pages/jobDetail/jobDetail'
	const webViewPath = '/pages/webView/webView'
	const jobListPath = '/pages/jobList/jobList'
	// const jobListPath ='/pages/featurePost/featurePost'
	const employerInfoPath = '/pages/employerInfo/employerInfo'
	let type = data.ad_type
	if (data.ad_id) {
		recordAdClickApi({
			ad_id: data.ad_id
		}).then(res => {
			console.log('广告点击')
		})
	}
	if (data.need_Login && !Vue.$store.state.hasLogin) {
		Vue.openLogin()
		return
	}
	if (type) {
		if (type == 1) {
			let city_id = ''
			if (wx.getStorageSync('current_city') && data.ad_detail_url.indexOf('?') == -1 && data.ad_detail_url.indexOf('city_id') == -1) {
				city_id = '?city_id=' + wx.getStorageSync('current_city').id + '&'
			} else if (wx.getStorageSync('current_city') && data.ad_detail_url.indexOf('city_id') == -1) {
				city_id = '&city_id=' + wx.getStorageSync('current_city').id + '&'
			}
			let url = encodeURIComponent(data.ad_detail_url + city_id)
			let pageType = ''
			if (data.ad_name == '合伙人') {
				pageType = pageType + '&type=partner'
			}
			Vue.$router.push({
				path: webViewPath,
				query: {
					url: url + pageType
				}
			})

		} //  外链
		else if (type == 2) {
			Vue.$router.push({
				path: jobDetailPath,
				query: {
					job_id: data.ad_detail_id,
					ad_id: data.ad_id
				}
			})
		} //  岗位详情
		else if (type == 6) {
			Vue.$router.push({
				path: data.ad_detail_url
			})
		} //  小程序页面
		else if (type == 7) {
			Vue.$router.push({
				path: jobListPath,
				query: {
					id: data.ad_detail_id,
					title: data.ad_name
				}
			})
		} //  岗位列表
		else if (type == 8) {
			Vue.$router.push({
				path: employerInfoPath,
				query: {
					accountId: data.ad_detail_id
				}
			})
		} //  雇主广告
		else {
			uni.showToast({
				title: `广告已被删除请重试${type}`,
				icon: 'none',
			})
		}
	}

}
// 替换对象KEY
// @param Obj 替换对象 ObjKey 替换的键值对
export function replaceKey(Obj, ObjKey) {
	for (let key in ObjKey) {
		Obj[key] = Obj[ObjKey[key]]
		delete Obj[ObjKey[key]]
	}
}
//  根据城市名称获取城市ID
export function getCityId(name, list) {
	for (let i = 0; i < list.length; i++) {
		if (name.indexOf(list[i].name) !== -1) {
			return list[i].id
		} else if (i === list.length) {
			return false
		}
	}
}
