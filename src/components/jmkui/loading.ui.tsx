import eventBus from "@/utils/event.bus"
import { Progress } from "antd"
import React, { useEffect, useState } from "react"
import Grow from "../transitions/grow"
const LoadingUI: React.FC = () => {
	const [percent, setPercent] = useState(0)
	useEffect(() => {
		eventBus.on("jmk.loading", n => {
			setPercent(Math.floor(n * 100))
		})
	}, [])
	return (
		<div
			style={{
				display: "inline-flex",
				transform: "translate(-50%,-50%)"
			}}
		>
			<Grow in={percent < 100} unmountOnExit>
				<div>
					<Progress
						type="circle"
						strokeColor={{
							"0%": "#108ee9",
							"100%": "#87d068"
						}}
						percent={percent}
					/>
				</div>
			</Grow>
		</div>
	)
}
export default LoadingUI
