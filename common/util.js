import router from "@/router";
import config from "@/config";
import store from '@/store/index.js'
let upImageUrl = config.baseUrl + config.upImageUrl
// 简化提示框
export const toast = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

// 打开外链 适配H5
export const openUrl = (url) => {
	// #ifdef H5
	window.location.href = url
	// #endif
	// #ifndef H5
	router.push({
		path: '/pages/webView/webView',
		query: {
			url: url
		}
	})
	// #endif
}

// 时间戳转标准时间
export const parseTime = function(time, cFormat) {
	if (arguments.length === 0) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

// 保存图片到手机
export function saveImg(url) {
	uni.downloadFile({
		url: url,
		success: (res) => {
			if (res.statusCode === 200) {
				console.log('下载成功');
				uni.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success: function(res) {
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						})
					}
				});
			}
		}
	});
}

// 复制文本
export function copyToClipboard(text, callback) {

	return new Promise((resolve, reject) => {
		uni.setClipboardData({
			data: text,
			success: function() {
				resolve()
			}
		})
	})
}

// 深拷贝对象
export function deepClone(source) {
	return _deepClone(source)

	function _deepClone(source) {
		let target;
		if (typeof source === 'object') {
			target = Array.isArray(source) ? [] : {}
			for (let key in source) {
				if (source.hasOwnProperty(key)) {
					if (typeof source[key] !== 'object' || source[key] == null) {
						target[key] = source[key]
					} else {
						target[key] = _deepClone(source[key])
					}
				}
			}
		} else {
			target = source
		}
		return target
	}
}


//  获取当前页面url上的参数
//  @name String  参数名
export const getQueryString = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", 'i');
	var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
	var r2 = window.location.hash.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
	if (r != null) return decodeURIComponent(r[2]);
	if (r2 != null) return decodeURIComponent(r2[2]);
	if (window.location.hash && window.location.hash.indexOf('?') != -1) {
		var r3 = window.location.hash.split('?')[1].match(reg) //hash,剔除掉路由查询？后面的参数，并匹配正则
		if (r3 != null) return decodeURIComponent(r3[2]);
	}
	return null;
}

// 替换对象KEY
// @param Obj 替换对象 ObjKey 替换的键值对
export function replaceKey(Obj, ObjKey) {
	for (let key in ObjKey) {
		Obj[key] = Obj[ObjKey[key]]
		delete Obj[ObjKey[key]]
	}
}

// 替换对象KEY(下划线转驼峰)
// @param Obj 替换对象 type:toLine则转下划线,否则转驼峰
export function changeKey(Obj, type) {
	for (let key in Obj) {
		let newKey
		if (type == 'toLine') {
			newKey = toLine(key)
		} else {
			newKey = toHump(key)
		}

		Obj[newKey] = Obj[key]
		delete Obj[key]
	}
	return Obj

	// 下划线转换驼峰
	function toHump(name) {
		return name.replace(/\_(\w)/g, function(all, letter) {
			return letter.toUpperCase();
		});
	}

	// 驼峰转换下划线
	function toLine(name) {
		return name.replace(/([A-Z])/g, "_$1").toLowerCase();
	}

}

//  获取删除url上的参数
//  @url String  地址
//  @name String  参数名
//  @nvalue String  参数名
//  Return String
export function urlDelParam(url, name) {
	let urlArr = decodeURIComponent(url).split('?');
	if (urlArr.length > 1 && urlArr[1].indexOf(name) > -1) {
		let query = urlArr[1];
		let arr = query.split("&");
		let urlte = urlArr[0] + '?'
		let paramStr = ''
		for (let i = 0; i < arr.length; i++) {
			let key = arr[i].split("=")[0]
			let value = arr[i].split("=")[1];
			if (key !== name) {
				paramStr = i === 0 ? paramStr : paramStr + '&'
				paramStr = paramStr + key + '=' + value
			}
		}
		return urlte + paramStr;
	} else {
		return url;
	}
}

//  将参数拼接到路径上
export function putParameterToUrl(values, sURL) {
	let params = "";
	for (let v in values) {
		if (v !== undefined) {
			params = v + '=' + values[v];
		}
	}
	if (sURL.indexOf('?') === -1) {
		params = '?' + params;
	} else{
		params = '&' + params;
	}
	return sURL + params;
}

// 上传图片
export function upImage(callback,type) {
	console.log(type)
	uni.chooseImage({
		count: 1, //选择的图片数量
		sourceType: type,
		success: (res) => {
			console.log(res,'choose')
			uni.showLoading({
				title: '正在加载中....',
				mask: true,
			})
			const tempFilePaths = res.tempFilePaths
			uni.uploadFile({
				url: upImageUrl, //服务端地址
				filePath: tempFilePaths[0],
				name: 'file', //图片的key
				formData: {}, //除了图片的其他参数
				success: (res) => { //请求成功回调 这里收到的是服务端下发 的数据
					var data = res.data
					if (typeof data == 'string') {
						data = JSON.parse(data)
					}
					uni.hideLoading();
					// 获取图片url
					callback(data.content.fileUrl)
				}
			})
		}
	})
}


// 上报获取到的jcid值
export function uploadJcid(event) {
    console.log('开始上报！')
	if(!store.state.jiGuang.jcid) {
		return
	}
    let params = {
        product_id: store.state.jiGuang.product_id,
        event: event,
        ts: new Date().getTime(),
        jcid: store.state.jiGuang.jcid,
    }
    wx.request({
        url: 'https://bj8-api.ad.jiguang.cn/v3/push/trk/h5track',
        method: 'get',
        data: params,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        success: (e) => {
            console.log('上报成功')
        },
        fail: (err) => {
            console.log(err, '上报失败')
        },
        complete: (e) => {
            console.log('上报结束')
        }
    })
}