<template>
	<view class="container">
		<view class="nav">
			<view class="nav-item" :class="{ 'active': displayType === '0' }" @click="changeDisplayType('0')">
				积分榜
			</view>
			<view class="nav-item" :class="{ 'active': displayType === '1' }" @click="changeDisplayType('1')">
				分站冠军
			</view>
		</view>

		<view class="data-section">
			<view class="data-header" v-if="displayType === '0'">
				<view class="data-header-item data-header-rank">排名</view>
				<view class="data-header-item data-header-team">车队</view>
				<view class="data-header-item data-header-points">总积分</view>
			</view>
			<view class="data-header" v-if="displayType === '1'">
				<view class="data-header-item data-header-rank">排名</view>
				<view class="data-header-item data-header-name">车队</view>
				<view class="data-header-item data-header-champion">冠</view>
				<view class="data-header-item data-header-runner">亚</view>
				<view class="data-header-item data-header-third">季</view>
			</view>

			<view class="driver-item" v-for="(team,index) in teamData" :key="team.name">
				<view class="driver-rank">{{ team.rank }}</view>
				<view class="driver-team">{{ team.team }}</view>
				<view class="driver-points" v-if="displayType === '0'">{{ team.points }}</view>
				<view class="driver-champion" v-if="displayType === '1'">{{ team.champion }}</view>
				<view class="driver-runner" v-if="displayType === '1'">{{ team.runner }}</view>
				<view class="driver-third" v-if="displayType === '1'">{{ team.third }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "team-item",
		data() {
			return {
				displayType: '0',
				teamData: [{
						rank: 1,
						name: 'Mercedes',
						team: 'Mercedes',
						points: 701,
						champion: 6,
						runner: 5,
						third: 5
					},
					{
						rank: 2,
						name: 'Red Bull',
						team: 'Red Bull',
						points: 417,
						champion: 2,
						runner: 3,
						third: 2
					},
					{
						rank: 3,
						name: 'Ferrari',
						team: 'Ferrari',
						points: 477,
						champion: 2,
						runner: 2,
						third: 2
					},
					{
						rank: 4,
						name: 'McLaren',
						team: 'McLaren',
						points: 145,
						champion: 0,
						runner: 0,
						third: 0
					},
					{
						rank: 5,
						name: 'Renault',
						team: 'Renault',
						points: 91,
						champion: 0,
						runner: 0,
						third: 0
					}
				]
			};
		},
		methods: {
			changeDisplayType(type) {
				this.displayType = type;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		padding: 0;
		box-sizing: border-box;

		.nav {
			box-sizing: border-box;
			height: 100vh;
			border-right: 1rpx solid #eee;

			.nav-item {
				width: 140rpx;
				padding: 18rpx;
				text-align: center;
				background-color: #f2f2f2;

				&.active {
					background-color: #007aff;
					color: #fff;
				}
			}
		}

		.data-section {
			box-sizing: border-box;
			flex: 1;
			position: relative;

			.data-header {
				top: 0;
				display: flex;
				background-color: #f2f2f2;
				padding: 20rpx 0;
				z-index: 1;

				.data-header-rank {
					width: 80rpx;
					font-weight: bold;
					text-align: center;
				}

				.data-header-name {
					flex: 2;
					font-weight: bold;
					text-align: center;
				}

				.data-header-team {
					flex: 2;
					text-align: center;
					font-weight: bold;
				}

				.data-header-points {
					flex: 1;
					font-weight: bold;
					text-align: center;
				}

				.data-header-champion,
				.data-header-runner,
				.data-header-third {
					width: 100rpx;
					font-weight: bold;
					text-align: center;
				}
			}

			.driver-item {
				display: flex;
				align-items: center;
				padding: 20rpx 0;
				border-bottom: 2rpx solid #eee;

				.driver-rank {
					width: 80rpx;
					text-align: center;
				}

				.driver-name {
					flex: 3;
					text-align: center;
				}

				.driver-team {
					flex: 3;
					text-align: center;
				}

				.driver-points {
					flex: 1;
					text-align: center;
				}

				.driver-champion,
				.driver-runner,
				.driver-third {
					width: 100rpx;
					text-align: center;
				}
			}
		}
	}
</style>