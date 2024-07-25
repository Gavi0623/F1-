<template>
	<view class="race">
		<view class="fixed-header">
			<!-- 状态栏占位 -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="statusBar" :style="{ height: statusBarHeight + 'px' }"></view>
			<!-- #endif -->

			<!-- #ifdef MP-WEIXIN -->
			<nav-bar :re="re"></nav-bar>
			<!-- #endif -->
			<view class="navbar">
				<!-- 导航栏内容 -->
				<u-tabbar :value="value1" @change="change1" :fixed="false" :placeholder="false"
					:safeAreaInsetBottom="false">
					<u-tabbar-item text="赛程" @click="click1"></u-tabbar-item>
					<u-tabbar-item text="车手" @click="click1"></u-tabbar-item>
					<u-tabbar-item text="车队" @click="click1"></u-tabbar-item>
				</u-tabbar>
			</view>
		</view>

		<!-- 占位元素，防止内容被固定header遮挡 -->
		<view class="header-placeholder" :style="{ height: headerHeight + 'px' }"></view>

		<view class="container">
			<view class="schedule" v-if="value1==0" v-for="(schedule,index) in scheduleList" :key="index">
				<!-- 在父组件中引用子组件 game-item,并将 schedule 对象作为 props 传递给子组件。 -->
				<game-item :schedule="schedule"></game-item>
			</view>

			<view class="driver" v-if="value1==1">
				<driver-item></driver-item>
			</view>

			<view class="team" v-if="value1==2">
				<team-item></team-item>
			</view>

		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();

	export default {
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 0,
				headerHeight: 0,
				value1: 0,
				scheduleList: [],
				re: false
			};
		},

		onLoad() {
			this.getSchedule();
		},

		created() {

			this.initHeaderHeight();
		},

		methods: {
			initHeaderHeight() {
				const systemInfo = uni.getSystemInfoSync();
				this.statusBarHeight = systemInfo.statusBarHeight;
				console.log(this.statusBarHeight);

				// #ifdef MP-WEIXIN
				this.menuButtonInfo = wx.getMenuButtonBoundingClientRect();
				this.navBarHeight = (this.menuButtonInfo.top + systemInfo.statusBarHeight) * 2 + this.menuButtonInfo
					.height;
				console.log(this.menuButtonInfo.height);
				console.log(this.menuButtonInfo.top);
				// #endif

				// #ifndef MP-WEIXIN
				if (systemInfo.platform === 'android') {
					this.navBarHeight = 80;
				} else {
					this.navBarHeight = 46;
				}
				// #endif

				this.headerHeight = this.navBarHeight;
			},

			change1(e) {
				this.value1 = e
				console.log('change1', e);
			},
			click1(e) {
				console.log('click1', e);
			},

			getSchedule() {
				db.collection("schedule2024").get().then(res => {
					console.log(res);
					this.scheduleList = res.result.data;
				}).catch(err => {
					console.error(err);
				})
			}
		}
	};
</script>

<style lang="scss">
	.race {
		.fixed-header {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 999;
			background-color: #fff;

			.statusBar {
				width: 100%;
			}

			.navbar {
				width: 100%;
				display: flex;
				align-items: center;
			}
		}

		.header-placeholder {
			width: 100%;
		}
	}
</style>