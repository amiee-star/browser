import React, { useCallback, useContext, useEffect, useState } from "react"
import classNames from "classnames"
import eventBus from "@/utils/event.bus"
import { JMKContext } from "../provider/jmk.context"
import { Tooltip } from "antd"
import { useIntl } from "umi"
// import { MpSdkContext } from "../provider/mpsdk.context"
const TourMobileControl = () => {
	const [open, setOpen] = useState(false)
	const [show, setShow] = useState(false)
	const Intl = useIntl()
	const { state: JMK } = useContext(JMKContext)
	const changeStatus = useCallback(() => setOpen(!open), [open])
	useEffect(() => {
		JMK.editHook?.getTours() ? setShow(true) : setShow(false)
	}, [JMK])
	useEffect(() => {
		eventBus.emit(open ? "scene.tour.show" : "scene.tour.hidden")
	}, [open])

	return (
		<div className={classNames("control-item-mobile", { on: open })} hidden={false} onClick={changeStatus}>
			<img
				src={
					!!open ? require("../../assets/mobile-font/daolan(2).png") : require("../../assets/mobile-font/daolan.png")
				}
				className={"item-img-mobile"}
			></img>
			<div>导览</div>
		</div>
	)
}
export default TourMobileControl
