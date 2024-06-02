<!-- detai.vue -->
<template>
	<view class="detail">
		<view class="container">
			<view v-if="loadState">
				<u-skeleton rows="5" title loading></u-skeleton>
			</view>

			<view class="userinfo">
				<view class="avatar">
					<image :src="giveAvatar(detailObj)" mode="aspectFill"></image>
				</view>
				<view class="text">
					<view class="name">{{giveName(detailObj)}}</view>
					<view class="small">
						<uni-dateformat :date="detailObj.publish_date" format="yyyy年MM月dd hh:mm:ss"></uni-dateformat>
						· 发布于{{detailObj.province}}
					</view>
				</view>
			</view>

			<view class="title">{{detailObj.title}}</view>

			<view class="content">
				<u-popup :show="showPopup" @close="closePopup" @open="openPopup">
					<u-button>点赞</u-button>
				</u-popup>

				<u--text @tap="showPopup = true" :text="detailObj.content"></u--text>

				<view v-if="detailObj.picurls && detailObj.picurls.length > 0" v-for="(pic, index) in detailObj.picurls"
					:key="index">
					<image @tap="clickPic(index)" :src="pic" mode="aspectFill"></image>
				</view>
			</view>

			<view class="like" @tap="showPopup = true">
				<text class="iconfont icon-dianzan"></text>
				<text>{{likeUserArr}} {{detailObj.like_count}}人赞过</text>
			</view>

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
				detailObj: null,
				showPopup: false,
				loadState: true,
				likeUserArr: []
			};
		},

		onLoad(e) {
			if (!e.id) {
				this.errFun();
				return;
			}
			this.artid = e.id;
			// console.log(e);
			this.getData();
			this.getLikeUser();
			this.readUpdate();
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

			// 单击图片预览
			clickPic(index) {
				uni.previewImage({
					urls: this.detailObj.picurls,
					current: index
				})
			},

			// 获取点赞的用户
			getLikeUser() {
				let likeTemp = db.collection("circle_like").where(`article_id == '${this.artid}'`).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,nickname,username").getTemp();

				db.collection(likeTemp, userTemp).orderBy("publish_date desc").get().then(res => {
					console.log(res);
					res.result.data = res.result.data.reverse(); // 数据反转
					if (res.result.data.nickname) {
						this.likeUserArr = res.result.data;
					} else {
						this.likeUserArr = res.result.data.nickname;
					}

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
			}
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
			}

		}
	}
</style>