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
		getImgSrc,
		getProvince
	} from '../../utils/tools.js';

	const db = uniCloud.database();

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

				db.collection("news_comments").add({
					"comment_content": this.replyContent,
					"province": province,
					...this.commentObj
				}).then(res => {
					console.log(res);
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