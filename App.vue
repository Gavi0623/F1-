<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* 引入下载的iconfont图标 */
	@import "@/static/fonts/iconfont.css";
	/* 引入uView基础样式 */
	@import "@/uni_modules/uview-ui/index.scss";
</style>