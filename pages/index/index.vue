<template>
	<view class="index">
		<nav-bar></nav-bar>

		<view class="content">
			<view class="swiper">
				<!-- Skeleton骨架屏 -->
				<view class="loadingState" v-show="swiperState">
					<u-skeleton rows="4" title loading></u-skeleton>
				</view>
				<!-- $event 就是当前被点击的轮播图的索引。 -->
				<u-swiper :list="swiperList" keyName="image" showTitle autoplay circular @click="SgoDetail($event)"
					v-if="swiperList.length > 0" height="260rpx"></u-swiper>
			</view>

			<!-- Skeleton骨架屏 -->
			<view class="loadingState" v-show="loadState">
				<u-skeleton rows="6" title loading></u-skeleton>
			</view>

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
					<image v-if="item.picurls && item.picurls.length" :src="item.picurls[0]" mode="aspectFit"></image>
					<image v-else src="../../static/images/no-image.jpg" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 触底加载更多 -->
			<view class="wrap">
				<u-loadmore :status="status" />
			</view>

		</view>

		<view v-if="uniIDHasRole('Home Manager') || uniIDHasRole('admin')" class="edit" @tap="goEdit">
			<text class="iconfont icon-bianji"></text>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();

	export default {
		data() {
			return {
				swiperState: true,
				loadState: true,
				status: 'loadmore',
				page: 1, // 当前页码
				pageSize: 15, // 每页显示的数据条数
				title: 'Hello',
				dataList: [],
				swiperList: [],
				fromDetailPage: false, // 新增
			}
		},
		onLoad() {
			if (!this.fromDetailPage) {
				this.getData();
				this.getSwiperList();
			}
		},
		onShow() {
			if (this.fromDetailPage) {
				this.refreshData();
				this.fromDetailPage = false; // 重置标志
			}
		},

		onReachBottom() {
			// 当用户滚动到底部时
			// 如果当前状态是 'loadmore'，则加载更多数据
			if (this.status === 'loadmore') {
				this.page++;
				this.getData();
			}
		},
		async onPullDownRefresh() {
			this.page = 1;
			this.dataList = [];
			await this.getData();
			uni.stopPullDownRefresh();
		},
		methods: {
			refreshData() {
				this.page = 1;
				this.dataList = [];
				this.swiperList = [];
				this.getData();
				this.getSwiperList();
			},

			// 点击跳转到详情页
			goDetail(id) {
				this.fromDetailPage = true; // 设置标志
				uni.navigateTo({
					url: "/pages/index/detail/detail?id=" + id
				});
			},
			// 点击轮播图跳转详情页
			SgoDetail(index) {
				this.fromDetailPage = true; // 设置标志
				let id = this.swiperList[index].id;
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

			// 获取轮播内容，筛选近7日观看量最高的5条文章
			getSwiperList() {
				let now = new Date().getTime();
				let sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

				db.collection("news_articles")
					.where({
						publish_date: db.command.gte(sevenDaysAgo),
						comment_count: db.command.gte(0)
					})
					.field("picurls,title")
					.orderBy("comment_count", "desc")
					.limit(5)
					.get()
					.then(res => {
						console.log(res);
						this.swiperList = res.result.data.map(item => ({
							image: item.picurls.length > 0 ? item.picurls[0] :
								'/static/images/no-image.jpg',
							title: item.title,
							id: item._id
						}));
						this.swiperState = false; // 隐藏骨架屏
					})
					.catch(err => {
						this.swiperState = false; // 隐藏骨架屏
						console.error(err);
					});
			},

			getData() {
				let artTemp = db.collection("news_articles").field(
					"title,user_id,description,picurls,comment_count,like_count,view_count,publish_date"
				).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();

				// 根据当前页码和每页数据条数，计算需要跳过的数据条数
				db.collection(artTemp, userTemp)
					.orderBy("publish_date", "desc")
					.skip((this.page - 1) * this.pageSize)
					.limit(this.pageSize)
					.get()
					.then(res => {
						console.log(res);
						// 如果本次返回的数据条数小于每页数据条数,说明已经没有更多数据了
						if (res.result.data.length < this.pageSize) {
							this.status = 'nomore';
						} else {
							// 否则,说明还有更多数据,将状态设置为 'loadmore'
							this.status = 'loadmore';
						}
						// 将本次返回的数据追加到 dataList 中
						this.dataList = this.dataList.concat(res.result.data);
						// 隐藏骨架屏
						this.loadState = false;
					})
					.catch(err => {
						// 隐藏骨架屏
						this.loadState = false;
						console.error(err);
					});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.index {


		.content {
			padding: 30rpx;

			.loadingState {
				padding: 30rpx;
			}

			.swiper {
				padding-bottom: 20rpx;

				.loadingState {
					padding: 30rpx;
				}
			}

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
						font-size: 38rpx;
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

			.wrap {
				padding: 24rpx;
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