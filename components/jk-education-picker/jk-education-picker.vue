<template>
	<view class="workTime">
		<u-picker  v-model="show" :range="list" mode="selector" :title="title" @confirm="onConfirm" range-key="name"></u-picker>
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
				list:[],
			};
		},
		mounted() {
			this.setList()
		},
		methods: {
			onConfirm(e) {
				console.log(e)
				this.$store.commit('setUserEducation',this.list[e].name == '请选择'?{name:'',id:''}:this.list[e])
				// console.log(this.workColumns[e])
			},
			showModal() {
				this.show=true
			},
			setList() {
				this.list=this.$store.state.enum.listResumeEducationTypeEnum
				if(this.canEmpty) {
					this.list.unshift({
						name:'请选择',
						id:''
					})
				}
			}
		},
	}
</script>

<style lang="scss">
</style>
