import eventBus from "@/utils/event.bus"
import React, { useContext, useEffect, useState } from "react"
import { InfoContext } from "../provider/info.context"
import "./scene.intovideo.less"
interface Props {
	zIndex?: number
}
const SceneIntoVideo: React.FC<Props> = props => {
	const { zIndex = 0 } = props
	const [show, setShow] = useState(false)
	const { state } = useContext(InfoContext)
	useEffect(() => {
		if (
			!!state.data.showDescFlag &&
			!!state.data.loadingVideo
		) {
			if (state.data?.durationEndTs && state.data?.durationEndTs - new Date().getTime() <= 0) {
				setShow(false)
			} else {
				setShow(true)
			}
		}
	}, [state])
	useEffect(() => {
		eventBus.on("showcase.show", () => setShow(false))
		return () => {
			eventBus.off("showcase.show")
		}
	}, [])
	return (
		!!show && (
			<div
				id="SceneIntoVideo"
				className="full"
				style={{
					zIndex
				}}
			>
				<p>{state.data?.title}</p>
				<video
					preload="auto"
					controls
					autoPlay
					disablePictureInPicture
					disableRemotePlayback
					src={state.data?.loadingVideo}
				/>
			</div>
		)
	)
}

export default SceneIntoVideo
