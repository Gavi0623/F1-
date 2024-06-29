<template>
	<view class="container">
		<!-- 自定义导航栏 -->
		<view class="navBarBox">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{ paddingTop: statusBarHeight + 'px' }"></view>
			<!-- 真正的导航栏内容 -->
			<view class="navBar">
				<image class="logo" src="/static/f1_logo.svg" mode="scaleToFill"></image>
				<view>我的长文</view>
			</view>
		</view>

		<unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}" :collection="collectionList"
			field="user_id,title,description,tab,province,content,excerpt,article_status,last_comment_user_id,picurls,publish_date,publish_ip,last_modify_date,last_modify_ip"
			where="user_id == $cloudEnv_uid" orderby="publish_date desc">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="data">
				<uni-list>
					<uni-list-item v-for="(item, index) in data" :key="index" showArrow :clickable="true"
						@click="handleItemClick(item._id)">
						<template v-slot:body>
							<text>
								<!-- 此处默认显示为_id，请根据需要自行修改为其他字段 -->
								<!-- 如果使用了联表查询，请参考生成的 admin 项目中 list.vue 页面 -->
								{{item.title}}
							</text>
						</template>
					</uni-list-item>
				</uni-list>
			</view>
			<uni-load-more :status="loading?'loading':(hasMore ? 'more' : 'noMore')"></uni-load-more>
		</unicloud-db>
		<uni-fab ref="fab" horizontal="right" vertical="bottom" :pop-menu="false" @fabClick="fabClick" />
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				// 状态栏高度
				statusBarHeight: 0,
				// 导航栏高度
				navBarHeight: 82 + 11,
				collectionList: "circle_articles",
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				}
			}
		},
		onPullDownRefresh() {
			this.$refs.udb.loadData({
				clear: true
			}, () => {
				uni.stopPullDownRefresh()
			})
		},
		created() {
			//获取手机状态栏高度
			this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];
		},
		onReachBottom() {
			this.$refs.udb.loadMore()
		},
		methods: {
			// 跳转至详情页
			handleItemClick(id) {
				uni.navigateTo({
					url: '/pages/circle/detail/detail?id=' + id // 跳转至我们自己写的详情页
				})
			},
			fabClick() {
				// 打开新增页面
				uni.navigateTo({
					url: './add',
					events: {
						// 监听新增数据成功后, 刷新当前页面数据
						refreshData: () => {
							this.$refs.udb.loadData({
								clear: true
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
</style>