import eventBus from "@/utils/event.bus"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"

const MobileLiuyanControl = () => {
	const [play, setPlay] = useState(false)
	const Intl = useIntl()
	const { state: JMK } = useContext(JMKContext)

	const changeStatus = useCallback(() => {
		setPlay(!play)
		if (!play) {
			eventBus.emit("scene.liuyan.show")
		} else {
			eventBus.emit("scene.liuyan.hide")
		}
	}, [JMK, play])

	const [show, setShow] = useState(false)
	useEffect(() => {
		eventBus.on("scene.show", () => {
			setShow(JMK.sceneCofing.info.isMessage)
		})
		return () => {
			// eventBus.off("scene.show")
		}
	}, [JMK])
	return (
		<>
			<div className={classNames("control-item-mobile", { on: play })} hidden={!show} onClick={changeStatus}>
				<img
					src={
						!!play
							? require("../../assets/mobile-font/liuyan(2).png")
							: require("../../assets/mobile-font/liuyan(7).png")
					}
					className={"item-img-mobile"}
				></img>
				<div>留言</div>
			</div>
		</>
	)
}
export default MobileLiuyanControl
