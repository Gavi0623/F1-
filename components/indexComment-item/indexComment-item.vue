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
						{{item.like_count}}
						<text class="iconfont icon-dianzan" v-if="!closeBtn" @tap="commentLike"></text>
						<text class="iconfont icon-shanchu" v-if="!closeBtn" @tap="delComment"></text>
					</view>
				</view>
				<view class="comment-content">{{item.comment_content}}</view>
				<view class="info">
					<view class="reply-btn" v-if="!childState" @tap="goReply">{{item.totalReply}}回复</view>
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

	import {
		store
	} from "../../uni_modules/uni-id-pages/common/store.js";
	import {
		giveName,
		giveAvatar
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
			}
		},
		data() {
			return {};
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
				// 获取当前登录用户的id
				let uid = uniCloud.getCurrentUserInfo().uid;
				if (uid == this.item.user_id[0]._id || this.uniIDHasRole('admin') ||
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
				db.collection("news_comments").doc(this.item._id).remove()
					.then(res => {
						console.log(res);
						uni.showToast({
							title: "删除成功"
						})
						this.$emit("removeEnv", {
							id: this.item._id
						})
						if (this.item.comment_count > 0) {
							// 删除评论后，文章表的评论字段-1
							utilsObj.operation("news_articles", "comment_count", this.item.article_id, -1);
						}
					})
			},

			// 点赞评论
			commentLike() {
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