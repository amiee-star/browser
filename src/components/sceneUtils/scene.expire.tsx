import eventBus from "@/utils/event.bus"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { ModalCustom } from "../modal/modal.context"
import ExpireModal from "../modal/sceneview/expire.modal"
import { InfoContext } from "../provider/info.context"

const SceneExpire = () => {
	const [expire, setExpire] = useState(0)
	const { state } = useContext(InfoContext)
	const sceneCheck = useCallback(() => {
		if (!!state.data?.durationEndTs) {
			const expireTime = state.data.durationEndTs - new Date().getTime()
			if (expireTime <= 1296000000) {
				setExpire(expireTime)
			}
		}
	}, [state.data])
	useEffect(() => {
		eventBus.on("showcase.show", sceneCheck)
	}, [])
	useEffect(() => {
		if (!!expire) {
			ModalCustom({
				content: ExpireModal,
				params: {
					expire
				}
			})
		}
	}, [expire])
	return <></>
}
export default SceneExpire
