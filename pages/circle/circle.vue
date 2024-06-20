<template>
	<view class="circle">
		<!-- 导航栏 -->
		<view class="topnav">
			<u-tabs :list="navlist" :activeStyle="{
		    color: '#333',
		    fontWeight: 'bold',
		    transform: 'scale(1.08)'
		}" :inactiveStyle="{
		            color: '#888',
		            transform: 'scale(1)'
		        }" lineColor="#fa3534" @click="clickNav"></u-tabs>
		</view>

		<!-- Skeleton骨架屏 -->
		<view class="loadingState" v-show="loadState">
			<u-skeleton rows="4" title loading></u-skeleton>
		</view>

		<view class="content">
			<view class="item" v-for="(item,index) in dataList" :key="index">
				<!-- 引入组件 -->
				<blog-item @delEvent="P_delevent" :item="item" :like_count.sync="item.like_count"></blog-item>
			</view>
		</view>

		<!-- 触底加载更多 -->
		<view class="wrap">
			<u-loadmore :status="status" />
		</view>

		<!-- 修改按钮 -->
		<view class="edit" @tap="goEdit">
			<text class="iconfont icon-bianji"></text>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const dbCmd = db.command;

	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'

	export default {
		data() {
			return {
				status: 'loadmore',
				page: 1, // 当前页码
				pageSize: 6, // 每页显示的数据条数
				noMore: false,
				navlist: [{
					name: "红牛",
					type: "RedBull",
				}, {
					name: "法拉利",
					type: "Ferrari",
				}, {
					name: "梅赛德斯",
					type: "Mercedes",
				}, {
					name: "迈凯伦",
					type: "McLaren",
				}, {
					name: "阿斯顿马丁",
					type: "AstonMartin",
				}, {
					name: "小红牛",
					type: "RB",
				}, {
					name: "哈斯",
					type: "Haas",
				}, {
					name: "威廉姆斯",
					type: "Williams",
				}, {
					name: "Alpine",
					type: "Alpine",
				}, {
					name: "索伯",
					type: "KickSauber",
				}, ],
				dataList: [],
				navActive: 0,
				loadState: true,
				clickable: true, // 标记是否可点击
				lastClickTime: 0 // 上一次点击的时间
			};
		},
		onReachBottom() {
			// 当用户滚动到底部时
			// 如果当前状态是 'loadmore'，则加载更多数据
			if (this.status === 'loadmore') {
				this.page++;
				this.getData();
			}
		},

		onLoad() {
			this.getData();
		},

		methods: {
			P_delevent() {
				this.dataList = [];
				this.getData();
			},

			clickNav(e) {
				// 检查导航栏是否可点击
				if (!this.clickable) {
					// 如果用户在3秒内再次点击,弹出提示框
					if (Date.now() - this.lastClickTime < 3000) {
						uni.showToast({
							title: '请稍后再试',
							icon: 'none'
						});
						return;
					}
				}

				this.loadState = true;
				this.dataList = [];
				this.navActive = e.index;
				this.getData();

				this.clickable = false; // 设置标记为不可点击
				this.lastClickTime = Date.now(); // 更新上一次点击的时间

				setTimeout(() => {
					this.clickable = true; // 3秒后重新设置为可点击
				}, 3000);
			},

			// 跳转至圈子编辑页面
			goEdit() {
				uni.navigateTo({
					url: `/pages/circle/edit/edit?navType=${this.navlist[this.navActive].type}`
				})
			},

			async getData() {
				let artTemp = db.collection("circle_articles").field(
						"title,user_id,description,picurls,comment_count,like_count,view_count,publish_date,tab")
					.getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();
				let query = db.collection(artTemp, userTemp);
				// 根据当前选择的导航栏选项来设置查询条件
				query = query.where({
					tab: this.navlist[this.navActive].type
				});

				await query.orderBy('publish_date', 'desc').skip((this.page - 1) * this.pageSize)
					.limit(this.pageSize).get().then(async res => {
						console.log(res);

						// 如果本次返回的数据条数小于每页数据条数,说明已经没有更多数据了
						if (res.result.data.length < this.pageSize) {
							this.status = 'nomore';
						} else {
							// 否则,说明还有更多数据,将状态设置为 'loadmore'
							this.status = 'loadmore';
						}

						// 将本次返回的数据追加到 dataList 中
						this.dataList = await this.dataList.concat(res.result.data);
						// 隐藏骨架屏
						this.loadState = false;
					});

			},
		}
	}
</script>

<style lang="scss" scoped>
	.circle {
		.topnav {
			margin-bottom: 30rpx;
		}

		.loadingState {
			padding: 30rpx;
		}

		.content {
			.item {
				padding: 30rpx;
				border-bottom: 15rpx #f7f7f7 solid;
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