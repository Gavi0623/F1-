<!-- indexComment-frame -->
<template>
	<view>
		<view class="commentFrame">
			<uni-easyinput ref="uipt" @confirm="goComment" @focus="onfocus" suffixIcon="paperplane"
				v-model="replyContent" :placeholder="placeholder" @iconClick="goComment">
			</uni-easyinput>
		</view>
	</view>
</template>

<script>
	import {
		store
	} from '../../uni_modules/uni-id-pages/common/store.js';
	import {
		getProvince,
		goLogin
	} from '../../utils/tools.js';

	const db = uniCloud.database();
	const utilsObj = uniCloud.importObject("utilsObj", {
		customUI: true // 取消自动展示的交互界面
	});

	export default {
		name: "indexComment-frame",
		props: {
			commentObj: {
				type: Object,
				default: () => {
					return {}
				}
			},
			placeholder: {
				type: String,
				default: "评论点什么吧~"
			}
		},
		data() {
			return {
				replyContent: "",
				isLike: false
			};
		},
		methods: {
			onfocus() {
				if (!store.hasLogin) {
					goLogin();
					return;
				}
			},
			async goComment() {
				if (!store.hasLogin) return;

				let province = await getProvince(); // 获取用户当前位置
				// 如果评论内容为空
				if (!this.replyContent.trim()) {
					uni.showToast({
						title: "内容不能为空",
						icon: "none"
					})
					return;
				}

				try {
					const res = await db.collection("news_comments").add({
						"comment_content": this.replyContent,
						"province": province,
						...this.commentObj
					});

					console.log(res);
					// 评论成功后，文章表的评论字段+1
					await utilsObj.operation("news_articles", "comment_count", this.commentObj.article_id, 1);

					// 触发刷新事件
					this.$emit("refreshComments");

					this.replyContent = "";

					uni.showToast({
						title: "评论成功",
						icon: "success"
					});
				} catch (err) {
					console.error(err);
					uni.showToast({
						title: "评论失败，请稍后重试",
						icon: "none"
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.commentFrame {
		width: 100%;
		background: #fff;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 100;
	}
</style>