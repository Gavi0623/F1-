<template>
	<view class="user">
		<!-- 自定义导航栏 -->
		<nav-bar :re="re"></nav-bar>

		<view class="top">
			<view class="group" @tap="toUserInfo">
				<view class="userinfo">
					<view class="pic">
						<image v-if="hasLogin && userInfo.avatar_file && userInfo.avatar_file.url"
							:src="userInfo.avatar_file.url" mode="aspectFill"></image>
						<image v-else src="../../static/images/user-default.jpg" mode="aspectFill"></image>
					</view>

					<view class="text" v-if="hasLogin">
						<view class="nickname">
							<view class="nickname">{{userInfo.nickname || userInfo.username || userInfo.mobile}}</view>
						</view>
						<view class="year">
							<uni-dateformat :date="date" :threshold="[3600,99*365*24*60*60*1000]"></uni-dateformat>
							注册
						</view>
					</view>
					<view class="text" v-else>
						<view class="nickname">点击登录</view>
					</view>

				</view>

				<view class="more">
					<text class="iconfont icon-arrow-right-copy-copy"></text>
				</view>
			</view>

			<view class="bg">
				<image src="../../static/images/user-default.jpg" mode="aspectFill"></image>
			</view>
		</view>



		<view class="main">
			<view class="info">
				<view class="item"><text>{{totalObj.likeNum}}</text>&nbsp;获赞</view>
				<!-- <view class="item"><text>11</text>&nbsp;评论</view> -->
				<view class="item"><text>{{totalObj.artNum}}</text>&nbsp;发文</view>
			</view>

			<view class="list">
				<view class="group">
					<view class="item" @tap="myArticle">
						<view class="left">
							<text class="iconfont icon-bianji"></text>
							<text class="text">我的长文</text>
						</view>
						<view class="right">
							<text class="iconfont icon-arrow-right-copy-copy"></text>
						</view>
					</view>
					<view class="item" @tap="myLike">
						<view class="left">
							<text class="iconfont icon-xihuan"></text><text class="text">我的点赞</text>
						</view>
						<view class="right">
							<text class="iconfont icon-arrow-right-copy-copy"></text>
						</view>
					</view>
					<!-- <view class="item">
						<view class="left">
							<text class="iconfont icon-xiaoxi-zhihui"></text><text class="text">评论过的</text>
						</view>
						<view class="right">
							<text class="iconfont icon-arrow-right-copy-copy"></text>
						</view>
					</view> -->
				</view>

				<view class="group">
					<view class="item">
						<view class="left">
							<text class="iconfont icon-guanyu1"></text><text class="text">关于</text>
						</view>
						<view class="right"><text class="iconfont icon-arrow-right-copy-copy"></text></view>
					</view>
					<view class="item" @tap="goFeedback">
						<view class="left">
							<text class="iconfont icon-fankui"></text><text class="text">意见反馈</text>
						</view>
						<view class="right"><text class="iconfont icon-arrow-right-copy-copy"></text></view>
					</view>
				</view>

				<view class="group">
					<view class="item" @tap="logout">
						<view class="left">
							<text class="iconfont icon-tuichu"></text><text class="text">退出登录</text>
						</view>
						<view class="right"><text class="iconfont icon-arrow-right-copy-copy"></text></view>
					</view>
				</view>
			</view>
		</view>
		<!-- {{userInfo}} -->

	</view>
</template>

