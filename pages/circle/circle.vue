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
	} from '@/uni_modules/uni-id-pages/common/store.js';
	import pageJson from "@/pages.json"

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
					disabled: false
				}, {
					name: "法拉利",
					type: "Ferrari",
					disabled: false
				}, {
					name: "梅赛德斯",
					type: "Mercedes",
					disabled: false
				}, {
					name: "迈凯伦",
					type: "McLaren",
					disabled: false
				}, {
					name: "阿斯顿马丁",
					type: "AstonMartin",
					disabled: false
				}, {
					name: "小红牛",
					type: "RB",
					disabled: false
				}, {
					name: "哈斯",
					type: "Haas",
					disabled: false
				}, {
					name: "威廉姆斯",
					type: "Williams",
					disabled: false
				}, {
					name: "Alpine",
					type: "Alpine",
					disabled: false
				}, {
					name: "索伯",
					type: "KickSauber",
					disabled: false
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

		// 下拉刷新
		async onPullDownRefresh() {
			this.page = 1;
			this.dataList = [];
			await this.getData();
			uni.stopPullDownRefresh();
		},

		onLoad() {
			this.getData();
		},

		methods: {
			P_delevent() {
				this.page = 1;
				this.dataList = [];
				this.getData();
			},

			async clickNav(e) {
				// 检查是否有任何导航项被禁用
				if (this.navlist.some(item => item.disabled)) {
					// 如果有被禁用的导航项,显示提示信息
					uni.showToast({
						title: '请稍后再试',
						icon: 'none'
					});
					return; // 直接返回,不执行后续操作
				}

				// 设置加载状态
				this.loadState = true;
				// 清空数据列表
				this.page = 1;
				this.dataList = [];
				// 更新当前激活的导航索引
				this.navActive = await e.index;
				// 获取新数据
				await this.getData();

				// 禁用所有导航项
				this.navlist.forEach(item => item.disabled = true);

				// 3秒后启用所有导航项
				setTimeout(() => {
					this.navlist.forEach(item => item.disabled = false);
				}, 3000);
			},

			// 跳转至圈子编辑页面
			goEdit() {
				if (!store.hasLogin) {
					uni.showModal({
						title: "是否登录",
						icon: "none",
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

				uni.navigateTo({
					url: `/pages/circle/edit/edit?navType=${this.navlist[this.navActive].type}`
				})
			},

			async getData() {
				// 返回一个新的 Promise 对象，这允许我们异步处理数据获取
				return new Promise((resolve, reject) => {
					// 创建一个临时的文章集合查询，设置查询条件和字段
					let artTemp = db.collection("circle_articles").where(`delState != true`).field(
						"title,user_id,description,picurls,comment_count,like_count,view_count,publish_date,tab"
					).getTemp();

					// 创建一个临时的用户集合查询，设置所需字段
					let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file")
						.getTemp();

					// 合并两个临时查询
					let query = db.collection(artTemp, userTemp);

					// 根据当前选中的导航类型设置查询条件
					query = query.where({
						tab: this.navlist[this.navActive].type
					});

					// 执行查询：按发布日期降序排序，跳过之前的页，限制返回数量
					query.orderBy('publish_date', 'desc').skip((this.page - 1) * this.pageSize)
						.limit(this.pageSize).get().then(async res => {
							// 判断是否还有更多数据
							if (res.result.data.length < this.pageSize) {
								this.status = 'nomore'; // 没有更多数据
							} else {
								this.status = 'loadmore'; // 还有更多数据
							}

							// 将新数据添加到现有数据列表中
							this.dataList = this.dataList.concat(res.result.data);

							// 设置加载状态为false，表示加载完成
							this.loadState = false;

							// 成功获取数据，调用resolve并传递结果
							resolve(res);
						}).catch(err => {
							// 如果发生错误，调用reject并传递错误信息
							reject(err);
						});
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