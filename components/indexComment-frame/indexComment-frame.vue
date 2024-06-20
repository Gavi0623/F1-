<!-- comment-frame -->
<template>
	<view>
		<view class="commentFrame">
			<uni-easyinput ref="uipt" @confirm="goComment" suffixIcon="paperplane" v-model="replyContent"
				:placeholder="placeholder" @iconClick="goComment">
			</uni-easyinput>
		</view>
	</view>
</template>

<script>
	import {
		getProvince
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
			}
		},
		data() {
			return {
				replyContent: "",
				placeholder: "评论点什么吧~"
			};
		},
		methods: {
			async goComment() {
				let province = await getProvince(); // 获取用户当前位置
				// 如果评论内容为空
				if (!this.replyContent.trim()) {
					uni.showToast({
						title: "内容不能为空",
						icon: "none"
					})
					return;
				}

				db.collection("news_comments").add({
					"comment_content": this.replyContent,
					"province": province,
					...this.commentObj
				}).then(res => {
					// console.log(res);
					uni.showToast({
						title: "评论成功",
					})
					// 评论成功后，文章表的评论字段+1
					utilsObj.operation("news_articles", "comment_count", this.commentObj.article_id, 1);

					// 实现评论无感展示，当用户发布评论后直接显示在评论最上面
					this.$emit("commentEnv", {
						_id: res.result.id,
						comment_content: this.replyContent,
						"province": province,
						comment_date: Date.now()
					})

					this.replyContent = ""
				}).catch(err => {
					console.error(err);
				})
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