<template>
	<view>
		<view class="comment-item">
			<view class="avatar">
				<u-avatar :src="giveAvatar(item, '../../../static/images/user-default.jpg')" size="26"></u-avatar>
			</view>

			<view class="wrap">
				<view class="username">
					{{giveName(item)}}
					<view class="operate">
						<text :class="isLike ? 'active' : ' '">{{item.like_count ? item.like_count : ""}}</text>
						<text class="iconfont icon-dianzan" :class="isLike ? 'active' : ''" v-if="!closeBtnLike"
							@tap="commentLike"></text>
						<text class="iconfont icon-shanchu"
							v-if="uniIDHasRole('Circle Manager') || uniIDHasRole('admin') || isCurrentUser"
							@tap="delComment"></text>
					</view>
				</view>
				<view class="comment-content">{{item.comment_content}}</view>
				<view class="info">
					<view class="reply-btn" v-if="!childState" @tap="goReply">{{item.totalReply || 0}}回复</view>
					<view>
						<uni-dateformat :date="item.comment_date" :threshold="[60000,3600000*24*30]">
						</uni-dateformat>
					</view>
					<view>{{item.province}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const dbCmd = db.command;
	const utilsObj = uniCloud.importObject("utilsObj", {
		customUI: true // 取消自动展示的交互界面
	});

	import {
		store
	} from "../../uni_modules/uni-id-pages/common/store.js";
	import {
		giveName,
		giveAvatar,
		likeindexCmtFun,
		goLogin
	} from "../../utils/tools.js"
	import pageJson from "@/pages.json"

	export default {
		name: "indexComment-item",
		props: {
			item: {
				type: Object,
				default () {
					return {}
				}
			},
			childState: {
				type: Boolean,
				default: false
			},
			closeBtn: {
				type: Boolean,
				default: false
			},
			closeBtnLike: {
				type: Boolean,
				default: false
			},
			like_count: Number
		},
		data() {
			return {
				isLike: false
			};
		},

		computed: {
			// 获取当前登录用户的id
			isCurrentUser() {
				if (!store.hasLogin) return;

				const currentUserId = uniCloud.getCurrentUserInfo().uid;
				return currentUserId === this.item.user_id[0]._id;
			}
		},

		created() {
			this.checkLikeStatus();
		},

		methods: {
			giveName,
			giveAvatar,

			// 回复评论
			goReply() {
				// 将数据放入缓存
				uni.setStorageSync("replyItem", this.item);
				uni.navigateTo({
					url: "/pages/index/reply/reply"
				})
			},

			// 删除评论
			delComment() {
				if (!store.hasLogin) return;

				if (this.isCurrentUser || this.uniIDHasRole('admin') ||
					this.uniIDHasRole('Home Manager')) { // 如果当前登录用户的id等于发布者的id或当前账号为管理员
					uni.showModal({
						title: "是否删除",
						success: res => {
							console.log(res);
							if (res.confirm) {
								this.removeComment();
							}
						}
					})
					return;
				}

				uni.showToast({
					title: "权限不通过",
					icon: "error"
				})
			},
			removeComment() {
				if (this.item.comment_type === 0) {
					// 如果是针对文章的评论，需要删除该评论及其所有回复
					db.collection("news_comments").where({
						$or: [{
								_id: this.item._id
							},
							{
								reply_comment_id: this.item._id
							}
						]
					}).remove().then(res => {
						console.log(res);
						const deletedCount = res.result.deleted || 1;
						console.log(deletedCount);
						uni.showToast({
							title: "删除成功"
						});
						this.$emit("removeEnv", {
							id: this.item._id
						});

						// 更新文章的评论数
						utilsObj.operation("news_articles", "comment_count", this.item.article_id, -
							deletedCount);
					}).catch(err => {
						console.error("删除评论失败", err);
						uni.showToast({
							title: "删除失败",
							icon: "none"
						});
					});
				} else {
					// 如果是回复评论，只删除该条评论
					db.collection("news_comments").doc(this.item._id).remove()
						.then(res => {
							console.log(res);
							uni.showToast({
								title: "删除成功"
							});
							this.$emit("removeEnv", {
								id: this.item._id
							});

							// 更新文章的评论数
							utilsObj.operation("news_articles", "comment_count", this.item.article_id, -1);
						}).catch(err => {
							console.error("删除评论失败", err);
							uni.showToast({
								title: "删除失败",
								icon: "none"
							});
						});
				}
			},

			// 查询当前用户是否点赞过某篇文章的方法
			async checkLikeStatus() {
				if (!store.hasLogin) return;

				let count = await db.collection("news_comments_like").where(
					`article_id == '${this.item._id}' && user_id == $cloudEnv_uid `).count();

				console.log(count);

				if (count.result.total) this.isLike = true; // 如果点过赞，返回true
			},
			// 点赞评论
			async commentLike() {
				if (!store.hasLogin) {
					goLogin();
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

				// 如果已经点赞，直接返回
				if (this.isLike) {
					uni.showToast({
						title: "你已经赞过",
						icon: "none"
					});
					return;
				}

				// 立即更新前端状态，实现无感点赞
				this.isLike = true;
				let like_count = (this.item.like_count || 0) + 1;
				this.$emit("update:like_count", like_count);

				// 异步处理后端逻辑
				try {
					await likeindexCmtFun(this.item._id); // 调用 likeCirFun 函数并获取返回值
				} catch (error) {
					console.error("点赞操作失败", error);
					// 发生错误时回滚前端状态
					this.isLike = false;
					this.$emit("update:like_count", like_count - 1);
					uni.showToast({
						title: "操作失败，请稍后重试",
						icon: "none"
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.comment-item {
		display: flex;

		.wrap {
			flex: 1;
			padding-left: 20rpx;
			padding-bottom: 20rpx;

			.username {
				font-size: 26rpx;
				color: #666;
				padding: 10rpx 0;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.operate {

					.iconfont {
						font-size: 30rpx;
						padding: 10rpx;
						color: #999;
					}

					.active {
						color: #fa3534;
					}

				}
			}

			.comment-content {
				font-size: 34rpx;
				color: #111;
				line-height: 1.8em;
			}

			.info {
				font-size: 26rpx;
				color: #666;
				display: flex;
				padding: 10rpx 0;
				align-items: center;

				view {
					margin-right: 25rpx;
				}

				.reply-btn {
					padding: 6rpx 18rpx;
					background: #e4e4e4;
					border-radius: 30rpx;
				}
			}
		}
	}
</style>