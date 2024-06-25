<template>
	<view class="reply">
		<view class="top">
			<circleComment-item :closeBtn="true" :childState="true" :item="replyItem"
				:like_count.sync="replyItem.like_count"></circleComment-item>
		</view>

		<view class="list">
			<view class="row" v-for="item in childReplyArr" :key="item._id">
				<circleComment-item :closeBtnLike="true" :closeBtn="true" :childState="true" :item="item"
					@removeEnv="P_removeEnv"></circleComment-item>
			</view>
		</view>

		<uni-load-more :status="loadMoreStatus"></uni-load-more>

		<view>
			<circleComment-frame @refreshComments="refreshPage" :commentObj="commentObj"
				:placeholder="`回复：${giveName(this.replyItem)}`"></circleComment-frame>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();

	import {
		giveName,
		giveAvatar
	} from "../../../utils/tools.js";
	import {
		store
	} from "../../../uni_modules/uni-id-pages/common/store.js";

	export default {
		data() {
			return {
				replyItem: null,
				commentObj: {
					article_id: "",
					comment_type: 1,
					reply_user_id: "",
					reply_comment_id: ""
				},
				childReplyArr: [],
				page: 1,
				pageSize: 10,
				loadMoreStatus: 'more',
			};
		},
		onLoad(e) {
			let replyItem = uni.getStorageSync("replyItem");
			if (!replyItem) return uni.navigateBack();
			this.replyItem = replyItem || {};
			// 根据 replyItem 的数据,填充 commentObj 的相关字段。
			this.commentObj.article_id = this.replyItem.article_id;
			this.commentObj.reply_user_id = this.replyItem.user_id[0]._id;
			this.commentObj.reply_comment_id = this.replyItem._id;

			this.getComment();
		},
		onReachBottom() {
			if (this.loadMoreStatus === 'more') {
				this.getComment();
			}
		},
		onUnload() {
			// 退出页面销毁缓存数据
			uni.removeStorageSync("replyItem");
		},

		methods: {
			giveAvatar,
			giveName,


			// 用户评论完成后刷新页面
			refreshPage() {
				this.page = 1;
				this.childReplyArr = [];
				this.loadMoreStatus = 'more';
				this.getComment();
			},
			// 获取评论
			async getComment() {
				// 如果当前状态不是'more'，说明已经没有更多数据或正在加载中，直接返回
				if (this.loadMoreStatus !== 'more') return;

				// 将加载状态设置为'loading'
				this.loadMoreStatus = 'loading';

				try {
					// 创建一个临时的查询对象，用于获取评论数据
					let commentTemp = db.collection("circle_comments")
						.where(
							`article_id == '${this.replyItem.article_id}' && comment_type==1 && reply_comment_id == '${this.replyItem._id}'`
						)
						.orderBy("comment_date", "desc")
						.skip((this.page - 1) * this.pageSize) // 跳过之前已加载的数据
						.limit(this.pageSize) // 限制每次加载的数据量
						.getTemp();

					// 创建一个临时的查询对象，用于获取用户数据
					let userTemp = db.collection("uni-id-users")
						.field("_id,username,nickname,avatar_file")
						.getTemp();

					// 联合查询评论和用户数据
					const res = await db.collection(commentTemp, userTemp).get();

					// 如果是第一页，直接赋值；否则，将新数据追加到现有数据后面
					if (this.page === 1) {
						this.childReplyArr = res.result.data;
					} else {
						this.childReplyArr = [...this.childReplyArr, ...res.result.data];
					}

					// 判断是否还有更多数据
					if (res.result.data.length < this.pageSize) {
						// 如果返回的数据量小于pageSize，说明没有更多数据了
						this.loadMoreStatus = 'noMore';
					} else {
						// 否则，还有更多数据，将状态设置为'more'，并增加页码
						this.loadMoreStatus = 'more';
						this.page++;
					}

				} catch (error) {
					// 如果发生错误，打印错误信息并显示提示
					console.error('获取评论失败', error);
					uni.showToast({
						title: '获取评论失败，请稍后重试',
						icon: 'none'
					});
					// 将加载状态重置为'more'，允许用户重试
					this.loadMoreStatus = 'more';
				}
			},

			// 删除回复的回调
			P_removeEnv(e) {
				console.log(e);
				let index = this.childReplyArr.findIndex(item => {
					return item._id == e.id;
				})
				this.childReplyArr.splice(index, 1)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.reply {
		.top {
			padding: 30rpx;
			border-bottom: 15rpx solid #eee;
		}

		.list {
			padding: 30rpx;
			padding-bottom: 120rpx;

			.row {
				padding-bottom: 15rpx;
			}
		}
	}
</style>