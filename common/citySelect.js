import {
	getCityListApi,
	getProvinceListApi
} from '../api/index.js'
import mockData from './dataList.js'
import store from '@/store/index.js'
import { uploadJcid } from '@co/util.js'
var QQMapWX = require('@/libs/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
	key: '6ZWBZ-EWYWQ-CBG5I-GME4Y-SMO5S-M6BST'
});

// 获取省份城市列表
export function getProvinceListInit(that, callback) {
	uni.getStorage({
		key: 'provinceList',
		success: function(res) {
			let provinceList = setProvinceList(that, res.data)
			if (that) {
				that.provinceList = provinceList
			}
			callback && callback(res.data)
		},
		fail: function() {
			getProvinceListApi().then(res => {
				let data = res.data.content
				uni.setStorage({
					key: 'provinceList',
					data: data
				})
				let provinceList = setProvinceList(that, data)
				if (that) {
					that.provinceList = provinceList
				}
				callback && callback(data)
			})
		}
	});
}

// 设置省份城市列表
export function setProvinceList(that, tempData) {
	let data = JSON.parse(JSON.stringify(tempData))
	// let cityId = 211
	// let addressAreaId = -1
	let cityId = store.state.userInfo.city_id || -1
	let addressAreaId = store.state.userInfo.address_area_id || -1
	let temp = {
		provinceName: '热门',
		cities: []
	}
	let needProvinceIndex = ''
	let needCityIndex = ''
	data.provinces.forEach((provinces, index) => {
		// if (data.hotCitys.length == 0)
		// 	return
		provinces.cities.forEach((cities, indexs) => {
			// if (data.hotCitys.length == 0)
			// 	return

			// console.log(cities.childArea.length == 0 || cities.childArea[cities.childArea.length - 1].name != '不限',cities)
			if (cities.childArea.length == 0 || cities.childArea[cities.childArea.length - 1].name != '不限') {
				cities.childArea.push({
					id: -1,
					name: '不限'
				})
			}
			cities.childArea.forEach(item => {

				item.checked = false
				if (item.id == addressAreaId && cities.id == cityId && that) {
					item.checked = true
					that.provinceIndex = index + 1
					that.cityIndex = indexs
				}
			});
			data.hotCitys.forEach((hotCitys, hotIndex) => {
				if (hotCitys.cityName == cities.name) {
					temp.cities.push(cities)
					data.hotCitys.splice(hotIndex, 1)
					return
				}
			})
		})
	})
	data.provinces.unshift(temp)
	return data.provinces
}

// 获取城市列表
export function cityListInit(that) {
	uni.getStorage({
		key: 'cityList',
		success: function(res) {
			setJianzhikeCityList(res.data, that)
		},
		fail: function() {
			getCityListApi().then(res=> {
				console.log(res);
				
				uni.setStorage({
					key: 'cityList',
					data: res.data.content.cities
				})
				setJianzhikeCityList(res.data.content.cities, that)
			})
			// let cityList = mockData.list
		}
	});
}

// 设置兼职客城市列表
export function setJianzhikeCityList(cityList, that) {
	let FirstPin = ["热门"]
	let cityListReturn = [{
		letter: "热门",
		data: [],
	}]
	let cityListReturnTemp = [
		[]
	]
	cityList.forEach((item, index) => {
		if (item.hot_cities) {
			cityListReturn[0].data.push(item.name)
			cityListReturnTemp[0].push(item)
		}
		const letterIndex = FirstPin.indexOf(item.pinyin_first_letter.toUpperCase())
		if (letterIndex === -1) {
			FirstPin.push(item.pinyin_first_letter.toUpperCase())
			cityListReturn.push({
				letter: item.pinyin_first_letter.toUpperCase(),
				data: [item.name]
			})
			cityListReturnTemp.push([item])
		} else {
			cityListReturn[letterIndex].data.push(item.name)
			cityListReturnTemp[letterIndex].push(item)
		}
	})
	that.options = cityListReturn
	that.optionsCityIdList = cityListReturnTemp
}

// 城市选择
export function selectCity(item, that) {
	store.commit('setCityInfo', {
		name: item.name,
		id: item.id
	})
}

// 重新定位/定位
export function getLocation() {
	// getLocationNext()
	// console.log(store);
	// #ifndef H5
	uni.getSetting({
		success: (res) => {
			if (res.authSetting.hasOwnProperty('scope.userLocation') && res.authSetting['scope.userLocation'] === false) {
				uni.showModal({
					title: '是否授权地理位置信息',
					content: '你的位置信息将用于搜索和推送本地相关职业',
					success: function(tip) {
						if (tip.confirm) {
							uploadJcid('look_detail')
							uni.openSetting({
								success: function(data) {
									if (data.authSetting["scope.userLocation"]) {
										getLocationNext()
									} else {
										failGetLocation()
										uni.showToast({
											title: '授权失败',
											icon: 'none',
											duration: 2000
										})
									}
								}
							})
						} else {
							failGetLocation()
						}
					},
				})
			} else {
				getLocationNext()
			}
		},
	})
	//#endif
}

export function getLocationNext() {
	uni.getLocation({
		success(res) {
			uploadJcid('look_detail')
			console.log(res)
			qqmapsdk.reverseGeocoder({
				location: {
					latitude: res.latitude,
					longitude: res.longitude
				},
				success(addressRes) {
					let address = addressRes.result
					successGetLocation(address)
				},
				fail(res) {
					failGetLocation()
				},
			})
		},
		fail(res) {
			failGetLocation()
		}
	})
}

// 定位成功处理
export function successGetLocation(address) {
	let that = ''
	getProvinceListInit(that, res => {
		const cityObject = getCityIdP(address.address_component.city, res)
		const areaId = getAreaIdP(address.address_component.district, res, cityObject)
		console.log('address', address)
		store.commit('setLocationInfo', {
			name: address.address_component.city,
			id: cityObject.id,
			areaId,
			areaName: address.address_component.district,
			location: address.location
		})
		store.commit('setCityInfo', {
			name: address.address_component.city.replace('市', ''),
			id: cityObject.id,
		})
	})
}

// 定位失败处理
export function failGetLocation() {
	store.commit('setLocationInfo', {
		name: '位置获取失败,轻触重新获取',
		id: '-1'
	})
	store.commit('setCityInfo', {
		name: '福州.',
		id: 211,
	})
}

// 根据城市名称获取城市ID，省份列表
export function getCityIdP(name, list) {
	list = list.provinces
	console.log(list)
	for (let i = 0; i < list.length; i++) {
		for (let j = 0; j < list[i].cities.length; j++) {
			if (name.indexOf(list[i].cities[j].name) !== -1) {
				return {
					id: list[i].cities[j].id,
					indexC: i,
					indexA: j,
				}
			}
		}
	}
	return {
		id: -1,
		indexC: -1,
		indexA: -1,
	}
}

// 根据区域名获取id
export function getAreaIdP(name, list, object) {
	list = list.provinces[object.indexC].cities[object.indexA].childArea
	for (let i = 0; i < list.length; i++) {
		if (name.indexOf(list[i].name) !== -1) {
			return list[i].id
		}
	}
	return -1
}

// 个人信息页面所在城市选择
export function setLocationCity(that, cityObject) {
	store.commit('setSelectLocationCity', cityObject)
	that.$router.go(-1)
}


module.exports = {
	cityListInit,
	selectCity,
	getLocation,
	getProvinceListInit,
	getCityIdP,
	getAreaIdP,
	setLocationCity
}
