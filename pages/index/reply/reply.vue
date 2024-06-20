<template>
	<view class="reply">
		<view class="top">
			<indexComment-item :closeBtn="true" :childState="true" :item="replyItem"></indexComment-item>
		</view>

		<view class="list">
			<view class="row" v-for="item in childReplyArr" :key="item._id">
				<indexComment-item :closeBtn="true" :childState="true" :item="item"></indexComment-item>
			</view>
		</view>

		<view>
			<indexComment-frame :commentObj="commentObj"
				:placeholder="`回复：${giveName(this.replyItem)}`"></indexComment-frame>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();

	import {
		giveName,
		giveAvatar
	} from "../../../utils/tools.js";

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
				childReplyArr: []
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
		onUnload() {
			// 退出页面销毁缓存数据
			uni.removeStorageSync("replyItem");
		},

		methods: {
			giveAvatar,
			giveName,

			// 用户评论完成后刷新页面
			P_commentEnv() {
				this.childReplyArr = [];
				this.getComment();
			},
			// 获取评论
			getComment() {
				let commentTemp = db.collection("news_comments")
					.where(
						`article_id == '${this.replyItem.article_id}' && comment_type==1 && reply_comment_id == '${this.replyItem._id}'`
					)
					.orderBy("comment_date desc").limit(10).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();

				db.collection(commentTemp, userTemp).get().then(res => {
					console.log(res);
					if (res.result.data == 0) this.noComment = true;
					this.childReplyArr = res.result.data;
				})
			},
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