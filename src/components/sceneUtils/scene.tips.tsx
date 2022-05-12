import eventBus from "@/utils/event.bus"
import lsFunc from "@/utils/ls.func"
import React, { useEffect, useState } from "react"
import { ModalCustom } from "../modal/modal.context"
import TipsModal from "../modal/sceneview/tips.modal"
import "./scene.verification.less"
const SceneTips = () => {
	const [show, setShow] = useState<Boolean>(false)

	useEffect(() => {
		eventBus.on("showcase.show", () => {
			if (!lsFunc.getItem("todayTime")) {
				setShow(true)
				let timestamp = new Date().getTime()
				lsFunc.setItem("todayTime", timestamp)
			}
		})
	}, [])

	useEffect(() => {
		if (show) {
			ModalCustom({
				content: TipsModal
			})
		}
	}, [show])
	return <></>
}
export default SceneTips
