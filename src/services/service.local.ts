import { aniData } from "@/interfaces/ani.interface"
import {
	baseData,
	baseRes,
	getPictureFrameData,
	PageParams,
	pictureListData,
	withToken
} from "@/interfaces/api.interface"
import {
	bakeData,
	coverData,
	devicesData,
	JobItem,
	jobsData,
	renderParams,
	sceneData
} from "@/interfaces/jmt.interface"
import { post, postJson, get, put } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	upload(params: any) {
		return postJson<baseRes<string>>({
			url: `${urlFunc.requestHost()}/assets/file/upload`,
			params
		})
	},
	uploadlighties(sceneName: string) {
		return (params: any) =>
			postJson<any>({
				url: `${urlFunc.requestHost()}/scenes/${sceneName}/photometry/`,
				params
			})
	},
	uploadjmktextures(sceneName: string) {
		return (params: any) =>
			postJson<any>({
				url: `${urlFunc.requestHost()}/scenes/${sceneName}/textures/`,
				params
			})
	},
	assetsAdd(params: { name: string; type: number; file: string; thumbnail: string }) {
		return post<baseRes<string>>({
			url: `${urlFunc.requestHost()}/assets/add`,
			params
		})
	},
	assetsList(params: { fileType: number } & PageParams) {
		return get<baseRes<pictureListData>>({
			url: `${urlFunc.requestHost()}/assets/list`,
			params
		})
	},
	getPictureframe(params: withToken) {
		return get<baseRes<getPictureFrameData[]>>({
			url: `${urlFunc.requestHost()}/assets/frame/list`,
			params
		})
	},
	pictureframeadd(params: { name: string[]; corner: string[]; banner: string[] }) {
		return post<baseRes<string>>({
			url: `${urlFunc.requestHost()}/assets/frame/add`,
			params
		})
	},
	pictureframedelete(params: { id: string[] }) {
		return post<baseRes<string>>({
			url: `${urlFunc.requestHost()}/assets/frame/delete`,
			params
		})
	},
	cover(sceneName: string) {
		return get<baseRes<coverData>>({
			url: `${urlFunc.requestHost()}/3d/${sceneName}/cover.json`
		})
	},
	setCover(sceneName: string, coverJson: coverData) {
		return postJson<coverData>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/settings/cover`,
			params: coverJson
		})
	},
	buffToImg(sceneName: string, params: any) {
		return post<any>({
			url: `${urlFunc.requestHost()}/screenshot/${sceneName}/upload`,
			params: params
		})
	},
	addIES(sceneName: string, params: any) {
		return post<any>({
			url: `${urlFunc.requestHost()}/screenshot/${sceneName}/upload`,
			params: params
		})
	},
	devices() {
		return get<baseRes<devicesData[]>>({
			url: `${urlFunc.requestHost()}/devices/`
		})
	},
	renderEditor(sceneName: string, params: renderParams) {
		return postJson<baseRes<JobItem>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/editor/render/`,
			params
		})
	},
	bakeEditor(sceneName: string) {
		return postJson<baseRes<JobItem>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/editor/bake/`
		})
	},
	postProcess(sceneName: string) {
		return postJson<baseRes<JobItem>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/editor/post-process/`
		})
	},
	renderSettings(sceneName: string) {
		return get<baseRes<bakeData>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/settings/render`
		})
	},
	sceneEditor(sceneName: string, params: renderParams) {
		return post<baseRes<devicesData[]>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/scene`,
			params
		})
	},
	getCoverJson(sceneName: string, params: renderParams) {
		return post<baseRes<devicesData[]>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/scene`,
			params
		})
	},
	coverEditor(sceneName: string, params: renderParams) {
		return post<baseRes<devicesData[]>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/cover.json`,
			params
		})
	},
	renderSettingsEdit(sceneName: string, params: bakeData) {
		return postJson<baseRes<string>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/settings/render`,
			params
		})
	},
	sceneJsonEdit(sceneName: string, params: any) {
		return postJson<baseRes<devicesData[]>>({
			url: `${urlFunc.requestHost()}/scenes/example-room/scene.json`,
			params
		})
	},
	jobsList(params?: { stateTag: string }) {
		return get<baseRes<jobsData>>({
			url: `${urlFunc.requestHost()}/jobs/`,
			params
		})
	},
	cancleJob(id: number) {
		return postJson({
			url: `${urlFunc.requestHost()}/jobs/${id}/cancel`
		})
	},
	sceneList() {
		return get<baseRes<sceneData>>({
			url: `${urlFunc.requestHost()}/scenes`
		})
	},
	animation(sceneName: string) {
		return get<baseRes<aniData[]>>({
			url: `${urlFunc.requestHost()}/3d/${sceneName}/animation.json`
		})
	},
	// 通过id获取文章
	getArticle(params: { id: string }) {
		return get<any>({
			url: `${urlFunc.requestHost("material")}/scene-portal/home/news/info`,
			params
		})
	},

	//导航大纲
	getOutLine(sceneName: string, params: any) {
		return get<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/outline.json`,
			params
		})
	},
	// 展品定位
	getExhibitPosition(sceneName: string, params: any) {
		return get<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/exhibit.json`,
			params
		})
	},
	// 定位分类
	getExhibitClass(sceneName: string, params: any) {
		return get<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/classify.json`,
			params
		})
	},
	// 组合展厅列表
	combinScenes() {
		return get<any>({
			url: `${urlFunc.requestHost()}/scenes/combinScenes.json`
		})
	},
	getCustomButton(sceneName: string, params: any) {
		return get<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/customButton.json`,
			params
		})
	},

	// 展厅基础信息接口
	baseScene(sceneName: string) {
		return get<baseRes<baseData>>({
			url: `${urlFunc.requestHost()}/3d/${sceneName}/view/base.json`
			// params
		})
	}
}
