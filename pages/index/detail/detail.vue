<!-- detai.vue -->
<template>
	<view class="detail">
		<!-- 自定义导航栏 -->
		<view class="navBarBox">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{ paddingTop: statusBarHeight + 'px' }"></view>
			<!-- 真正的导航栏内容 -->
			<view class="navBar">
				<image class="logo" src="/static/f1_logo.svg" mode="scaleToFill"></image>
				<view>F1 App</view>
			</view>
		</view>

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
						<template v-for="(item,index) in likeUserArr">
							<image :key="index" v-if="item.user_id[0].avatar_file"
								:src="giveAvatar(item, '../../../static/images/user-default.jpg')" mode="aspectFill">
							</image>
						</template>
					</view>
					<view class="text"><text class="num">{{detailObj.view_count}}</text>人看过</view>
				</view>

			</view>

			<view class="comment" v-if="!loadState">
				<!-- 没有评论时显示暂无评论 -->
				<view style="padding-bottom: 50rpx;" v-if="!commentList.length && noComment">
					<u-empty mode="comment" icon="http://cdn.uviewui.com/uview/empty/comment.png"></u-empty>
				</view>

				<view class="comment-header" v-if="commentList.length">
					<view class="comment-num">
						<text>评论：</text> {{totalCommentCount}}
					</view>
					<view class="subsection">
						<u-subsection :list="list" :current="current" @change="subsectionChange" activeColor="#f00"
							bgColor="#fff"></u-subsection>
					</view>
				</view>

				<!-- 评论内容 -->
				<view class="content" v-if="commentList.length">
					<view class="item" v-for="(item,index) in commentList" :key="index">
						<indexComment-item :item="item" :like_count.sync="item.like_count"
							@removeEnv="P_removeEnv"></indexComment-item>
					</view>
				</view>

				<uni-load-more :status="loadMoreStatus"></uni-load-more>
			</view>

			<!-- 评论框 -->
			<indexComment-frame :commentObj="commentObj" @refreshComments="refreshPage"></indexComment-frame>

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
		likeFun,
		goLogin
	} from "../../../utils/tools.js"
	import {
		store
	} from '@/uni_modules/uni-id-pages/common/store.js'
	import pageJson from "@/pages.json"

	export default {
		data() {
			return {
				// 状态栏高度
				statusBarHeight: 0,
				// 导航栏高度
				navBarHeight: 82 + 11,
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
				noComment: false,
				list: ['最新', '最热'],
				current: 0,
				page: 1,
				pageSize: 10,
				loadMoreStatus: 'more',
				totalCommentCount: 0,
				likeUserArr: []
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
		onReachBottom() {
			if (this.loadMoreStatus === 'more') {
				this.getComment();
			}
		},

		created() {
			//获取手机状态栏高度
			this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];
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
				if (store.hasLogin) tempArr.push(likeTemp);

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

			subsectionChange(index) {
				this.current = index;
				this.getComment();
			},

			// 获取评论
			async getComment() {
				if (this.loadMoreStatus === 'noMore' || this.loadingComments) return;

				this.loadingComments = true;
				this.loadMoreStatus = 'loading';
				try {
					const commentTemp = db.collection("news_comments")
						.where({
							article_id: this.artid,
							comment_type: 0
						})
						.orderBy("comment_date", "desc")
						.skip((this.page - 1) * this.pageSize)
						.limit(this.pageSize)
						.getTemp();

					const userTemp = db.collection("uni-id-users")
						.field("_id,username,nickname,avatar_file")
						.getTemp();

					const res = await db.collection(commentTemp, userTemp).get();

					if (!res.result || !res.result.data) {
						throw new Error('无法获取评论');
					}

					const newComments = res.result.data;

					// 处理二级回复数量
					// 获取当前文章的一级评论id
					let idArr = res.result.data.map(item => {
						return item._id
					})
					// console.log(idArr);

					// 统计当前文章一级评论的二级回复数量
					let replyArr = await db.collection("news_comments").where({
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

					this.commentList = [...this.commentList, ...newComments];
					this.loadMoreStatus = newComments.length === this.pageSize ? 'more' : 'noMore';
					this.noComment = this.commentList.length === 0;
					this.page++;

					// 获取当前文章评论数量
					const countResult = await db.collection("news_comments")
						.where({
							article_id: this.artid,
							comment_type: 0
						})
						.count();
					// console.log(countResult);
					this.totalCommentCount = countResult.result.total;
				} catch (error) {
					console.error('获取评论失败', error);
					uni.showToast({
						title: '获取评论失败，请稍后重试',
						icon: 'none'
					});
					this.loadMoreStatus = 'more'; // 出错时重置状态，允许重试
				} finally {
					this.loadingComments = false;
				}
			},
			// 评论成功后的回调
			refreshPage() {
				this.page = 1;
				this.loadMoreStatus = 'more';
				this.commentList = [];
				this.getComment();
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

<style lang="scss" scoped>
	.detail {
		background: #f8f8f8;
		min-height: calc(100vh - var(--window-top));

		.navBarBox {
			.statusBar {}

			.navBar {
				padding: 3rpx 50rpx;
				padding-bottom: 8rpx;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;

				.logo {
					width: 82rpx;
					height: 82rpx;
					margin-right: 10rpx;
					filter: invert(1);
				}
			}
		}

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