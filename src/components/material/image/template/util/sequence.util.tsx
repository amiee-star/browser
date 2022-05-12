import urlFunc from "@/utils/url.func"

import React, { useCallback, useEffect, useRef, useState } from "react"
import "./sequence.util.less"
interface Props {
	imgList: ImageItem[]
	delay: {
		delay: number[]
		ext?: any
		w?: number
		h?: number
	}
}
interface ImageItem {
	fileType: number
	path: string
	picId: string
}
interface progressWH {
	width: number
	height: number
}
const SequenceUtil: React.FC<Props> = props => {
	const { imgList, delay = { delay: new Array(15).fill(50), w: 0, h: 0 } } = props
	const { path } = imgList[0]
	const { delay: delayTime, w, h } = delay
	const initScale = useRef(1)
	const [loading, setLoading] = useState(true)
	const imgEle = useRef<HTMLImageElement>()
	const canvasEle = useRef<HTMLCanvasElement>()
	const canvasContext = useRef<CanvasRenderingContext2D>()
	const boxEle = useRef<HTMLDivElement>()
	const direction = useRef("x")
	useEffect(() => {
		imgEle.current = document.createElement("img")
		imgEle.current.onload = e => {
			setLoading(false)
		}
		imgEle.current.src = urlFunc.replaceUrl(path, "fileHost")
	}, [])
	useEffect(() => {
		if (!loading) {
			initCanvas()
		}
	}, [loading])
	const initCanvas = useCallback(() => {
		const { naturalWidth, naturalHeight } = imgEle.current
		direction.current = naturalWidth / naturalHeight > 1 ? "x" : "y"
		const xScale = direction.current === "x" ? 1 / delayTime.length : 1
		const yScale = direction.current === "y" ? 1 / delayTime.length : 1
		const params = getImgSize(naturalWidth * xScale * initScale.current, naturalHeight * yScale * initScale.current)
		canvasEle.current.width = w || params.width
		canvasEle.current.height = h || params.height
		canvasContext.current = canvasEle.current.getContext("2d")
		progressImg(params)
		renderImg(params)
	}, [delayTime, w, h])
	const playIn = useRef<number>(0)
	const TimeOut = useRef<NodeJS.Timeout>()
	const progressImg = useCallback(
		(params: progressWH) => {
			canvasContext.current.clearRect(0, 0, params.width, params.height)
			canvasContext.current.drawImage(
				imgEle.current,
				direction.current === "x" ? -params.width * (playIn.current % delayTime.length) : 0,
				direction.current === "y" ? -params.height * (playIn.current % delayTime.length) : 0,
				imgEle.current.naturalWidth * initScale.current,
				imgEle.current.naturalHeight * initScale.current
			)
		},
		[delayTime, direction]
	)
	const renderImg = useCallback(
		(params: progressWH) => {
			TimeOut.current = setTimeout(() => {
				progressImg(params)
				renderImg(params)
			}, delayTime[playIn.current++ % delayTime.length])
		},
		[delayTime]
	)
	const getImgSize = useCallback((sourceWidth: number, sourceHeight: number) => {
		let width: number
		let height: number
		const { offsetWidth: innerWidth, offsetHeight: innerHeight } = boxEle.current
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
			width,
			height
		}
	}, [])
	useEffect(() => {
		return () => {
			clearTimeout(TimeOut.current)
		}
	}, [])
	return (
		<div id="SequenceUtil" className="full" ref={boxEle} style={{}}>
			<canvas ref={canvasEle} />
		</div>
	)
}

export default SequenceUtil
