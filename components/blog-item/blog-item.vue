<template>
	<view class="blogitem">
		<view class="head">
			<view class="userinfo">
				<view class="avatar">
					<image :src="giveAvatar(item)" mode="aspectFill"></image>
				</view>
				<view class="name">{{giveName(item)}}</view>
				<view class="time">
					<uni-dateformat :date="item.publish_date" format="MM月dd hh:mm"
						:threshold="[60000,3600000*24*30]"></uni-dateformat>
				</view>
			</view>

			<view class="more">
				<text class="iconfont icon-ellipsis" @tap="clickMore"></text>
			</view>
		</view>

		<view class="body">
			<view class="title" @tap="goDetail">{{item.title}}</view>
			<view class="text" @tap="goDetail">
				<view class="t">{{item.description}}</view>
			</view>
			<view class="piclist">
				<view class="pic" :class="item.picurls.length==1 ? 'only': ''" v-for="(pic,index) in item.picurls"
					:key="index">
					<image @tap="clickPic(index)" :src="pic" mode="aspectFill"></image>
				</view>
			</view>
		</view>

		<view class="info">
			<view class="box">
				<text class="iconfont icon-yanjing"></text> <text>{{item.view_count}}</text>
			</view>
			<view class="box" @tap="goDetail">
				<text class="iconfont icon-xiaoxi-zhihui"></text>
				<text>{{item.comment_count ? item.comment_count : "评论"}}</text>
			</view>
			<view class="box" :class="isLike ? 'active' : ''" @tap="clickLike">
				<text class="iconfont icon-dianzan"></text>
				<text>{{item.like_count ? item.like_count : "点赞"}}</text>
			</view>
		</view>
		<u-action-sheet :actions="list" cancelText="取消" :show="sheetShow" :closeOnClickOverlay="true"
			:closeOnClickAction="true" @select="sheetSelect" @close="onClose"></u-action-sheet>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const dbCmd = db.command;

	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	import {
		giveName,
		giveAvatar,
		likeCirFun
	} from "../../utils/tools.js"
	import pageJson from "@/pages.json"

	export default {
		name: "blog-item",
		props: {
			item: {
				type: Object,
				default () {
					return {}
				}
			},
			like_count: Number
		},
		data() {
			return {
				isLike: false,
				sheetShow: false,
				list: [{
					name: "修改",
					type: "edit"
				}, {
					name: "删除",
					type: "del",
					color: "#F56C6C",
					disabled: true
				}]
			};
		},

		mounted() {
			console.log(this.item);
			this.checkLikeStatus()

		},

		onLoad() {
			this.checkLikeStatus();
		},


		methods: {
			giveName,
			giveAvatar,

			// 选择操作菜单
			sheetSelect(e) {
				this.sheetShow = false;
				let type = e.type;
				console.log(type);
				if (type == 'del') {
					this.delFun();
				}
			},
			// 关闭操作菜单弹窗
			onClose() {
				this.sheetShow = false
			},
			// 点击更多操作
			clickMore() {
				// 获取当前登录用户的id
				let uid = uniCloud.getCurrentUserInfo().uid;
				if (uid == this.item.user_id[0]._id || this.uniIDHasRole('admin') || this.uniIDHasRole(
						'Circle Manager')) { // 如果当前登录用户的id等于发布者的id或当前账号为管理员
					this.list.forEach(item => {
						item.disabled = false
					})
				}
				this.sheetShow = true
			},
			// 删除文章方法
			delFun() {
				uni.showLoading({
					title: "加载中"
				})
				db.collection("circle_articles").doc(this.item._id).update({
					delState: true
				}).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: "删除成功",
						icon: "none"
					})
					this.$emit("delEvent", true)
				}).catch(err => {
					uni.hideLoading()
				})
			},

			// 查询当前用户是否点赞过某篇文章的方法
			async checkLikeStatus() {
				if (!store.hasLogin) return;

				let count = await db.collection("circle_like").where(
					`article_id == '${this.item._id}' && user_id == $cloudEnv_uid `).count();

				console.log(count);

				if (count.result.total) this.isLike = true; // 如果点过赞，返回true
			},


			// 点赞操作
			async clickLike() {
				if (!store.hasLogin) {
					uni.showModal({
						title: "是否登录？",
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: "/" + pageJson.uniIdRouter.loginPage
								})
							}
						}
					})
					return;
				}

				let time = Date.now();
				if (time - this.likeTime < 2000) {
					uni.showToast({
						title: "请勿频繁操作",
						icon: "none"
					})
					return;
				}

				this.likeTime = time;
				this.isLike = true;

				let count = await db.collection("circle_like").where(
					`article_id == '${this.item._id}' && user_id == $cloudEnv_uid `).count();

				let like_count = this.item.like_count;
				if (!count.result.total) like_count++; // 如果当前登录用户之前没有点赞，实现前端无感点赞交互
				this.$emit("update:like_count", like_count)

				likeCirFun(this.item._id); // 调用 likeCirFun 函数并获取返回值
			},

			// 点击跳转到详情页
			goDetail() {
				uni.navigateTo({
					url: "/pages/circle/detail/detail?id=" + this.item._id
				})
			},

			// 单击图片预览
			clickPic(index) {
				uni.previewImage({
					urls: this.item.picurls,
					current: index
				})
			}
		}
	}
</script>

<style lang="scss">
	.blogitem {
		.head {
			display: flex;
			font-size: 32rpx;
			align-items: center;
			justify-content: space-between;

			.userinfo {
				display: flex;
				align-items: center;

				.avatar {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					border-radius: 50%;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
						display: block;
					}
				}

				.name {
					color: #222;
					padding-left: 10rpx;
				}

				.time {
					color: #888;
					font-size: 22rpx;
					padding-left: 20rpx;
				}
			}

			.more {
				padding: 5rpx;

				.iconfont {
					font-size: 50rpx;
					color: #888;
				}
			}
		}

		.body {
			padding: 15rpx 0 30rpx;

			.title {
				font-size: 44rpx;
				color: #000;
				font-weight: 600;
				text-align: justify;
			}

			.text {
				padding-top: 10rpx;
				padding-bottom: 10rpx;
				font-size: 30rpx;
				text-align: justify;
				color: #888;

				.t {
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}

			.piclist {
				display: flex;
				padding-top: 20rpx;

				.pic {
					width: 225rpx;
					height: 225rpx;
					margin-right: 6rpx;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}

					&:first-child {
						border-radius: 20rpx 0 0 20rpx;
					}

					&:last-child {
						border-radius: 0 20rpx 20rpx 0;
					}

					&.only {
						border-radius: 20rpx;
					}

				}

			}
		}

		.info {
			display: flex;
			align-items: center;
			justify-content: space-around;
			font-size: 26rpx;
			color: #333;

			.box {
				display: flex;
				align-items: center;
				padding: 15rpx 0 5rpx;
				flex: 1;
				display: flex;
				justify-content: center;

				.iconfont {
					font-size: 40rpx;
					padding-right: 10rpx;
				}
			}

			.box.active {
				color: #fa3534;
			}
		}
	}
</style>