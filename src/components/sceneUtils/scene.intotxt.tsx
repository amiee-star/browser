import eventBus from "@/utils/event.bus"
import { Typography } from "antd"
import React, { useContext, useEffect, useState } from "react"
import { JMKContext } from "../provider/jmk.context"
import "./scene.intotxt.less"
interface Props {
	zIndex?: number
}

const SceneIntoTxt: React.FC<Props> = props => {
	const { zIndex = 0 } = props
	const [show, setShow] = useState(false)
	const { state } = useContext(JMKContext)
	useEffect(() => {
		if (state.sceneCofing?.info.descFlag&&!location.href.includes("#autoplay")) {
			setShow(true)
		}
	}, [state])
	useEffect(() => {
		eventBus.on("scene.show", () => setShow(false))
	}, [])
	return (
		!!show && (
			<div
				id="SceneIntoTxt"
				style={{
					zIndex
				}}
			>
				<div className="info">
					<Typography.Title className="title" level={2}>
						{state.sceneCofing?.info.name}
					</Typography.Title>
					<Typography.Text className="desc" type="secondary">
						{state.sceneCofing?.info.description}
					</Typography.Text>
				</div>
			</div>
		)
	)
}

export default SceneIntoTxt