<script>
	const db = uniCloud.database();

	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'

	export default {
		data() {
			return {
				totalObj: {
					artNum: 0,
					likeNum: 0
				},
				date: null,
				re: false
			};
		},
		onLoad() {
			this.getTotal();
			this.getData();
		},
		onShow() {
			this.getTotal();
			this.getData();
		},
		onPullDownRefresh() {
			this.getTotal();
			this.getData();
			uni.stopPullDownRefresh();
		},
		computed: {
			userInfo() {
				console.log(store.userInfo);
				return store.userInfo
			},
			hasLogin() {
				console.log(store.hasLogin);
				return store.hasLogin
			},
		},
		methods: {
			getData() {
				if (!this.hasLogin) return;
				db.collection("uni-id-users").where("_id == $cloudEnv_uid").field("_id,register_date").get().then(
					async res => {
						console.log(res);
						this.date = await res.result.data[0].register_date; // 获取当前用户注册时间
					})
			},

			// 编辑个人资料
			toUserInfo() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
				})
			},

			// 统计
			async getTotal() {
				if (!this.hasLogin) return;
				// 统计当前用户发文
				let artCount = await db.collection("circle_articles").where(`user_id == $cloudEnv_uid`).count();
				// console.log(artCount);
				this.totalObj.artNum = artCount.result.total;

				// 统计当前用户获赞
				let likeCount = await db.collection("circle_articles").where(`user_id == $cloudEnv_uid`)
					.groupBy('user_id').groupField('sum(like_count) as totalScore').get();
				this.totalObj.likeNum = likeCount.result.data[0]?.totalScore ?? 0
				console.log(likeCount);
				console.log(this.totalObj);
			},

			// 跳转至我的长文
			myArticle() {
				if (this.goLoginPage()) return;
				uni.navigateTo({
					url: "/pages/circle_articles/list"
				})
			},

			// 跳转至我的点赞列表
			myLike() {
				if (this.goLoginPage()) return;
				uni.navigateTo({
					url: "/pages/circle_like/list"
				})
			},

			// 意见反馈
			goFeedback() {
				if (this.goLoginPage()) return;
				uni.navigateTo({
					url: "/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback"
				})
			},

			// 退出登录操作
			logout() {
				// 使用goLoginPage方法检查用户是否已登录
				if (this.goLoginPage()) return; // 如果用户未登录，则返回并不执行退出操作
				// 显示确认退出的对话框
				uni.showModal({
					title: "确认退出？", // 对话框标题
					success: (res) => { // 对话框操作成功的回调函数
						console.log(res); // 在控制台输出操作结果
						if (res.confirm) mutations.logout(); // 如果用户确认退出，则执行退出操作
					}
				});
			},
			// 检查用户是否已登录
			goLoginPage() {
				// 检查hasLogin状态，如果为false表示用户未登录
				if (!this.hasLogin) {
					// 显示未登录的提示信息
					uni.showToast({
						title: '未登录', // 提示内容
						icon: 'none' // 图标样式
					});
					return true; // 返回true表示用户未登录
				}
				return false; // 返回false表示用户已登录
			},

		}
	}
</script>

<style lang="scss">
	.user {


		.top {
			height: 300rpx;
			background: #bbb;
			padding: 0 30rpx;
			padding-top: var(--status-bar-height);
			position: relative;
			display: flex;
			align-items: center;

			.group {
				position: relative;
				z-index: 10;
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				color: #fff;

				.userinfo {
					display: flex;
					width: 100%;
					align-items: center;

					.pic {
						width: 120rpx;
						height: 120rpx;
						border-radius: 50%;
						overflow: hidden;
						border: 2px solid #fff;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.text {
						padding-left: 20rpx;

						.nickname {
							font-size: 44rpx;
							font-weight: 600;
						}

						.year {
							font-size: 26rpx;
							opacity: 0.6;
							padding-top: 5rpx;
						}
					}
				}

				.more {
					.iconfont {
						font-size: 40rpx;
					}
				}

			}

			.bg {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
					filter: blur(20px);
					transform: scale(2);
					opacity: 0.5;
				}
			}
		}

		.main {
			width: 100%;
			min-height: 200rpx;
			background: #fff;
			border-radius: 30rpx;
			transform: translateY(-30rpx);
			padding: 30rpx 0;

			.info {
				padding: 10rpx 30rpx;
				display: flex;
				font-size: 30rpx;

				.item {
					padding-right: 20rpx;
					color: #888;

					text {
						font-weight: 600;
						color: #333;
					}
				}
			}

			.list {
				.group {
					padding: 15rpx 30rpx;
					border-bottom: 15rpx solid #f4f4f4;

					.item {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 25rpx 0;
						font-size: 36rpx;
						color: #555;
						border-bottom: 1rpx solid #f8f8f8;

						.left {
							display: flex;
							align-items: center;

							.iconfont {
								font-size: 38rpx;
								margin-right: 10rpx;
							}
						}

						.right {
							.iconfont {
								font-size: 26rpx;
							}
						}
					}

					.item:last-child {
						border: none;
					}
				}

				.group:last-child {
					border: none;
				}
			}
		}

	}
</style>