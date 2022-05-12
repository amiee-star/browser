import eventBus from "@/utils/event.bus"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"

const MobileDanmuControl = () => {
	const [play, setPlay] = useState(false)
	const Intl = useIntl()
	const { state: JMK } = useContext(JMKContext)

	const changeStatus = useCallback(() => {
		// eventBus.emit("scene.danmu.show")
		setPlay(!play)
		if (!play) {
			eventBus.emit("scene.danmu.show")
		} else {
			eventBus.emit("scene.danmu.hide")
		}
	}, [JMK, play])

	const [show, setShow] = useState(false)
	useEffect(() => {
		eventBus.on("scene.show", () => {
			setShow(JMK.sceneCofing.info.danmu)
		})
		return () => {
			// eventBus.off("scene.show")
		}
	}, [JMK])
	return (
		<>
			<div className={classNames("control-item-mobile", { on: play })} hidden={!show} onClick={changeStatus}>
				<img
					className={"item-img-mobile"}
					src={!!play ? require("../../assets/mobile-font/danmu2.png") : require("../../assets/mobile-font/danmu.png")}
				></img>
				<div>弹幕</div>
			</div>
		</>
	)
}
export default MobileDanmuControl
