import { coverMinimap } from "@/interfaces/jmt.interface"
import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import { AntDesignOutlined, ZoomInOutlined } from "@ant-design/icons"
import { Spin } from "antd"
import { debounce, isString } from "lodash"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import PreviewMapModal from "@/components/modal/sceneView/mapPreview.modal"
import { animated, useSpring } from "react-spring"
import { useGesture } from "react-use-gesture"
import { Handler } from "react-use-gesture/dist/types"
import { ModalCustom } from "../modal/modal.context"
import { JMKContext } from "../provider/jmk.context"
import { throttle } from "../transitions/util"
import "./minmap.ui.less"

const MinMapUI: React.FC = () => {
	const [showMap, setShowMap] = useState(false)
	const { state } = useContext(JMKContext)
	const miniMap: Partial<coverMinimap> = useMemo(() => (state.sceneCofing ? state.sceneCofing.info.minimap : {}), [
		state
	])
	const mapData = useRef(false)
	useEffect(() => {
		mapData.current = !!miniMap && !!miniMap.show && !!miniMap.mapImage
	}, [state])
	useEffect(() => {
		eventBus.on("scene.map.show", setShowMap)
		eventBus.on("scene.show", () => {
			setShowMap(true)
		})
	}, [])
	return (
		<div id="MinMapUI" style={{ visibility: !mapData.current || !showMap ? "hidden" : "visible" }}>
			<MinMap />
		</div>
	)
}

