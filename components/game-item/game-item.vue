<template>
	<view class="gameItem">
		<view class="f1-schedule">
			<view class="race-item" v-for="race in races" :key="race.id">
				<view class="race-info">
					<view class="race-name">{{ race.raceName }}</view>
					<view class="race-schedule">
						<view class="schedule-item">
							<view class="schedule-title">练习赛</view>
							<view class="schedule-time">{{ race.practiceTime }}</view>
						</view>
						<view class="schedule-item">
							<view class="schedule-title">排位赛</view>
							<view class="schedule-time">{{ race.qualifyingTime }}</view>
						</view>
						<view class="schedule-item">
							<view class="schedule-title">正赛</view>
							<view class="schedule-time">{{ race.raceTime }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "game-item",
		data() {
			return {
				races: [{
						id: 1,
						raceName: "Bahrain Grand Prix",
						practiceTime: "2023-03-03 15:00",
						qualifyingTime: "2023-03-04 18:00",
						raceTime: "2023-03-05 18:00",
					},
					{
						id: 2,
						raceName: "Saudi Arabian Grand Prix",
						practiceTime: "2023-03-17 15:00",
						qualifyingTime: "2023-03-18 18:00",
						raceTime: "2023-03-19 18:00",
					},
					{
						id: 3,
						raceName: "Australian Grand Prix",
						practiceTime: "2023-03-31 15:00",
						qualifyingTime: "2023-04-01 18:00",
						raceTime: "2023-04-02 18:00",
					},
				],
			};
		}
	}
</script>

<style lang="scss" scoped>
	.gameItem {
		.f1-schedule {
			padding: 20rpx;
			// background-color: #0c1e34;
			color: #fff;

			.race-item {
				background-color: #14f8f1;
				padding: 18rpx;
				border-radius: 10rpx;
				box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 18rpx;

				.race-info {
					.race-name {
						font-size: 32rpx;
						font-weight: bold;
					}

					.race-schedule {
						margin-top: 10rpx;

						.schedule-item {
							display: flex;
							justify-content: space-between;
							align-items: center;
							font-size: 28rpx;
							color: #ccc;

							.schedule-title {
								margin-right: 20rpx;
							}

							.schedule-time {
								font-weight: bold;
							}
						}
					}
				}
			}
		}
	}
</style>