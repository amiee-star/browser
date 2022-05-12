import urlFunc from "@/utils/url.func"
import React, { useEffect, useRef } from "react"
import RingSDK from "./ring.sdk"
import "./ring.slide.util.less"
interface ModelItem {
	fileType: number
	path: string
	picId: string
	modelFile: string
}

interface Props {
	modelList: ModelItem[]
}

const RingSlideUtil: React.FC<Props> = props => {
	const eleDiv = useRef<HTMLDivElement>()
	const ringSDK = useRef<RingSDK>()
	const { modelList } = props
	useEffect(() => {
		if (modelList.length) {
			ringSDK.current = new RingSDK({
				el: eleDiv.current,
				pic: urlFunc.replaceUrl(modelList[0].modelFile)
			})
		}
	}, [modelList])
	useEffect(() => {
		return () => {
			ringSDK.current.destroy()
		}
	}, [])
	return <div className="full" ref={eleDiv} id="RingSlideUtil"></div>
}

export default RingSlideUtil
