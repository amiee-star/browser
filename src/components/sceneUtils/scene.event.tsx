import { contentType } from "@/constant/jmk.type"
import { assetData } from "@/interfaces/extdata.interface"
import eventBus from "@/utils/event.bus"
import { useCallback, useContext, useEffect, useRef } from "react"
import { ModalCustom } from "../modal/modal.context"
import ViewerModal from "../modal/sceneView/viewer.modal"
import ViewModal from "../modal/sceneView/viewer.modal"
import { JMKContext } from "../provider/jmk.context"
import service from "@/services/service.scene"
import urlFunc from "@/utils/url.func"

const SceneEvent: React.FC = () => {
	const { state, dispatch } = useContext(JMKContext)
	const isPlay = useRef(true)
	const modalClose = useCallback(() => {
		if (isPlay.current) {
			state.sceneAudio?.play()
		}
	}, [state])
	useEffect(() => {
		eventBus.on("scene.view.pusedMusic", val => {
			isPlay.current = !val
		})
	}, [isPlay])
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
			// eventBus.emit("scene.view.shuttleVideo", true)
		},
		[state]
	)
	const extClick = useCallback(
		(e: assetData) => {
			if (!e) return
			if (state.app) {
				eventBus.emit("jmk.assetClick")
				if (e.extdata.info.custom.inlineplay) {
					state.sceneAudio?.pause()
					return false
				}
				if (e.type == 3) {
					return false
				}
				if (e.extdata.info.custom.openMode === "openLink") {
					const url = e.extdata.info.url
					const newUrl = url.toLocaleLowerCase().indexOf("http") == 0 ? url : "//" + url
					if (!!url && e.extdata.info.target == 3) {
						// 新窗口打开
						if (window.openUrlInFocusWindow) {
							window.openUrlInFocusWindow(newUrl)
						} else {
							window.open(newUrl)
						}
					}
					if (!!newUrl && e.extdata.info.target != 3) {
						const isZipArr = url.split(".")
						const isZip = isZipArr[isZipArr.length - 1].toLocaleUpperCase()
						let modelUrl = newUrl
						if (isZip === "ZIP" || isZip === "RAR" || isZip === "JM3") {
							const url123 = urlFunc.replaceUrl(url + "/i3dconfig.json", "node")
							modelUrl = "/sdk/ipadpro.html?model=" + encodeURIComponent(url123)
						}
						// 弹框打开
						ModalCustom({
							content: ViewerModal,
							params: {
								url: modelUrl,
								// url: "www.baidu.com",
								width:
									e.extdata.info.custom.openWidthRatio && parseInt(e.extdata.info.custom.openWidthRatio.split("*")[0]),
								height:
									e.extdata.info.custom.openWidthRatio && parseInt(e.extdata.info.custom.openWidthRatio.split("*")[1]),
								data: e
							}
						})
					}
					return false
				}
				if (
					e.extdata.info.custom.materialSwitch &&
					e.extdata.info.custom.targetMaterial &&
					e.extdata.info.custom.eventControl !== "0"
				) {
					const newArr = Array.from(state.app.assetsController.assets)
					newArr.forEach((item: any) => {
						if (item.uuid == e.extdata.info.custom.targetMaterial) {
							// 切换视频
							if (e.extdata.info.custom.materialPicType === "Video" && e.extdata.info.custom.replaceMaterial) {
								item.material.baseColorTexture.video.pause()
								item.material.baseColorTexture.video.src = e.extdata.info.custom.replaceMaterial
								item.material.baseColorTexture.video.play()
								item.material.baseColorTexture.play()
							}
							// 播放模型动画  Gif
							if (e.extdata.info.custom.materialPicType === "Model") {
								if (!item.isRunning) {
									state.app.animationsController.play(item, 2201)
									item.isRunning = true
								} else {
									state.app.animationsController.getAssetAction(item)
									item.isRunning = false
								}
							}
							// 单点切换图片
							if (e.extdata.info.custom.materialPicType === "Img" || e.extdata.info.custom.materialPicType === "Gif") {
								const arrNew = newArr.filter(
									(b: any) =>
										b.extdata.info.custom.replaceMaterial === e.extdata.info.custom.replaceMaterial &&
										b.extdata.info.custom.materialPicType === e.extdata.info.custom.materialPicType
								) // 同组的图片热点
								arrNew.forEach((aaa: any) => {
									const newAsset = newArr.find((c: any) => c.uuid == aaa.extdata.info.custom.targetMaterial)
									if (!!newAsset) newAsset.visible = false
								})
								item.visible = true
							}
						}
					})
					return false
				}

				if (
					e.extdata.info.custom.materialSwitch &&
					e.extdata.info.custom.targetMaterial &&
					e.extdata.info.custom.eventControl === "0"
				) {
					const newArr = Array.from(state.app.assetsController.assets)
					// 轮播切换图片
					if (e.extdata.info.custom.materialPicType === "Img" || e.extdata.info.custom.materialPicType === "Gif") {
						const arrNew = newArr.filter(
							(b: any) =>
								b.extdata.info.custom.replaceMaterial === e.extdata.info.custom.replaceMaterial &&
								b.extdata.info.custom.materialPicType === e.extdata.info.custom.materialPicType
						) // 同组的图片热点
						if (arrNew.length < 2) {
							return false
						}
						// 热点在同组中第几个
						const itemIndex = arrNew.findIndex((index: any) => index.uuid === e.uuid)
						if (itemIndex > 1) {
							return false
						}
						let uuIdList = [
							...arrNew[0].extdata.info.custom.targetMaterial,
							...arrNew[1].extdata.info.custom.targetMaterial
						]
						uuIdList = [...new Set(uuIdList)]
						// 标记目前显示的第几张
						if (!e.eventControlIndex) {
							arrNew[0].eventControlIndex = 0
							arrNew[1].eventControlIndex = 0
						}
						// 第1个热点 向后
						if (itemIndex === 0) {
							if (e.eventControlIndex == 0) {
								return false
							} else {
								const newAsset = newArr.find((c: any) => c.uuid == uuIdList[e.eventControlIndex])
								if (!!newAsset) newAsset.visible = false
								const newAsset111 = newArr.find((c: any) => c.uuid == uuIdList[e.eventControlIndex - 1])
								if (!!newAsset111) newAsset111.visible = true
								arrNew[0].eventControlIndex--
								arrNew[1].eventControlIndex--
							}
						} else {
							if (e.eventControlIndex == uuIdList.length - 1) {
								return false
							} else {
								const newAsset = newArr.find((c: any) => c.uuid == uuIdList[e.eventControlIndex])
								if (!!newAsset) newAsset.visible = false
								const newAsset111 = newArr.find((c: any) => c.uuid == uuIdList[e.eventControlIndex - -1])
								if (!!newAsset111) newAsset111.visible = true
								arrNew[0].eventControlIndex++
								arrNew[1].eventControlIndex++
							}
						}
					}
					return false
				}
				if ([contentType.GIF, contentType.PIC, contentType.MP4].includes(e.contentType)) {
					state.sceneAudio?.pause()
					if (e.contentType === contentType.MP4) {
						e.material.baseColorTexture.video.pause()
					}
					console.log("走这里 view")
					ModalCustom({
						content: ViewModal,
						params: {
							onClose: modalClose,
							data: e
						}
					})
				}
			}
		},
		[state, state.app]
	)
	useEffect(() => {
		eventBus.off("jmk.assetSelected").on("jmk.assetSelected", extClick)
	}, [state])
	return null
}
export default SceneEvent
