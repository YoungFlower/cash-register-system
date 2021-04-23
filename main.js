import Vue from 'vue'
import App from './App'
import store from './store'

import ald from './libs/ald-stat.js'
import config from './config'
import uView from "uview-ui";
Vue.use(uView);
import '@s/styles/index.scss'
import {toast,openUrl} from '@/common/util.js'
import H5Api from '@/js_sdk/ican-H5Api/ican-H5Api'
Vue.prototype.NODE_ENV = config.nodeEnv
Vue.prototype.domain = config.domain
Vue.prototype.baseUrl = config.baseUrl
Vue.config.productionTip = false
Vue.prototype.$store = store
// #ifndef H5
import router from './router'
Vue.prototype.$router = router
// #endif

Vue.prototype.$toast = toast
Vue.prototype.$openUrl = openUrl

import * as filters from '@/filters/index'
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
