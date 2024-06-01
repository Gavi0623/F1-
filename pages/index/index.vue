<template>
	<view class="index">
		<view class="content">
			<view class="item" @tap="goDetail(item._id)" v-for="(item,index) in dataList" :key="item._id">
				<!-- 左半部分的标题 -->
				<view class="text">
					<view class="title">{{item.title}}</view>
					<view class="info">
						<text class="iconfont icon-yanjing"></text><text>{{item.view_count}}</text>
						<uni-dateformat :date="item.publish_date" :threshold="[60000, 3600000*24*7]"
							format="MM-dd"></uni-dateformat>
					</view>
				</view>

				<!-- 右半部分的图片 -->
				<view class="pic">
					<!-- 当图片上传成功后要动态请求数据库中的图片路径 -->
					<image v-if="item.picurls && item.picurls.length" :src="item.picurls[0]" mode="scaleToFill"></image>
					<image v-else src="../../static/images/5b08bfb0bd54d276.jpg" mode="scaleToFill"></image>
				</view>
			</view>

		</view>

		<view class="edit" @tap="goEdit">
			<text class="iconfont icon-bianji"></text>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();

	export default {
		data() {
			return {
				title: 'Hello',
				dataList: []
			}
		},
		onLoad() {
			this.getData();
		},
		methods: {
			// 点击跳转到详情页
			goDetail(id) {
				uni.navigateTo({
					url: "/pages/index/detail/detail?id=" + id
				});

			},

			// 跳转至首页编辑页面
			goEdit() {
				uni.navigateTo({
					url: "/pages/index/edit/edit"
				})
			},

			getData() {
				let artTemp = db.collection("news_articles").field(
					"title,user_id,description,picurls,comment_count,like_count,view_count,publish_date").getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();

				db.collection(artTemp, userTemp).orderBy("publish_date desc").get().then(res => {
					console.log(res);
					this.dataList = res.result.data;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index {
		.content {
			padding: 30rpx;

			.item {
				display: flex;
				justify-content: space-between;
				padding: 20rpx 0;
				border-bottom: 1rpx solid #ccc;

				.text {
					flex: 1; // 图片占据父级容器后所剩余的空间全部给标题容器
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					padding-right: 20rpx;

					.title {
						font-size: 44rpx;
						color: #333;
						text-align: justify;
						display: -webkit-box;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-line-clamp: 2; // 显示2行
						line-clamp: 2;
						-webkit-box-orient: vertical;
					}

					.info {
						font-size: 30rpx;
						color: #888;

						text {
							padding-right: 20rpx;
						}
					}
				}

				.pic {
					width: 260rpx;
					height: 180rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.edit {
			width: 120rpx;
			height: 120rpx;
			background-color: #fa3534;
			border-radius: 50%;
			color: #FFF;
			position: fixed;
			z-index: 100;
			bottom: 150rpx;
			right: 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			box-shadow: 0 0 20rpx rgba(239, 53, 6, 0.8);

			.iconfont {
				font-size: 50rpx;
			}
		}
	}
</style>