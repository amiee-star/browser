import eventBus from "@/utils/event.bus"

import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"
import Grow from "../transitions/grow"
import PositionPanel from "../panel/material/position/position.edit.panel"
import serviceLocal from "@/services/service.local"

const MobilePositioneControl = () => {
	const [play, setPlay] = useState(false)
	const Intl = useIntl()
	const { state: JMK } = useContext(JMKContext)

	const changeStatus = useCallback(() => {
		setPlay(!play)
		if (!play) {
			eventBus.emit("scene.positions.show")
		} else {
			// 切换展品按钮
			eventBus.emit("scene.positions.hide1")
		}
	}, [JMK, play])
	const [hasPosition, setHasPosition] = useState(false)
	const [done, setDone] = useState(false)
	// 获取展厅定位数据
	useEffect(() => {
		// serviceLocal.getExhibitPosition(JMK.sceneName, "").then(res => {
		// 	if (res.code == "200") {
		// 		setDone(true)
		// 		res.data.length >= 1 ? setHasPosition(true) : setHasPosition(false)
		// 	}
		// })
	}, [])
	// 展品面板的关闭按钮
	useEffect(() => {
		eventBus.on("scene.positions.hide", () => {
			setPlay(false)
		})
		return () => {
			eventBus.off("scene.positions.hide")
		}
	}, [])
	return (
		<>
			{done && (
				<>
					<div className={classNames("control-item-mobile", { on: play })} hidden={!hasPosition} onClick={changeStatus}>
						<img
							className={"item-img-mobile"}
							src={
								!!play
									? require("../../assets/mobile-font/zhanping(2).png")
									: require("../../assets/mobile-font/zhanping.png")
							}
						></img>
						<div>展品</div>
					</div>
					{/* <Grow in={play} style={{ position: "absolute", right: 0, top: 0 }} unmountOnExit>
						<PositionPanel closePanel={closePanel}></PositionPanel>
					</Grow> */}
				</>
			)}
		</>
	)
}
export default MobilePositioneControl
