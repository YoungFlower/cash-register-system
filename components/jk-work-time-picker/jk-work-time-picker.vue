<template>
	<view class="workTime">
		<u-picker  v-model="show" :range="workColumns" mode="selector" :title="title" @confirm="onConfirm"></u-picker>
	</view>
</template>

<script>
	// import wPicker from "@/components/w-picker/w-picker.vue";
	import {
		parseTime
	} from '@co/util.js'
	export default {
		components: {
			// wPicker
		},
		props:{
			title: {
				type: String,
				default: '',
			},
			canEmpty: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				show:false,
				workColumns:[],
			};
		},
		mounted() {
			this.setWorkColumns()
		},
		methods: {
			onConfirm(e) {
				this.$store.commit('setUserStartWorkTimeNew',this.workColumns[e]=='请选择'?'':this.workColumns[e])
				// console.log(this.workColumns[e])
			},
			showModal() {
				this.show=true
			},
			// // 设置参加工作年份选项
			// setWorkColumns(){
			//    let workColumns=[{value:'在校生',label:'在校生'},{value:'应届生',label:'应届生'}]
			//    let year = (parseInt(parseTime((new Date()).valueOf()).substr(0, 7)).toString())
			//    for(let i=year;i>=year-9;i--){
			//     workColumns.push({value:i+'年',label:i+'年'})
			//     if(i==year-9)
			//     workColumns.push({value:(i-1)+'年以前',label:(i-1)+'年以前'})
			//    }
			//    this.workColumns=workColumns
			//    console.log(workColumns)
			// },
			// 设置参加工作年份选项
			setWorkColumns(){
			   let workColumns=['在校生','应届生']
			   let year = (parseInt(parseTime((new Date()).valueOf()).substr(0, 7)).toString())
			   for(let i=year;i>=year-9;i--){
			    workColumns.push(i+'年')
			    if(i==year-9)
			    workColumns.push((i-1)+'年以前')
			   }
			   if(this.canEmpty) {
			   	workColumns.unshift('请选择')
			   }
			   this.workColumns=workColumns
			   console.log(workColumns)
			},
		},
	}
</script>

<style lang="scss">
</style>
