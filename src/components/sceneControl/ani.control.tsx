import serviceLocal from "@/services/service.local"
import eventBus from "@/utils/event.bus"
import { Popover } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"

const AniControl = () => {
	const { state } = useContext(JMKContext)
	const [animateList, setAnimateList] = useState([])
	useEffect(() => {
		if (state.editHook) {
			// serviceLocal.animation(state.sceneName).then(res => {
			// 	setAnimateList(res.data)
			// 	state.editHook.loadAnimations(res.data)
			// })
		}
	}, [state])

	useEffect(() => {
		eventBus.on("scene.show", () => {
			if (animateList && state.editHook) {
				animateList.forEach(item => {
					// state.editHook.animationPlayById(item.channels[0].target.node, 2201)
				})
			}
		})
	}, [state, animateList])

	return <></>
}
export default AniControl
