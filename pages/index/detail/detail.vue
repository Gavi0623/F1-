<!-- detai.vue -->
<template>
	<view class="detail">
		<view class="container">

			<view v-if="loadState">
				<u-skeleton rows="5" title loading></u-skeleton>
			</view>
			<view v-else>
				<view class="title">{{detailObj.title}}</view>
				<view class="userinfo">
					<view class="avatar">
						<image
							:src="detailObj.user_id[0].avatar_file ? detailObj.user_id[0].avatar_file.url : '../../../static/images/user-default.jpg'"
							mode="aspectFill"></image>
					</view>
					<view class="text">
						<view class="name">
							{{detailObj.user_id[0].nickname ? detailObj.user_id[0].nickname : detailObj.user_id[0].username}}
						</view>
						<view class="small">
							<uni-dateformat :date="detailObj.publish_date"
								format="yyyy年MM月dd hh:mm:ss"></uni-dateformat>
						</view>
					</view>
				</view>
				<view class="content">
					<u-parse :content="detailObj.content" :tagStyle="tagStyle"></u-parse>
				</view>

				<view class="like">
					<view class="btn" :class="detailObj.isLike ? 'active' : ''" @tap="clickLike">
						<text class="iconfont icon-good-fill"></text>
						<text>{{detailObj.like_count}}</text>
					</view>
					<view class="users">
						<image src="../../../static/images/user-default.jpg" mode="aspectFill"></image>
					</view>
					<view class="text"><text class="num">{{detailObj.view_count}}</text>人看过</view>
				</view>

			</view>

			<view class="comment">
				<!-- 没有评论时显示暂无评论 -->
				<view style="padding-bottom: 50rpx;" v-if="!commentList.length && noComment">
					<u-empty mode="comment" icon="http://cdn.uviewui.com/uview/empty/comment.png"></u-empty>
				</view>

				<!-- 评论内容 -->
				<view class="content" v-if="commentList.length">
					<view class="item" v-for="(item,index) in commentList" :key="index">
						<indexComment-item :item="item"></indexComment-item>
					</view>
				</view>
			</view>

			<!-- 评论框 -->
			<indexComment-frame :commentObj="commentObj"></indexComment-frame>

		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const utilsObj = uniCloud.importObject("utilsObj", {
		customUI: true // 取消自动展示的交互界面
	});

	import {
		giveName,
		giveAvatar,
		likeFun
	} from "../../../utils/tools.js"
	import {
		store
	} from '@/uni_modules/uni-id-pages/common/store.js'
	import pageJson from "@/pages.json"

	export default {
		data() {
			return {
				artid: "",
				tagStyle: {
					p: "line-height: 1.7em;font-size: 32rpx;padding-bottom: 10rpx",
					img: "margin: 10rpx 0"
				},
				loadState: true,
				detailObj: null,
				commentObj: {
					article_id: "",
					comment_type: 0
				},
				commentList: [],
				noComment: false
			};
		},

		onLoad(e) {
			if (!e.id) {
				this.errFun();
				return;
			}
			this.artid = e.id;
			this.commentObj.article_id = e.id; // 将文章id传给评论模块
			this.getData();
			this.readUpdate();
			this.getLikeUser();
			this.getComment();
		},

		methods: {
			// 文章id为空处理
			errFun() {
				uni.showToast({
					title: "参数有误",
					icon: 'none'
				})
				setTimeout(() => {
					uni.reLaunch({
						url: "/pages/index/index"
					})
				}, 1000)
			},

			// 修改阅读量
			readUpdate() {
				utilsObj.operation("news_articles", "view_count", this.artid, 1).then(res => {
					console.log(res);
				})
			},

			// 获取点赞的用户
			getLikeUser() {
				let likeTemp = db.collection("news_like").where(`article_id == '${this.artid}'`).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,avatar_file").getTemp();
				db.collection(likeTemp, userTemp).orderBy("publish_date desc").get().then(res => {
					// console.log(res);
					res.result.data = res.result.data.reverse(); // 数据反转
					this.likeUserArr = res.result.data
				})
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

				this.detailObj.isLike ? this.detailObj.like_count-- : this.detailObj.like_count++
				this.detailObj.isLike = !this.detailObj.isLike;
				this.likeTime = time;

				// 调用点赞方法
				likeFun(this.artid);
			},



			getData() {
				let artTemp = db.collection("news_articles").where(`_id=='${this.artid}'`).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();
				let likeTemp = db.collection("news_like").where(`article_id=='${this.artid}' && user_id==$cloudEnv_uid `)
					.getTemp();

				let tempArr = [artTemp, userTemp]
				if (store.hasLogin) tempArr.push(likeTemp)

				db.collection(...tempArr).get({
					getOne: true
				}).then(res => {
					console.log(res);
					// 文章id错误处理
					if (!res.result.data) {
						this.errFun();
						return;
					}

					this.loadState = false;

					// 判断当前用户是否点过赞
					let isLike = false;
					if (store.hasLogin) isLike = res.result.data._id.news_like.length ? true : false;
					res.result.data.isLike = isLike;
					this.detailObj = res.result.data;
					uni.setNavigationBarTitle({
						title: this.detailObj.title
					})
				}).catch(err => {
					this.errFun();
				})
			},

			// 获取评论
			getComment() {
				let commentTemp = db.collection("news_comments").where(`article_id == '${this.artid}'`).
				orderBy("comment_date desc").limit(5).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();

				db.collection(commentTemp, userTemp).get().then(res => {
					console.log(res);
					this.commentList = res.result.data;

					if (res.result.data == 0) this.noComment = true;
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		background: #f8f8f8;
		min-height: calc(100vh - var(--window-top));

		.container {
			padding: 30rpx;
			background: #fff;

			.title {
				font-size: 46rpx;
				color: #333;
				line-height: 1.4em;
				font-weight: 600;
			}

			.userinfo {
				padding: 20rpx 0 50rpx;
				display: flex;
				align-items: center;

				.avatar {
					width: 60rpx;
					height: 60rpx;
					padding-right: 15rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}

				.text {
					font-size: 28rpx;
					color: #555;

					.small {
						font-size: 20rpx;
						color: #999;
					}
				}
			}

			.content {}

			.like {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 80rpx 50rpx 50rpx;

				.btn {
					width: 260rpx;
					height: 120rpx;
					background: #e4e4e4;
					border-radius: 100rpx;
					color: #fff;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					font-size: 28rpx;

					.iconfont {
						font-size: 50rpx;
					}

					&.active {
						background: #fa3534;
					}
				}

				.text {
					font-size: 26rpx;
					color: #666;

					.num {
						color: #fa3534
					}

					.spot {
						padding: 0 10rpx;
					}
				}

				.users {
					display: flex;
					justify-content: center;
					padding: 30rpx 0;

					image {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						border: 3px solid #fff;
						margin-left: -20rpx;
					}
				}
			}

			.comment {
				padding: 30rpx;
				padding-bottom: 120rpx;

				.item {
					padding: 10rpx 0;
				}
			}

		}
	}
</style>