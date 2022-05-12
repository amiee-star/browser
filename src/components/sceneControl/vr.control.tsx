import { Tooltip } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"

const VRControl = () => {
	const [enable, setEnable] = useState(false)
	const [show, setShow] = useState(false)
	const Intl = useIntl()
	const { state: JMK } = useContext(JMKContext)

	const changeStatus = useCallback(() => {
		JMK.app.onVRClick()
		setEnable(!enable)
	}, [JMK, enable])

	useEffect(() => {
		JMK.app?.vrMgr?.vrSupport() ? setShow(true) : setShow(false)
	}, [JMK.app, show, enable])

	return (
		<div className={classNames("control-item", { on: enable })} hidden={!show} onClick={changeStatus}>
			<Tooltip title="VR" trigger={["hover", "focus"]}>
				<img src={!enable ? require("@/assets/image/vr_disable.png") : require("@/assets/image/vr_enable.png")}></img>
			</Tooltip>
		</div>
	)
}
export default VRControl
