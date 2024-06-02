<template>
	<view class="edit">

		<!-- 标题 -->
		<view class="title">
			<u--input placeholder="请输入标题" border="surround" v-model="formValue.title" clearable></u--input>
		</view>
		<!-- 内容 -->
		<view class="content">
			<u--textarea class="content" v-model="formValue.content" placeholder="请输入内容" autoHeight count
				maxlength="300"></u--textarea>
		</view>

		<!-- 增加图片上传组件 -->
		<view class="pic">
			<uni-file-picker v-model="imageValue" fileMediatype="image" limit="3" mode="grid" @success="uploadSuccess"
				@delete="deleteImage" />
		</view>

		<view class="btn">
			<u-button @tap="onSubmit" type="primary" color="#fa3534" text="确认发表"
				:disabled="!formValue.title.length"></u-button>
		</view>

	</view>
</template>

<script>
	import {
		getImgSrc,
		getProvince
	} from '../../../utils/tools.js';
	const db = uniCloud.database();
	export default {
		data() {
			return {
				formValue: {
					title: "",
					content: ""
				},
				imageValue: [], // 图片文件数组
				picurls: [], // 上传成功后的图片路径数组
			};
		},

		onLoad(options) {
			this.navType = options.navType;
			// 根据 navType 设置其他相关的数据
			this.formValue.tab = this.navType;

			getProvince().then(res => {
				this.formValue.province = res
			})
			console.log(options);
		},

		methods: {
			// 文件上传成功的回调
			uploadSuccess(e) {
				// 将图片上传成功的图片路径存放到数组中
				console.log(e);
				// 使用concat方法将新的路径添加到原数组的末尾
				this.picurls = this.picurls.concat(e.tempFilePaths);
			},

			// 点击删除已经上传的图片
			deleteImage(e) {
				// 从 this.picurls 数组中移除被删除的图片路径
				this.picurls.splice(e.index, 1);
			},

			onSubmit() {
				console.log(this.formValue);
				console.log(this.picurls);
				uni.showLoading({
					title: "添加中..."
				})
				this.addData();
			},
			addData() {
				db.collection("circle_articles").add({
					...this.formValue,
					description: this.formValue.content.slice(0, 50),
					picurls: this.picurls
				}).then(res => {
					console.log(res);
					uni.hideLoading();
					uni.showToast({
						title: "发布成功"
					});
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/circle/circle"
						})
					}, 800);
				}).catch(err => {
					console.error(err);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .ql-blank::before {
		font-style: normal;
		color: #e0e0e0;
	}

	.edit {
		padding: 30rpx;

		.title {
			padding-bottom: 30rpx;
		}

		.content {
			padding-bottom: 30rpx;
		}

		.pic {
			padding-bottom: 30rpx;
		}

	}
</style>