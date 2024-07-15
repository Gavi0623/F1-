<template>
	<view class="box">
		<!-- 自定义导航栏 -->
		<view class="nav-BarBox" :style="{ height: `${statusBarHeight + navBarHeight}px` }">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{ height: `${statusBarHeight}px` }"></view>
			<!-- 真正的导航栏内容 -->
			<view class="navBar" :style="{ height: `${navBarHeight}px` }">
				<view class="re" @tap="goRe" v-if="re">
					<text class="iconfont icon-fanhui"></text>
				</view>
				<view class="center-content">
					<image v-if="showImg" class="logo" src="/static/f1_logo.svg" mode="scaleToFill"></image>
					<view>{{ title }}</view>
				</view>
				<view class="re"></view> <!-- 添加一个空的view来平衡布局 -->
			</view>
		</view>
		<!-- 占位，防止内容被导航栏遮挡 -->
		<view class="placeholder" :style="{ height: `${statusBarHeight + navBarHeight}px` }"></view>
	</view>
</template>

<script>
	export default {
		name: "nav-bar",
		props: {
			title: {
				type: String,
				default: 'F1 App'
			},
			showImg: {
				type: Boolean,
				default: true
			},
			re: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 0,
			};
		},
		created() {
			this.initNavBar();
		},
		methods: {
			initNavBar() {
				const systemInfo = uni.getSystemInfoSync();
				this.statusBarHeight = systemInfo.statusBarHeight;

				// 根据平台设置导航栏高度
				if (systemInfo.platform === 'android') {
					this.navBarHeight = 48;
				} else {
					// 默认值
					this.navBarHeight = 46;
				}

				// 微信小程序可以使用 wx.getMenuButtonBoundingClientRect() 获取胶囊按钮位置信息
				// #ifdef MP-WEIXIN
				const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
				this.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height;
				// #endif
			},

			// 返回上一页
			goRe() {
				uni.navigateBack();
			}
		},
	};
</script>

<style lang="scss" scoped>
	.box {
		.nav-BarBox {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			background-color: #fff;

			.statusBar {
				width: 100%;
			}

			.navBar {
				display: flex;
				flex-direction: row;
				justify-content: space-between; // 改为 space-between
				align-items: center;
				padding: 0 20rpx; // 减小左右padding

				.re {
					flex: 0 0 auto; // 不伸缩，保持自身大小
				}

				.logo {
					width: 82rpx;
					height: 82rpx;
					margin-right: 10rpx;
					filter: invert(1);
				}

				// 新增：将标题和logo包裹在一起
				.center-content {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}

		.placeholder {
			width: 100%;
		}
	}
</style>