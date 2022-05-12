import React, { useCallback, useContext, useEffect, useState } from "react"
import classNames from "classnames"
import eventBus from "@/utils/event.bus"
import { JMKContext } from "../provider/jmk.context"
import { Tooltip } from "antd"
import { useIntl } from "umi"
// import { MpSdkContext } from "../provider/mpsdk.context"
const TourControl = () => {
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
		<div className={classNames("control-item", { on: open })} hidden={false} onClick={changeStatus}>
			<Tooltip
				title={Intl.formatMessage({
					id: "scene.tour.showTourSlide",
					defaultMessage: "自动导览"
				})}
			>
				<i
					className={
						open
							? classNames("rulefont", "rule-liebiao", "iconcolor")
							: classNames("rulefont", "rule-liebiao", "iconcolor")
					}
				/>
			</Tooltip>
		</div>
	)
}
export default TourControl
