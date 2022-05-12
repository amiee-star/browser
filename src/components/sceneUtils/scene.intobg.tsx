import commonFunc from "@/utils/common.func"
import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { JMKContext } from "../provider/jmk.context"
import "./scene.intobg.less"

interface Props {
	zIndex?: number
}

const SceneIntoBg: React.FC<Props> = props => {
	const mobile = commonFunc.browser().mobile
	const { zIndex = 0 } = props
	const [show, setShow] = useState(true)
	const [imgLoad, setImgLoad] = useState(false)
	const [useBg, setUseBg] = useState(false)
	const { state } = useContext(JMKContext)
	const imgSrc = useMemo(() => {
		if (state.sceneCofing) {
			console.log(state.sceneCofing.info)
			let url = ""
			if (!!mobile) {
				url = state.sceneCofing.info.mobileThumb || ""
			} else {
				url = state.sceneCofing.info.thumb || ""
			}
			// const url = state.sceneCofing.info.thumb || ""
			return url ? urlFunc.replaceUrl(url) : ""
		} else {
			return ""
		}
	}, [state])
	useEffect(() => {
		if (!state.sceneCofing?.info.startCamera && state.sceneCofing?.info.useThumbLoading && !!imgSrc && imgLoad) {
			setUseBg(true)
		}
	}, [state, imgLoad])
	useEffect(() => {
		if (show) {
			const imgData = new Image()
			imgData.onload = () => setImgLoad(true)
			imgData.src = imgSrc
		}
	}, [show])
	useEffect(() => {
		eventBus.on("scene.show", () => {
			setShow(false)
		})
	}, [])
	return (
		!!show && (
			<div
				id="SceneIntoBg"
				className="full"
				style={{
					background: useBg ? `url(${imgSrc})` : "transparent",
					backgroundSize: useBg ? "100% 100%" : "0",
					zIndex
				}}
			/>
		)
	)
}

export default SceneIntoBg
