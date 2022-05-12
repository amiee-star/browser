import commonFunc from "@/utils/common.func"
import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { InfoContext } from "../provider/info.context"
import THREEImage from "../utils/three.image"
import "./scene.into3d.less"
interface Props {
	zIndex?: number
}
const SceneInto3D: React.FC<Props> = props => {
	const { zIndex = 0 } = props
	const [show, setShow] = useState(false)
	const { state } = useContext(InfoContext)
	const mobile = commonFunc.browser().mobile
	const initFiles = useMemo(
		() => [
			"512_face2_0_0.jpg",
			"512_face4_0_0.jpg",
			"512_face0_0_0.jpg",
			"512_face5_0_0.jpg",
			"512_face1_0_0.jpg",
			"512_face3_0_0.jpg"
		],
		[]
	)
	const imgPath = useMemo(() => {
		if (!!show && state.data) {
			let imgId = ""
			if (state.data.renderOver == true) {
				imgId = state.data.tempId
			} else {
				imgId = state.data.sceneId
			}
			return urlFunc.getHost("fileHost") + `/scenes/${imgId}/tiles/${state.data.startCamera}/`
		}
	}, [show, state])
	useEffect(() => {
		if (
			!!state.data?.startCamera &&
			!state.data?.useThumbLoading &&
			!mobile
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
				id="SceneInto3D"
				className="full"
				style={{
					zIndex
				}}
			>
				<THREEImage files={initFiles} path={imgPath} />
			</div>
		)
	)
}

export default SceneInto3D
