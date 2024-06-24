<!-- detai.vue -->
<template>
	<view class="detail">
		<view class="container" v-if="detailObj">
			<view v-if="loadState">
				<u-skeleton rows="5" title loading></u-skeleton>
			</view>

			<view class="userinfo">
				<view class="avatar">
					<image :src="giveAvatar(detailObj,'../../../static/images/user-default.jpg')" mode="aspectFill">
					</image>
				</view>
				<view class="text">
					<view class="name">{{giveName(detailObj)}}</view>
					<view class="small">
						<uni-dateformat :date="detailObj.publish_date" format="yyyy年MM月dd hh:mm:ss"></uni-dateformat>
						<text class="province">发布于：{{detailObj.province}}</text>
					</view>
				</view>
			</view>

			<view class="title">{{detailObj.title}}</view>

			<view class="content">
				<!-- 弹出层 -->
				<u-popup :show="showPopup" @close="closePopup" @open="openPopup">
					<u-button @click="clickLike">点赞</u-button>
				</u-popup>

				<u--text @tap="showPopup = true" :text="detailObj.content"></u--text>

				<view v-if="detailObj.picurls && detailObj.picurls.length > 0" v-for="(pic, index) in detailObj.picurls"
					:key="index">
					<image @tap="clickPic(index)" :src="pic" mode="aspectFill"></image>
				</view>
			</view>

			<view class="like" @tap="showPopup = true">
				<text class="iconfont icon-dianzan" :class="detailObj.isLike ? 'active' : ''"></text>
				<text>{{likeUserArr}} {{detailObj.like_count}}人赞过</text>
			</view>

			<view class="comment" v-if="!loadState">
				<!-- 没有评论时显示暂无评论 -->
				<view style="padding-bottom: 50rpx;" v-if="!commentList.length && noComment">
					<u-empty mode="comment" icon="http://cdn.uviewui.com/uview/empty/comment.png"></u-empty>
				</view>

				<view class="comment-header" v-if="commentList.length">
					<view class="comment-num">
						<text>评论：</text> {{commentList.length}}
					</view>
				</view>

				<!-- 评论内容 -->
				<view class="content" v-if="commentList.length">
					<view class="item" v-for="(item,index) in commentList" :key="index">
						<circleComment-item :item="item" :like_count.sync="item.like_count"
							@removeEnv="P_removeEnv"></circleComment-item>
					</view>
				</view>
			</view>

			<!-- 评论框 -->
			<circleComment-frame :commentObj="commentObj" @commentEnv="P_commentEnv"></circleComment-frame>

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
		likeCirFun
	} from "../../../utils/tools.js"
	import {
		store
	} from '@/uni_modules/uni-id-pages/common/store.js'
	import pageJson from "@/pages.json"

	export default {
		data() {
			return {
				artid: "", // 存放当前文章的id
				showPopup: false,
				loadState: true,
				likeUserArr: [],
				detailObj: null,
				commentObj: {
					article_id: "",
					comment_type: 0
				},
				commentList: [],
				noComment: false,
			};
		},

		onLoad(e) {
			if (!e.id) {
				this.errFun();
				return;
			}
			this.artid = e.id;
			// console.log(e);
			this.commentObj.article_id = e.id; // 将文章id传给评论模块
			this.getData();
			this.readUpdate();
			this.getLikeUser();
			this.getComment();
		},

		methods: {
			giveName,
			giveAvatar,

			// 文章id为空处理
			errFun() {
				uni.showToast({
					title: "参数有误",
					icon: 'none'
				})
				setTimeout(() => {
					uni.reLaunch({
						url: "/pages/circle/circle"
					})
				}, 1000)
			},

			// 弹出层
			openPopup() {
				// console.log('open');
			},
			closePopup() {
				this.showPopup = false;
				// console.log('close');
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

				this.showPopup = false;

				// 调用点赞方法
				likeCirFun(this.artid);
			},

			// 单击图片预览
			clickPic(index) {
				uni.previewImage({
					urls: this.detailObj.picurls,
					current: index
				})
			},

			// 获取点赞的用户
			async getLikeUser() {
				let likeTemp = db.collection("circle_like").where(`article_id == '${this.artid}'`).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id, nickname, username").getTemp();

				await db.collection(likeTemp, userTemp).orderBy("publish_date desc").get().then(res => {
					console.log(res);
					res.result.data = res.result.data.reverse(); // 数据反转

					// 初始化点赞用户字符串
					this.likeUserArr = "";

					// 遍历点赞用户
					res.result.data.forEach((item, index) => {
						console.log(item);
						// 如果nickname存在且不为空，则使用nickname，否则使用username
						let displayName = item.user_id[0]?.nickname || item.user_id[0]?.username;
						console.log(displayName);
						// 将displayName附加到点赞用户字符串中，用逗号分隔
						this.likeUserArr += (index ? ', ' : '') + displayName;
					});

					// 输出点赞用户字符串
					console.log(this.likeUserArr);

				})
			},

			// 修改阅读量
			readUpdate() {
				utilsObj.operation("circle_articles", "view_count", this.artid, 1).then(res => {
					console.log(res);
				})
			},

			getData() {
				let artTemp = db.collection("circle_articles").where(`_id=='${this.artid}'`).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();
				let likeTemp = db.collection("circle_like").where(`article_id=='${this.artid}' && user_id==$cloudEnv_uid `)
					.getTemp();

				let tempArr = [artTemp, userTemp]
				if (store.hasLogin) tempArr.push(likeTemp); // 如果当前用户已登录
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
					if (store.hasLogin) isLike = res.result.data._id.circle_like.length ? true : false;
					res.result.data.isLike = isLike;
					this.detailObj = res.result.data;
					uni.setNavigationBarTitle({
						// 动态设置当前页面的标题。
						title: this.detailObj.title
					})
					console.log(this.detailObj);
				})
			},

			// 获取评论
			async getComment() {
				let commentTemp = db.collection("circle_comments").where(
						`article_id == '${this.artid}' && comment_type==0`).orderBy("comment_date desc").limit(5)
					.getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();

				let res = await db.collection(commentTemp, userTemp).get();
				// console.log(res);

				// 获取当前文章的一级评论id
				let idArr = res.result.data.map(item => {
					return item._id
				})
				// console.log(idArr);

				// 统计当前文章一级评论的二级回复数量
				let replyArr = await db.collection("circle_comments").where({
					reply_comment_id: db.command.in(idArr)
				}).groupBy('reply_comment_id').groupField('count(*) as totalReply').get()
				// console.log(replyArr);

				// 循环遍历评论列表，并将二级回复数量添加到每个评论对象中。
				res.result.data.forEach(item => {
					let index = replyArr.result.data.findIndex(find => {
						return find.reply_comment_id == item._id
					})
					// console.log(index); // -1表示没有二级回复
					if (index > -1) {
						item.totalReply = replyArr.result.data[index].totalReply
					}
				})

				if (res.result.data == 0) this.noComment = true;

				this.commentList = [];
				this.commentList = res.result.data;
			},
			// 评论成功后的回调
			P_commentEnv(e) {
				console.log(e);
				this.commentList.unshift({
					...this.commentObj,
					...e,
					user_id: [store.userInfo]

				})
			},

			// 删除评论的回调
			P_removeEnv(e) {
				console.log(e);
				let index = this.commentList.findIndex(item => {
					return item._id == e.id;
				})
				this.commentList.splice(index, 1)
			},
		}
	}
</script>

<style lang="scss">
	.detail {
		background: #f8f8f8;
		min-height: calc(100vh - var(--window-top));

		.container {
			padding: 30rpx;
			background: #fff;

			.userinfo {
				padding: 20rpx 0;
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

						.province {
							margin-left: 15rpx;
						}
					}
				}
			}

			.title {
				font-size: 46rpx;
				color: #333;
				line-height: 1.4em;
				font-weight: 600;
			}

			.content {
				padding-top: 20rpx;

				image {
					width: 100%;
				}
			}

			.like {
				display: flex;
				align-items: center;
				padding: 30rpx 0 10rpx;

				text {
					padding: 0 8rpx;
					word-wrap: break-word;
					word-break: break-all;
					overflow-wrap: break-word;
				}

				.active {
					color: #fa3534;
				}
			}

			.comment {
				padding-bottom: 120rpx;

				.comment-header {
					display: flex;
					line-height: 60rpx;
					border-bottom: 1px solid #ccc;
					margin-bottom: 10rpx;

					.comment-num {
						flex: 1;
					}

					.subsection {
						width: 40%;
					}
				}

				.item {
					padding: 10rpx 0;
				}
			}


		}
	}
</style>