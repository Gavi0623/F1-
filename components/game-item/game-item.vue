<template>
	<view class="gameItem">
		<view class="f1-schedule">
			<view class="race-item">
				<view class="race-info">
					<view class="race-name">{{ schedule.racename }}</view>
					<view class="race-schedule">
						<view class="schedule-item">
							<view class="schedule-title">一练</view>
							<view class="schedule-time">
								<uni-dateformat :date="schedule.practice1" format="yyyy年MM月dd日 hh:mm"></uni-dateformat>
							</view>
						</view>
						<view class="schedule-item">
							<view class="schedule-title">二练</view>
							<view class="schedule-time">
								<uni-dateformat :date="schedule.practice2" format="yyyy年MM月dd日 hh:mm"></uni-dateformat>
							</view>
						</view>
						<view class="schedule-item">
							<view class="schedule-title">三练</view>
							<view class="schedule-time">
								<uni-dateformat :date="schedule.practice3" format="yyyy年MM月dd日 hh:mm"></uni-dateformat>
							</view>
						</view>
						<view class="schedule-item">
							<view class="schedule-title">排位赛</view>
							<view class="schedule-time">
								<uni-dateformat :date="schedule.qualifying" format="yyyy年MM月dd日 hh:mm"></uni-dateformat>
							</view>
						</view>
						<view class="schedule-item">
							<view class="schedule-title">正赛</view>
							<view class="schedule-time">
								<uni-dateformat :date="schedule.race" format="yyyy年MM月dd日 hh:mm"></uni-dateformat>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();

	export default {
		name: "game-item",
		props: {
			schedule: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		/* props: {
			schedule: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		: 这是组件的 props 定义,
		它接收一个名为 schedule 的 Object 类型的属性,
		如果父组件没有传递该属性,
		则默认值为一个空对象。
		data() {
			return {};
		},
		: 这是组件的数据选项,
		可以在这里定义组件所需的数据。 */
		data() {
			return {

			};
		},
		onLoad() {

		},

		methods: {

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