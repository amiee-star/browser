export interface ExtData {
	info: ExtDataInfo
	contentType: number
	placeholder: string
	texture: string
}
export interface ExtDataInfo {
	description: string
	btnText: string
	custom: ExtDataInfoCustom
	discripe: string
	hot: any
	linkType: number
	music: string
	sweep: string
	swiperList: string[]
	target: number
	url: string
	urlName: string
}
export interface ExtDataInfoCustom {
	openBgOpacity: number
	openIframeOpacity: number
	openWidthRatio: string
	btnColor: string
	detailAlbum: any
	detailAlbumEye: boolean
	detailArticle: {
		id: string
		title: string
	}
	detailAudio: {
		musicId: string
		musicFile: string
		name: string
		musicType: string
		musicTypeId: string
		singer: string
		size: number
		time: number
	}
	inlineplay: boolean
	normal: {
		x: number
		y: number
		z: number
	}
	tag: ExtDataTag
	portal: boolean
	portalWebsite: string
	materialSwitch: boolean
	transitVideo: string
	targetMaterial: string
	replaceMaterial: string
	materialPicType: string
	eventControl: string
	openMode: string
}
export interface ExtDataTag {
	enable: boolean
	length: number
	showTitle: boolean
	texture: string
	visible: boolean
	title: string
}
export interface assetData {
	config: {
		color: string
		contentType: number
		height: number
		index: number
		lightProbeId: number
		name: string
		normal: any[]
		object: any
		position: any[]
		radius: number
		scale: number
		style: string
		texture: string
		textureLoader: any
		thumb: string
		type: number
		width: number
	}
	link?: string
	type: number
	contentType: number
	enable: true
	extdata: ExtData
	id: string
	info: {
		target: number
		url: string
	}
	name: string
	opacity: number
	position: number[]
	rotatio: [number, number, number, string]
	scale: number[]
	texture: string
	normal: number[]
	thumb: string
	x0: number
	y0: number
	x1: number
	y1: number
	restoreScale: Function
	frameVisible: boolean
	frameId: string
	bannerImage: string
	cornerImage: string
}
