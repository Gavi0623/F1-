// 获取富文本内的图片url地址
export function getImgSrc(richtext, num = 3) {
	let imgList = [];
	richtext.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
		imgList.push(capture);
	});
	imgList = imgList.slice(0, num)
	return imgList;
}

// 向外导出省份
export function getProvince() {
	return new Promise((resolve, reject) => {
		let historyProvince = uni.getStorageSync("historyProvince");
		if (historyProvince) {
			if ((Date.now() - historyProvince.time) > 1000 * 60 * 60) {
				getIp().then(res => {
					resolve(res);
				}).catch(err => {
					reject(err);
				})
			} else {
				resolve(historyProvince.province);
			}
		} else {
			getIp().then(res => {
				resolve(res);
			}).catch(err => {
				reject(err);
			})
		}
	})
}

// 获取所在省市
function getIp() {
	return new Promise((resolve, reject) => {
		uni.request({
			url: "https://restapi.amap.com/v3/ip?key=b938e76038963549c488977783c7c1ae",
			success: (res) => {
				console.log("这是网络请求");
				let str = "";
				typeof(res.data.province) == 'string' ? str = res.data.province: str = "未知区域";
				resolve(str);
				let obj = {
					province: str,
					time: Date.now()
				}
				uni.getStorageSync("historyProvince", obj);
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}


// 获取昵称
export function giveName(item) {
	return item.user_id[0].nickname || item.user_id[0].username || item.user_id[0].mobile || "未设置昵称"
}

// 获取默认头像
export function giveAvatar(item) {
	return item.user_id[0]?.avatar_file?.url ?? '../../static/images/user-default.jpg'
}


const db = uniCloud.database();
const utilsObj = uniCloud.importObject("utilsObj", {
	customUI: true // 取消自动展示的交互界面
});
// 点赞操作数据库的方法
export async function likeFun(artid) {
	// 查询当前用户是否点赞过该文章
	let count = await db.collection("news_like").where(
		`article_id=='${artid}' && user_id==$cloudEnv_uid `).count()

	if (count.result.total) {
		// 取消点赞
		db.collection("news_like").where(`article_id=='${artid}' && user_id==$cloudEnv_uid `)
			.remove();
		// 更改点赞数
		utilsObj.operation("news_articles", "like_count", artid, -1)
	} else {
		// 追加数据
		db.collection("news_like").add({
			article_id: artid
		});
		utilsObj.operation("news_articles", "like_count", artid, 1)
	}
}