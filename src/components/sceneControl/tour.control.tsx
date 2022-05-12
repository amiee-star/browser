import React, { useCallback, useContext, useEffect, useState } from "react"
import classNames from "classnames"
import eventBus from "@/utils/event.bus"
import { MpSdkContext } from "../provider/mpsdk.context"
const TourControl = () => {
	const [open, setOpen] = useState(false)
	const [show, setShow] = useState(false)
	const { state } = useContext(MpSdkContext)
	const changeStatus = useCallback(() => setOpen(!open), [open])
	useEffect(() => {
		state.mpSdk?.Tour.getData().then(res => {
			!!res.length && setShow(true)
		})
	}, [state.mpSdk])
	useEffect(() => {
		eventBus.emit(open ? "scene.tour.open" : "scene.tour.close")
	}, [open])
	useEffect(() => {
		eventBus.on("scene.tour.play", () => setOpen(false))
		eventBus.on("scene.tour.pause", () => setOpen(true))
		return () => {
			eventBus.off("scene.tour.play").off("scene.tour.pause")
		}
	}, [])
	return (
		<div className={classNames("control-item", { on: open })} hidden={!show} onClick={changeStatus}>
			<i className={classNames("rulefont", { "rule-up": open, "rule-down": !open })} />
		</div>
	)
}
export default TourControl
