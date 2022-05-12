import eventBus from "@/utils/event.bus"
import { Tooltip } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"
import Grow from "../transitions/grow"
import OutLinePanel from "../panel/material/outLine/outLine.edit.panel"

const MobileOutLineControl = () => {
	const [play, setPlay] = useState(false)
	const Intl = useIntl()
	const { state: JMK } = useContext(JMKContext)
	const [show, setShow] = useState(false)
	useEffect(() => {
		eventBus.on("scene.show", () => {
			setShow(JMK.sceneCofing.info.outline.show)
		})
		return () => {}
	}, [JMK])
	const changeStatus = useCallback(() => {
		setPlay(!play)
		if (!play) {
			eventBus.emit("scene.outLine.show")
		} else {
			eventBus.emit("scene.outLine.hide1")
		}
	}, [JMK, play])

	useEffect(() => {
		eventBus.on("scene.outLine.hide", () => {
			setPlay(false)
		})
		return () => {
			eventBus.off("scene.outLine.hide")
		}
	}, [])
	return (
		<>
			<div className={classNames("control-item-mobile", { on: play })} hidden={!show} onClick={changeStatus}>
				<img
					className={"item-img-mobile"}
					src={
						!!play
							? require("../../assets/mobile-font/danghang(2).png")
							: require("../../assets/mobile-font/daohang.png")
					}
				></img>
				<div>导航</div>
			</div>
			{/* <Grow in={play} unmountOnExit>
				<OutLinePanel closePanel={closePanel}></OutLinePanel>
			</Grow> */}
		</>
	)
}
export default MobileOutLineControl
