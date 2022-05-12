import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import React, { useContext, useEffect, useState } from "react"
import { JMKContext } from "../provider/jmk.context"
import "./scene.openVideo.less"
interface Props {
	zIndex?: number
}
const SceneShuttleVideo: React.FC<Props> = props => {
	const { zIndex = 0 } = props
	const { state } = useContext(JMKContext)
	const [show, setShow] = useState(false)
	const [videoUrl, setVideoUrl] = useState(null)
	useEffect(() => {
		eventBus.on("scene.view.shuttleVideo", val => setShow(val))
		return () => {
			eventBus.off("scene.view.shuttleVideo")
		}
	}, [])
	useEffect(() => {
		eventBus.on("scene.view.shuttleVideoUrl", val => setVideoUrl(val))
		return () => {
			eventBus.off("scene.view.shuttleVideoUrl")
		}
	}, [])
	return (
		!!show &&
		videoUrl && (
			<div
				id="shuttleVideo"
				style={{
					zIndex
				}}
			>
				<video src={videoUrl} muted autoPlay={true} loop={true} preload="auto">
					您的浏览器不支持 video 标签。
				</video>
			</div>
		)
	)
}
export default SceneShuttleVideo
