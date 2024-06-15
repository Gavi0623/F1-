<template>
	<view class="swiper">
		<u-swiper :list="swiperList" keyName="image" showTitle autoplay circular @click="goDetail(item.id)"
			v-if="swiperList.length > 0"></u-swiper>
	</view>
</template>

<script>
	export default {
		props: {
			swiperList: {
				type: Array,
				required: true
			}
		},
		methods: {
			goDetail(id) {
				this.$emit('go-detail', id);
			}
		}
	}
</script>

<style lang="scss">

</style>