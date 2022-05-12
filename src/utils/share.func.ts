export default {
	/**
	 * 分享QQ好友
	 * @param  {[type]} title [分享标题]
	 * @param  {[type]} url   [分享url链接，默认当前页面链接]
	 * @param  {[type]} pic   [分享图片]
	 * @return {[type]}       [description]
	 */
	qqFriend: (url: string, title: string, pic: string, summary?: string) => {
		let param = {
			url: url || window.location.href
			// desc: "",
			// /*分享理由*/
			// title: title || "",
			// /*分享标题(可选)*/
			// summary: summary || "",
			// /*分享描述(可选)*/
			// pics: pic || ""
			/*分享图片(可选)*/
		}
		let s = []
		for (let i in param) {
			s.push(i + "=" + encodeURIComponent(param[i] || ""))
		}
		let targetUrl = "http://connect.qq.com/widget/shareqq/iframe_index.html?" + s.join("&")
		window.open(targetUrl, "qq", "height=520, width=720")
	},
	/**
	 * 分享QQ空间
	 * @param  {[type]} url   [分享url链接，默认当前页面链接]
	 * @param  {[type]} pic   [分享图片]
	 * @return {[type]} desc  [description]
	 */
	qZone: (url: string, desc: string, pic: string) => {
		let param = {
			url: url,
			desc: desc,
			pic: pic
		}
		let s = []
		for (let i in param) {
			s.push(`${i}=${encodeURIComponent(param[i] || "")}`)
		}
		let targetUrl = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?${s.join("&")}`
		window.open(targetUrl, "qzone", "height=520, width=720")
	},
	/**
	 * 分享新浪微博
	 * @param  {[type]} title [分享标题]
	 * @param  {[type]} url   [分享url链接，默认当前页面]
	 * @param  {[type]} pic   [分享图片]
	 * @return {[type]}       [description]
	 */
	weibo: (url: string, title: string, pic: string) => {
		let param = {
			url: url || window.location.href,
			type: "3",
			count: "1",
			/** 是否显示分享数，1显示(可选)*/
			appkey: "",
			/** 您申请的应用appkey,显示分享来源(可选)*/
			title: title,
			/** 分享的文字内容(可选，默认为所在页面的title)*/
			pic: pic || "",
			/**分享图片的路径(可选)*/
			ralateUid: "",
			/**关联用户的UID，分享微博会@该用户(可选)*/
			rnd: new Date().valueOf()
		}
		let temp = []
		for (let p in param) {
			temp.push(p + "=" + encodeURIComponent(param[p] || ""))
		}
		let targetUrl = "http://service.weibo.com/share/share.php?" + temp.join("&")
		window.open(targetUrl, "sinaweibo", "height=430, width=400")
	}
}
