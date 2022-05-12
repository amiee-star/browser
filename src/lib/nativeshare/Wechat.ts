import { assign, loadJs } from "./utils"
import Share from "./Share"
interface wxConfig {
	debug?: boolean // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	appId: string // 必填，公众号的唯一标识
	timestamp: number // 必填，生成签名的时间戳
	nonceStr: string // 必填，生成签名的随机串
	signature: string // 必填，签名
	jsApiList: string[] // 必填，需要使用的JS接口列表
}
interface wxShare {
	title: string
	desc: string
	link: string
  icon: string
	success?: () => void
	fail?: (res: any) => void
	complete?: (res: any) => void
	cancel?: (res: any) => void
	trigger?: (res: any) => void
}
interface checkJsParams {
	jsApiList: string[] // 需要检测的JS接口列表，所有JS接口列表见附录2,
	success: (res: any) => void
}

const menuList = [
	"menuItem:exposeArticle",
	"menuItem:setFont",
	"menuItem:dayMode",
	"menuItem:nightMode",
	"menuItem:refresh",
	"menuItem:profile",
	"menuItem:addContact",
	"menuItem:share:appMessage",
	"menuItem:share:timeline",
	"menuItem:share:qq",
	"menuItem:share:weiboApp",
	"menuItem:favorite",
	"menuItem:share:facebook",
	"menuItem:share:QZone",
	"menuItem:editTag",
	"menuItem:delete",
	"menuItem:copyUrl",
	"menuItem:originPage",
	"menuItem:readMode",
	"menuItem:openWithQQBrowser",
	"menuItem:openWithSafari",
	"menuItem:share:email",
	"menuItem:share:brand"
]
declare global {
	interface wx {
		config: (params: wxConfig) => void
		ready: (callback: () => void) => void
		error: (callback: (res: any) => void) => void
		checkJsApi: (params: checkJsParams) => void
		updateAppMessageShareData: (params: wxShare) => void
		updateTimelineShareData: (params: wxShare) => void
		onMenuShareTimeline: (params: wxShare) => void
		onMenuShareAppMessage: (params: wxShare) => void
		onMenuShareWeibo: () => void
		onMenuShareQZone: () => void
		startRecord: () => void
		stopRecord: () => void
		onVoiceRecordEnd: () => void
		playVoice: () => void
		pauseVoice: () => void
		stopVoice: () => void
		onVoicePlayEnd: () => void
		uploadVoice: () => void
		downloadVoice: () => void
		chooseImage: () => void
		previewImage: () => void
		uploadImage: () => void
		downloadImage: () => void
		translateVoice: () => void
		getNetworkType: () => void
		openLocation: () => void
		getLocation: () => void
		hideOptionMenu: () => void
		showOptionMenu: () => void
		hideMenuItems: () => void
		showMenuItems: () => void
		hideAllNonBaseMenuItem: () => void
		showAllNonBaseMenuItem: () => void
		closeWindow: () => void
		scanQRCode: () => void
		chooseWXPay: () => void
		openProductSpecificView: () => void
		addCard: () => void
		chooseCard: () => void
		openCard: () => void
	}
	const wx: wx
}

export default class Wechat extends Share {
	constructor(config: wxConfig) {
		super(config)
		this.setConfig(config)
	}

	call(command: string, options: wxShare) {
    this.setShareData(options)
	}

	setConfig(config: wxConfig) {
		super.setConfig(config)
		this.init(this.getConfig().wechatConfig)
	}

	init(config: wxConfig) {
    if (!config) {
			return
		}
		loadJs("https://res.wx.qq.com/open/js/jweixin-1.4.0.js", () => {
			wx.config(
				assign(
					{
						debug: false,
						jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"]
					},
					config
				)
			)

			const shareData = this._shareData
			const wxShareData = {}
      Object.defineProperty(wxShareData, "trigger", {
				get() {
					return (...args: any) => {
						assign(wxShareData, {
							title: shareData.title,
							desc: shareData.desc,
							link: shareData.link,
							imgUrl: shareData.icon,
							success: shareData.success,
							fail: shareData.fail,
							cancel: shareData.fail
						})
						shareData.trigger(...args)
					}
				},
				set(newValue) {
					shareData.trigger = newValue
				},
				enumerable: true
			})

			wx.ready(() => {
				// wx.updateAppMessageShareData(wxShareData as wxShare)
				// wx.updateTimelineShareData(wxShareData as wxShare)
				wx.onMenuShareTimeline(wxShareData as wxShare)
				wx.onMenuShareAppMessage(wxShareData as wxShare)
			})
		})
	}
}
