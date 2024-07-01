<template>
	<view class="box">
		<!-- 自定义导航栏 -->
		<view class="navBarBox" :style="{ height: `${statusBarHeight + navBarHeight}px` }">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{ height: `${statusBarHeight}px` }"></view>
			<!-- 真正的导航栏内容 -->
			<view class="navBar" :style="{ height: `${navBarHeight}px` }">
				<image v-if="showImg" class="logo" src="/static/f1_logo.svg" mode="scaleToFill"></image>
				<view>{{ title }}</view>
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
		},
	};
</script>

<style lang="scss" scoped>
	.box {
		.navBarBox {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 999;
			background-color: #fff;

			.statusBar {
				width: 100%;
			}

			.navBar {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				padding: 0 50rpx;

				.logo {
					width: 82rpx;
					height: 82rpx;
					margin-right: 10rpx;
					filter: invert(1);
				}
			}
		}

		.placeholder {
			width: 100%;
		}
	}
</style>