const MinMap = () => {
	const maxScale = useMemo(() => 5, [])
	const loadEle = useMemo(() => <Spin size="large" />, [])
	const [imgData, setImgData] = useState({ width: 0, height: 0, sourceWidth: 0, sourceHeight: 0 })
	const [{ x, y, scale }, setState] = useSpring(() => ({
		scale: 1,
		x: 0,
		y: 0,
		config: {
			tension: 300
		}
	}))
	let countTime: NodeJS.Timeout
	const mapBox = useRef<HTMLDivElement>()
	const isMove = useRef(false)
	const dragTime = useRef(0)
	const lastVal = useRef([0, 0])
	const imgRef = useRef<HTMLImageElement>()
	const { state } = useContext(JMKContext)
	const miniMap: Partial<coverMinimap> = useMemo(() => (state.sceneCofing ? state.sceneCofing.info.minimap : {}), [
		state
	])
	const sceneBoxWH = useRef<{ width: number; height: number }>()
	const getBounds = useCallback(() => {
		if (mapBox.current) {
			const { width, height } = imgData
			const { offsetWidth: boxW, offsetHeight: boxH } = mapBox.current
			const imgW = width * scale.get()
			const imgH = height * scale.get()
			return imgW > boxW && imgH > boxH
				? {
						left: -(imgW - boxW) / 2 - x.get(),
						right: (imgW - boxW) / 2 - x.get(),
						top: -(imgH - boxH) / 2 - y.get(),
						bottom: (imgH - boxH) / 2 - y.get()
				  }
				: {
						left: (imgW - boxW) / 2 - x.get(),
						right: -(imgW - boxW) / 2 - x.get(),
						top: (imgH - boxH) / 2 - y.get(),
						bottom: -(imgH - boxH) / 2 - y.get()
				  }
		} else {
			return { left: 0, right: 0, top: 0, bottom: 0 }
		}
	}, [imgData])
	const singleTap: Handler<"hover"> = useCallback(
		e => {
			if (isMove.current || dragTime.current) return
			const cameraPos = state.editHook.getCameraPosition()
			const imgRect = imgRef.current.getBoundingClientRect()
			const sceneBox = state.editHook.getSceneBoundingBox()
			const { clientX, clientY } = e.event
			const leftPos = imgRect.width - (clientX - imgRect.x)
			const topPos = clientY - imgRect.y
			state.editHook.teleport.switchToPoint({
				x: sceneBox.max.x - (leftPos / imgRect.width) * sceneBoxWH.current.width,
				y: sceneBox.max.y - (topPos / imgRect.height) * sceneBoxWH.current.height,
				z: cameraPos[2]
			})
		},
		[countTime, state]
	)

	const doubleTap = useCallback(e => {
		if (scale.get() > 1) {
			const val = getPositionOnMoveOrScale(x.get(), y.get(), e.clientX, e.clientY, scale.get(), 1)
			setState(val)
			lastVal.current = [val.x, val.y]
		} else {
			setState({ scale: 2 })
		}
	}, [])
	const withDebounceTap = useCallback(
		(singleTap, doubleTap) => {
			let countClick = 0
			const debounceTap = debounce(e => {
				countClick = 0
				singleTap(e)
				isMove.current = false
			}, 300)
			return (e: any) => {
				e.event.preventDefault()
				countClick += 1
				debounceTap(e)
				if (countClick >= 2) {
					debounceTap.cancel()
					countClick = 0
					doubleTap(e)
					isMove.current = false
				}
			}
		},
		[state]
	)

	const getPositionOnMoveOrScale = useCallback(
		(
			x: number,
			y: number,
			clientX: number,
			clientY: number,
			fromScale: number,
			toScale: number,
			offsetX?: number,
			offsetY?: number
		) => {
			if (toScale <= 1) {
				return {
					x: 0,
					y: 0,
					scale: toScale
				}
			}
			const { width: innerWidth, height: innerHeight, left, top } = mapBox.current.getClientRects()[0]
			const centerClientX = innerWidth / 2 + left
			const centerClientY = innerHeight / 2 + top
			// 坐标偏移
			const lastPositionX = centerClientX + x
			const lastPositionY = centerClientY + y
			// 放大偏移量
			const offsetScale = toScale / fromScale
			// 偏移位置
			const originX = clientX - (clientX - lastPositionX) * offsetScale - centerClientX
			const originY = clientY - (clientY - lastPositionY) * offsetScale - centerClientY
			return {
				x: originX + (offsetX || 0),
				y: originY + (offsetY || 0),
				scale: toScale
			}
		},
		[]
	)
	const getImgSize = useCallback((sourceWidth: number, sourceHeight: number) => {
		let width: number
		let height: number
		const { offsetWidth: innerWidth, offsetHeight: innerHeight } = mapBox.current
		const autoWidth = (sourceWidth / sourceHeight) * innerHeight
		const autoHeight = (sourceHeight / sourceWidth) * innerWidth
		if (sourceWidth < innerWidth && sourceHeight < innerHeight) {
			width = sourceWidth
			height = sourceHeight
		} else if (sourceWidth < innerWidth && sourceHeight >= innerHeight) {
			width = autoWidth
			height = innerHeight
		} else if (sourceWidth >= innerWidth && sourceHeight < innerHeight) {
			width = innerWidth
			height = autoHeight
		} else if (sourceWidth / sourceHeight > innerWidth / innerHeight) {
			width = innerWidth
			height = autoHeight
		} else {
			width = autoWidth
			height = innerHeight
		}
		return {
			width: Math.floor(width),
			height: Math.floor(height)
		}
	}, [])

	const imgEvent = useGesture(
		{
			onContextMenu: e => {
				const { event } = e
				event.preventDefault()
			},
			onMouseDownCapture: withDebounceTap(singleTap, doubleTap),
			onDrag: e => {
				isMove.current = false
				const { movement, event, dragging, pinching } = e
				countTime = !countTime ? setInterval(() => dragTime.current++, 1) : countTime
				event.preventDefault()
				if (!pinching) {
					const [nx, ny] = movement
					const [ox, oy] = lastVal.current
					const x = ox + nx
					const y = oy + ny
					if (nx || ny) {
						isMove.current = true
					}
					setState({ x, y })
					if (!dragging) {
						clearInterval(countTime)
						countTime = null
						dragTime.current = 0
						lastVal.current = [x, y]
					}
				}
			},
			onWheel: e => {
				const { movement, wheeling, event } = e
				if (!wheeling) return
				const { sourceWidth, width } = imgData
				const [, deltaY] = movement
				const endScale = scale.get() - deltaY / 100 / 2
				// 限制最大倍数和最小倍数
				const toScale = Math.max(
					Math.min(endScale, Math.max(isString(maxScale) ? 50 : maxScale, sourceWidth / width)),
					1
				)
				const val = getPositionOnMoveOrScale(x.get(), y.get(), event.clientX, event.clientY, scale.get(), toScale)
				setState(val)
				setPoint(val.scale)
				lastVal.current = [val.x, val.y]
			}
		},
		{
			eventOptions: { passive: false },
			drag: {
				bounds: () => getBounds(),
				rubberband: true,
				filterTaps: true
			},
			pinch: {
				rubberband: true
			}
		}
	)

	const setPoint = useCallback(
		(inScale: number | object) => {
			const cameraPos = state.editHook.getCameraPosition()
			const rotation = -state.editHook.getCameraRotation()["yawDeg"]
			const boxScale = typeof inScale === "number" ? inScale : scale.get()
			const sceneBox = state.editHook.getSceneBoundingBox()
			if (!!pointRef.current) {
				pointRef.current.style.left = ((cameraPos["x"] - sceneBox.min.x) * 100) / sceneBoxWH.current.width + "%"
				pointRef.current.style.top = ((sceneBox.max.y - cameraPos["y"]) * 100) / sceneBoxWH.current.height + "%"
				pointRef.current.style.transform = `rotate(${rotation + 180}deg) scale(${1 / boxScale})`
			} else {
				console.log("要报错")
			}
			// pointRef.current.style.left = ((cameraPos["x"] - sceneBox.min.x) * 100) / sceneBoxWH.current.width + "%"
			// pointRef.current.style.top = ((sceneBox.max.y - cameraPos["y"]) * 100) / sceneBoxWH.current.height + "%"
			// pointRef.current.style.transform = `rotate(${rotation + 180}deg) scale(${1 / boxScale})`
		},
		[state, scale]
	)
	const imgLoad = useCallback(
		(e: Event) => {
			const imgEle = e.target as HTMLImageElement
			const { naturalWidth: sourceWidth, naturalHeight: sourceHeight } = imgEle
			setImgData({
				sourceWidth,
				sourceHeight,
				...getImgSize(sourceWidth, sourceHeight)
			})
			setPoint(1)
		},
		[state]
	)

	useEffect(() => {
		if (state.sceneCofing && miniMap.mapImage && !!state.jmt) {
			const sceneBox = state.editHook.getSceneBoundingBox()
			const [width, height] = [sceneBox.max.x - sceneBox.min.x, sceneBox.max.y - sceneBox.min.y]
			sceneBoxWH.current = { width, height }
			const loadImg = new Image()
			loadImg.onload = imgLoad
			loadImg.src = urlFunc.replaceUrl(miniMap.mapImage)
			state.editHook.getCamera().addEventListener("positionChanged", throttle(setPoint, 80))
			state.editHook.setCamaraPositionRotationChangedCallback(throttle(setPoint, 80))
		}
	}, [state])
	const pointRef = useRef<HTMLDivElement>()
	const getPreview = useCallback(
		item => (e: { stopPropagation: () => void }) => {
			e.stopPropagation()

			ModalCustom({
				content: PreviewMapModal,
				params: {}
			})
		},
		[]
	)
	return (
		<div className="map-box" ref={mapBox}>
			{!imgData.sourceWidth ? (
				loadEle
			) : (
				<animated.div
					className="map-view"
					{...imgEvent()}
					style={{
						x,
						y,
						scale,
						width: imgData.width,
						height: imgData.height
					}}
				>
					<img
						ref={imgRef}
						src={miniMap.mapImage && urlFunc.replaceUrl(miniMap.mapImage)}
						width={imgData.width}
						height={imgData.height}
					/>
					<div className="point" ref={pointRef}>
						<AntDesignOutlined />
					</div>
				</animated.div>
			)}
			<div className="preview" onClick={getPreview(miniMap.mapImage)}>
				<ZoomInOutlined />
			</div>
		</div>
	)
}

export default MinMapUI
