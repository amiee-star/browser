import eventBus from "@/utils/event.bus"
import { Tooltip } from "antd"
import classNames from "classnames"
import React, { useCallback, useState } from "react"

const TextControl = () => {
	const [enable, setEnable] = useState(false)
	const changeStatus = useCallback(() => {
		setEnable(!enable)
		if (!enable) {
			eventBus.emit("scene.text.play", {
				muisc: `${window.publicPath}test/t-audio.mp3`,
				word: [
					"习主席语录：长征走的是高山峻岭，渡的是大河险滩，过的是草地荒原，但每一个行程、每一次突围、\n每一场战斗都从战略全局出发，既赢得了战争胜利，也赢得了战略主动。这既是一种精神，也是一种智慧。习主席语录：长征走的是高山峻岭，渡的是大河险滩，过的是草地荒原，但每一个行程、每一次突围、\n每一场战斗都从战略全局出发，既赢得了战争胜利，也赢得了战略主动。这既是一种精神，也是一种智慧。"
				],
				pic: `${window.publicPath}test/t-pic.gif`
			})
		} else {
			eventBus.emit("scene.text.stop")
		}
	}, [enable])

	return (
		<>
			{/* // <div className={classNames("control-item", { on: enable })} onClick={changeStatus}>
		// 	<Tooltip title="打字机" trigger={["hover", "focus"]}>
		// 		{!enable ? "开" : "关"}
		// 	</Tooltip>
		// </div> */}
		</>
	)
}
export default TextControl
