import serviceLocal from "@/services/service.local"
import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import moment from "moment"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { JMKContext } from "../provider/jmk.context"
import { throttle } from "../transitions/util"
import { Base64 } from "js-base64"
import { get } from "@/utils/http.request"

const MaterialLoading: React.FC = () => {
	const { state, dispatch } = useContext(JMKContext)

	const [videoList, setVideoList] = useState([])
	const [modelList, setModelList] = useState([])

	// 模型距离触发
	const [modelPlayList, setModelPlayList] = useState([])
	const [audioList, setAudioList] = useState([])
	// 初始化热点切换 图片和Img  隐藏
	const initPic = useCallback(
		type => {
			const assetsList = Array.from(state.app.assetsController.assets)
			let picGroup: string[] = []
			assetsList.forEach((item: any) => {
				if (
					item.extdata.info.custom.materialPicType == type &&
					item.extdata.info.custom.materialSwitch &&
					item.extdata.info.custom.targetMaterial &&
					item.extdata.info.custom.replaceMaterial
				) {
					picGroup.push(item.extdata.info.custom.replaceMaterial)
					if (item.extdata.info.custom.eventControl === "0") {
						item.extdata.info.custom.targetMaterial.forEach((abc: any) => {
							const newAsset = assetsList.find((a: any) => a.uuid == abc)
							if (!!newAsset) newAsset.visible = false
						})
					} else {
						const newAsset = assetsList.find((a: any) => a.uuid == item.extdata.info.custom.targetMaterial)
						if (!!newAsset) newAsset.visible = false
					}
				}
			})
			picGroup = [...new Set(picGroup)]
			picGroup.forEach((a: any) => {
				const targetMaterial = assetsList.find(
					(b: any) => b.extdata.info.custom.replaceMaterial === a && b.extdata.info.custom.materialPicType === type
				).extdata.info.custom.targetMaterial
				if (typeof targetMaterial === "string") {
					const newAsset = assetsList.find((c: any) => c.uuid == targetMaterial)
					if (!!newAsset) newAsset.visible = true
				} else {
					const newAsset = assetsList.find((c: any) => c.uuid == targetMaterial[0])
					if (!!newAsset) newAsset.visible = true
				}
			})
		},
		[state.app]
	)

	// 初始化视频距离触发  隐藏
	const initVideo = useCallback(() => {
		const assetsList = Array.from(state.app.assetsController.assets)
		const videoArr: any[] = []
		assetsList.forEach((item: any) => {
			if (item.extdata.info.custom.distanceTrigger && item.type == 1) {
				if (item.extdata.info.custom.triggerPlay.playShow) {
					item.visible = false
				}
				videoArr.push(item)
			}
			setVideoList(videoArr)
		})
	}, [state.app])

	const initModel = useCallback(() => {
		const assetsList = Array.from(state.app.assetsController.assets)
		const modelArr: any[] = []
		const audioArr: any[] = []
		const modelPlayArr: any[] = []
		assetsList.forEach((item: any) => {
			if (item.extdata.info.custom.portal && item.extdata.info.custom.portalWebsite) {
				modelArr.push(item)
				item.visible = false
			}
			// 模型距离触发隐藏
			if (item.extdata.info.custom.distanceTrigger && item.extdata.info.custom.triggerPlay.playShow && item.type == 4) {
				modelPlayArr.push(item)
			}
			if (item.type === 1 && item.contentType === 11) {
				audioArr.push(item)
				item.visible = false
				item.isPlay = false
				item.audio = null
			}
		})
		setModelList(modelArr)
		setAudioList(audioArr)
		setModelPlayList(modelPlayArr)
	}, [state.app])
	const show = useRef(true)
	// 初始化
	useEffect(() => {
		if (state.app && show.current) {
			show.current = false
			initPic("Img")
			initPic("Gif")
			initVideo()
			initModel()
		}
	}, [state])
	const ref = useRef(true)
	const sendProgress = useCallback(
		(name, data) => (item: any) => {
			const num = Math.floor((100 * item.totalDone()) / item.total)
			if (num == 0) {
				ref.current = true
			}
			if (num > 99 && !!ref.current) {
				ref.current = false
				state.app.viewer.loadAssets(data.info.extobjs)
			}
		},
		[state]
	)
	const isPlay = useRef(true)
	useEffect(() => {
		eventBus.on("scene.view.pusedMusic", val => {
			isPlay.current = !val
		})
	}, [isPlay])
	// 视频触发  和  模型穿梭 音频触发
	const playVideo = useCallback(() => {
		const cameraPos = state.editHook.getCameraPosition()
		if (!!videoList) {
			videoList.forEach((item: any) => {
				if (
					item.extdata.info.custom.triggerPlay.triggerType === 1 && // 距离触发
					item.position.distanceTo(cameraPos) <= item.extdata.info.custom.triggerPlay.distance &&
					!item.material.baseColorTexture.isPlaying
				) {
					item.material.baseColorTexture.loop = false
					//   state.sceneAudio?.pause()
					if (!!state.sceneAudio) {
						state.sceneAudio.volume = item.extdata.info.custom.triggerPlay.bgVolume || 0
					}
					item.material.baseColorTexture.play()
					item.material.baseColorTexture.video.currentTime = 0
					item.visible = true
				}
				if (
					item.extdata.info.custom.triggerPlay.triggerType === 1 && // 距离触发
					item.position.distanceTo(cameraPos) > item.extdata.info.custom.triggerPlay.distance &&
					item.material.baseColorTexture.isPlaying
				) {
					item.material.baseColorTexture.pause()
					item.extdata.info.custom.triggerPlay.playShow && (item.visible = false)
					if (!!state.sceneAudio) {
						state.sceneAudio.volume = 1
					}
				}
			})
		}
		if (!!modelList) {
			modelList.forEach((item: any) => {
				if (item.position.distanceTo(cameraPos) < 2) {
					if (window.openUrlInFocusWindow) {
						window.openUrlInFocusWindow(
							item.extdata.info.custom.portalWebsite +
								"JIMUYIDA" +
								`${Base64.encode(moment().add(15, "second").unix().toString())}#autoplay`
						)
					} else {
						location.href =
							item.extdata.info.custom.portalWebsite +
							"JIMUYIDA" +
							`${Base64.encode(moment().add(15, "second").unix().toString())}#autoplay`
					}
				}
			})
		}
		if (!!modelPlayList) {
			modelPlayList.forEach((item: any) => {
				if (item.position.distanceTo(cameraPos) < item.extdata.info.custom.triggerPlay.distance) {
					item.visible = false
				} else {
					item.visible = true
				}
			})
		}

		if (!!audioList) {
			const cameraPos = state.editHook.getCameraPosition()
			audioList.forEach((item: any) => {
				const visiblePlay = item.extdata.info.custom.triggerPlay.visiblePlay // 设置相机可见播放
				const nearestPlay = item.extdata.info.custom.triggerPlay.nearestPlay // 设置相机最近播放
				const isPlay = item.isPlay // 当前音乐是否存在
				if (
					item.extdata.info.custom.triggerPlay.triggerType === 1 && // 距离触发
					item.position.distanceTo(cameraPos) <= item.extdata.info.custom.triggerPlay.distance &&
					!isPlay
				) {
					item.audio = new Audio(item.texture)
					item.audio.id = item.uuid
					item.audio.preload = "preload"
					item.audio.loop = item.extdata.info.custom.triggerPlay.isLoop
					item.audio.volume = item.extdata.info.custom.triggerPlay.volume
					item.audio.play()
					item.isPlay = true
					if (!!item.extdata.info.custom.triggerPlay.isShowNarrator) {
						if (
							!!item.extdata.info.custom.triggerPlay.narratorLyrics &&
							!!item.extdata.info.custom.triggerPlay.narratorLyricsUrl
						) {
							get({
								url: urlFunc.replaceUrl(item.extdata.info.custom.triggerPlay.narratorLyricsUrl[0]),
								responseType: "text"
							}).then((res: string) => {
								const list = res.match(
									/[0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9] --> [0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9]\r\n[\w+|\u4e00-\u9fa5|\u3002|\uff1b|\uff0c|\uff1a|\u201c|\u201d|\uff08|\uff09|\u3001|\uff1f|\u300a|\u300b]{1,}/g
								)

								const result = list.map(item => {
									const timesList = item.match(/[0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9]/gm)
									const txt = item.match(
										/\r\n[\w+|\u4e00-\u9fa5|\u3002|\uff1b|\uff0c|\uff1a|\u201c|\u201d|\uff08|\uff09|\u3001|\uff1f|\u300a|\u300b]{1,}$/gm
									)[0]
									const data = { txt, start: timesList[0], end: timesList[1] }
									return data
								})
								eventBus.emit("scene.text.play", {
									muisc: ``,
									word: result,
									size: item.extdata.info.custom.triggerPlay.narratorSize,
									pic: item.extdata.info.custom.triggerPlay.narratorUrl.includes("assets")
										? urlFunc.replaceUrl(item.extdata.info.custom.triggerPlay.narratorUrl, "obs")
										: `${window.publicPath + item.extdata.info.custom.triggerPlay.narratorUrl}`
								})
							})
						} else {
							eventBus.emit("scene.text.play", {
								muisc: ``,
								word: [],
								size: item.extdata.info.custom.triggerPlay.narratorSize,
								pic: item.extdata.info.custom.triggerPlay.narratorUrl.includes("assets")
									? urlFunc.replaceUrl(item.extdata.info.custom.triggerPlay.narratorUrl, "obs")
									: `${window.publicPath + item.extdata.info.custom.triggerPlay.narratorUrl}`
							})
						}
					}
				}

				if (
					item.extdata.info.custom.triggerPlay.triggerType === 1 && // 距离触发
					item.position.distanceTo(cameraPos) > item.extdata.info.custom.triggerPlay.distance &&
					!!isPlay
				) {
					item.audio.pause()
					item.audio = null
					item.isPlay = false
					!!item.extdata.info.custom.triggerPlay.isShowNarrator && eventBus.emit("scene.text.stop")
				}
			})
		}
	}, [videoList, state, modelList, audioList, modelPlayList])

	// 音频范围触发
	const playAudio = useCallback(
		a => {
			const audioVolumeList = a.throwVolumes.audioVolumes
			const videoVolumeList = a.throwVolumes.videoVolumes
			audioList.forEach((item: any) => {
				const isRange = item.extdata.info.custom.triggerPlay.triggerType === 2 ? true : false
				const isInVolumeList = audioVolumeList.find((m: string) => m === item.uuid) ? true : false
				if (isRange && item.isPlay && !isInVolumeList) {
					//音乐正在播 并且已经出圈了   暂停
					item.audio.pause()
					item.audio = null
					item.isPlay = false
					!!item.extdata.info.custom.triggerPlay.isShowNarrator && eventBus.emit("scene.text.stop")
					if (!!state.sceneAudio) {
						state.sceneAudio.volume = 1
					}
				}

				if (isRange && !item.isPlay && isInVolumeList) {
					//音乐没有播 并且已经进入圈了   播放
					item.audio = new Audio(item.texture)
					item.audio.id = item.uuid
					item.audio.preload = "preload"
					item.audio.loop = item.extdata.info.custom.triggerPlay.isLoop
					item.audio.volume = item.extdata.info.custom.triggerPlay.volume
					item.audio.play()
					item.isPlay = true
					if (!!item.extdata.info.custom.triggerPlay.isShowNarrator) {
						if (
							!!item.extdata.info.custom.triggerPlay.narratorLyrics &&
							!!item.extdata.info.custom.triggerPlay.narratorLyricsUrl
						) {
							get({
								url: urlFunc.replaceUrl(item.extdata.info.custom.triggerPlay.narratorLyricsUrl[0]),
								responseType: "text"
							}).then((res: string) => {
								const list = res.match(
									/[0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9] --> [0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9]\r\n[\w+|\u4e00-\u9fa5|\u3002|\uff1b|\uff0c|\uff1a|\u201c|\u201d|\uff08|\uff09|\u3001|\uff1f|\u300a|\u300b]{1,}/gm
								)
								const result = list.map(item => {
									const timesList = item.match(/[0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9]/gm)
									const txt = item.match(
										/\r\n[\w+|\u4e00-\u9fa5|\u3002|\uff1b|\uff0c|\uff1a|\u201c|\u201d|\uff08|\uff09|\u3001|\uff1f|\u300a|\u300b]{1,}$/gm
									)[0]
									const data = { txt, start: timesList[0], end: timesList[1] }
									return data
								})
								eventBus.emit("scene.text.play", {
									muisc: ``,
									word: result,
									size: item.extdata.info.custom.triggerPlay.narratorSize,
									pic: item.extdata.info.custom.triggerPlay.narratorUrl.includes("assets")
										? urlFunc.replaceUrl(item.extdata.info.custom.triggerPlay.narratorUrl, "obs")
										: `${window.publicPath + item.extdata.info.custom.triggerPlay.narratorUrl}`
								})
							})
						} else {
							eventBus.emit("scene.text.play", {
								muisc: ``,
								word: [],
								size: item.extdata.info.custom.triggerPlay.narratorSize,
								pic: item.extdata.info.custom.triggerPlay.narratorUrl.includes("assets")
									? urlFunc.replaceUrl(item.extdata.info.custom.triggerPlay.narratorUrl, "obs")
									: `${window.publicPath + item.extdata.info.custom.triggerPlay.narratorUrl}`
							})
						}
					}
					if (!!state.sceneAudio) {
						state.sceneAudio.volume = item.extdata.info.custom.triggerPlay.bgVolume
					}
				}
			})
			videoList.forEach((item: any) => {
				const isRange = item.extdata.info.custom.triggerPlay.triggerType === 2 ? true : false
				const isInVolumeList = videoVolumeList.find((m: string) => m === item.uuid) ? true : false
				if (isRange && !isInVolumeList && item.material.baseColorTexture.isPlaying) {
					//音乐正在播 并且已经出圈了   暂停e
					item.material.baseColorTexture.pause()
					item.visible = false
					// item.extdata.info.custom.playShow && (item.visible = false)
					if (!!state.sceneAudio) {
						state.sceneAudio.volume = 1
					}
				}
				if (isRange && !item.material.baseColorTexture.isPlaying && isInVolumeList) {
					//音乐没有播 并且已经进入圈了   播放
					item.material.baseColorTexture.loop = false
					if (!!state.sceneAudio) {
						state.sceneAudio.volume = item.extdata.info.custom.triggerPlay.bgVolume
					}
					item.material.baseColorTexture.play()
					item.material.baseColorTexture.video.currentTime = 0
					item.visible = true
				}
			})
		},
		[audioList, videoList, state]
	)
	//监听视频距离触发
	useEffect(() => {
		if (!!state.jmt) {
			state.editHook.getCamera().addEventListener("positionChanged", throttle(playVideo, 80))
			state.editHook.scene.addEventListener("audioVolumesUpdated", throttle(playAudio, 80))
		}
	}, [state, videoList, modelList])

	// useEffect(() => {
	// 	if (!!state.jmt) {
	// 		playVideo()
	// 	}
	// }, [state, videoList, modelList, audioList])
	return null
}
export default MaterialLoading
