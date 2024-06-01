<template>
	<view class="edit">
		<view class="title">
			<input type="text" v-model="artObj.title" placeholder="请输入标题" placeholder-class="placeholderClass" />
		</view>

		<view class="content">
			<editor class="myEdit" placeholder="写点什么吧~" show-img-size show-img-toolbar show-img-resize
				@ready="onEditReady" @focus="onFocus" @statuschange="onStatuschange">
			</editor>
		</view>

		<view class="btnGroup">
			<u-button @tap="onSubmit" type="primary" color="#fa3534" text="确认发表"
				:disabled="!artObj.title.length"></u-button>
		</view>

		<view class="tools" v-if="toolShow">
			<view class="item" @tap="clickHead">
				<text class="iconfont icon-zitibiaoti" :class="headShow ? 'active' : ''"></text>
			</view>
			<view class="item" @tap="clickBold">
				<text class="iconfont icon-zitijiacu" :class="boldShow ? 'active' : ''"></text>
			</view>
			<view class="item" @tap="clickItalic">
				<text class="iconfont icon-zitixieti" :class="italicShow ? 'active' : ''"></text>
			</view>
			<view class="item" @tap="clickDivider">
				<text class="iconfont icon-fengexian"></text>
			</view>
			<view class="item" @tap="clickInsertImage">
				<text class="iconfont icon-charutupian"></text>
			</view>
			<view class="item" @tap="editOk">
				<text class="iconfont icon-duigou_kuai"></text>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();

	import {
		getImgSrc,
		getProvince
	} from '../../../utils/tools.js';

	export default {
		data() {
			return {
				toolShow: false,
				headShow: false,
				boldShow: false,
				italicShow: false,
				artObj: {
					title: "",
					content: "",
					description: "",
					picurls: "",
				}
			};
		},

		onLoad() {},

		methods: {

			// 初始化
			onEditReady() {
				uni.createSelectorQuery().in(this).select('.myEdit').fields({
					size: true, // 返回节点尺寸
					context: true // 返回节点对应的 Context 对象
				}, res => {
					// console.log(res);
					this.editorCtx = res.context
				}).exec()
			},

			// 解决富文本标题标签不好回弹的问题
			checkStauts(name, detail, obj) {
				if (detail.hasOwnProperty(name)) {
					this[obj] = true;
				} else {
					this[obj] = false;
				}
			},
			// 当样式发生改变的时候
			onStatuschange(e) {
				// console.log(e);
				let detail = e.detail;
				// console.log(detail);
				this.checkStauts("header", detail, "headShow");
				this.checkStauts("bold", detail, "boldShow");
				this.checkStauts("italic", detail, "italicShow");
			},

			// 添加大标题
			clickHead() {
				this.headShow = !this.headShow;
				this.editorCtx.format("header", this.headShow ? 'H2' : false);
			},

			// 加粗
			clickBold() {
				this.boldShow = !this.boldShow;
				this.editorCtx.format("bold");
			},

			// 倾斜
			clickItalic() {
				this.italicShow = !this.italicShow;
				this.editorCtx.format("italic");
			},

			// 插入分割线
			clickDivider() {
				this.editorCtx.insertDivider();
			},

			// 添加图像
			clickInsertImage() {
				uni.chooseImage({
					success: async (res) => {
						uni.showLoading({
							title: "上传中，请稍后",
							mask: true
						})
						// console.log(res.tempFiles);
						for (let item of res.tempFiles) {
							let res = await uniCloud.uploadFile({
								filePath: item.path,
								cloudPath: item.name
							})
							// console.log(res.fileID);
							this.editorCtx.insertImage({
								src: res.fileID
							});
						}
						uni.hideLoading();
					}
				})
			},

			// 点击勾隐藏工具条
			editOk() {
				this.toolShow = false;
			},

			// 获取焦点
			onFocus() {
				this.toolShow = true;
			},

			// 点击提交按钮
			onSubmit() {
				this.editorCtx.getContents({
					success: (res) => {
						this.artObj.description = res.text.slice(0, 50);
						this.artObj.content = res.html;
						this.artObj.picurls = getImgSrc(res.html);
						uni.showLoading({
							title: "添加中..."
						})
						this.addData();
					}
				})
			},

			addData() {
				db.collection("news_articles").add({
					...this.artObj
				}).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: "发布成功"
					});
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/index/index"
						})
					}, 800);
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
			input {
				height: 120rpx;
				font-size: 46rpx;
				border-bottom: 1px solid #e4e4e4;
				margin-bottom: 30rpx;
				color: #000;
			}

			.placeholderClass {
				color: #e0e0e0;
			}
		}

		.content {
			.myEdit {
				height: calc(100vh - 500rpx);
				margin-bottom: 30rpx;
			}
		}

		.tools {
			width: 100%;
			height: 80rpx;
			background: #fff;
			border-top: 1rpx solid #f4f4f4;
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
			justify-content: space-around;
			align-items: center;

			.iconfont {
				font-size: 36rpx;
				color: #333;

				&.active {
					color: #fa3534
				}
			}
		}
	}
</style>