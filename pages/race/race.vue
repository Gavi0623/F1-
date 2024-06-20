<template>
	<view class="race">
		<view class="navbar">
			<!-- 导航栏内容 -->
			<u-tabbar :value="value1" @change="change1" :fixed="false" :placeholder="false"
				:safeAreaInsetBottom="false">
				<u-tabbar-item text="赛程" @click="click1"></u-tabbar-item>
				<u-tabbar-item text="车手" @click="click1"></u-tabbar-item>
				<u-tabbar-item text="车队" @click="click1"></u-tabbar-item>
			</u-tabbar>
		</view>

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
				value1: 0,
				scheduleList: [],
				team: null
			};
		},

		onLoad() {
			this.getSchedule();
			this.getteamData();
		},

		methods: {
			change1(e) {
				this.value1 = e
				console.log('change1', e);
			},
			click1(e) {
				console.log('click1', e);
			},

			// 获取车队数据
			getteamData() {
				db.collection("teams2024").get().then(res => {
					console.log(res);
					this.team = res.result.data;
				})
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
	.race {}
</style>