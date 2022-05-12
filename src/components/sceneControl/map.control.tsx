import eventBus from "@/utils/event.bus"
import { Tooltip } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"

const MapControl = () => {
	const [play, setPlay] = useState(false)
	const [show, setShow] = useState(false)
	const Intl = useIntl()
	const { state } = useContext(JMKContext)
	const changeStatus = useCallback(() => {
		setPlay(!play)
		eventBus.emit("scene.map.show", !play)
	}, [play])
	useEffect(() => {
		if (state.sceneCofing?.info.minimap.show && state.sceneCofing?.info.minimap.mapImage) {
			setShow(true), setPlay(true)
		}
	}, [state])

	return (
		<div className={classNames("control-item", { on: play })} hidden={!show} onClick={changeStatus}>
			<Tooltip
				title={Intl.formatMessage({
					id: "scene.map.btn",
					defaultMessage: "小地图"
				})}
			>
				<i className={classNames("rulefont", "rule-map", "iconcolor")} />
			</Tooltip>
		</div>
	)
}
export default MapControl
