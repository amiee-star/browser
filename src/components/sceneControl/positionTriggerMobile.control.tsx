import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import { Divider, Tooltip } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"

const PositionMobileTrigger = () => {
	const Intl = useIntl()
	const { state, dispatch } = useContext(JMKContext)
	// 上一个点位
	const handleLast = useCallback(() => {
		eventBus.emit("scene.position.trigger", -1)
	}, [])
	// 下一个点位
	const handleNext = useCallback(() => {
		eventBus.emit("scene.position.trigger", 1)
	}, [])
	const [hasBack, setHasBack] = useState(false)
	//监听点位
	useEffect(() => {
		eventBus.on("scene.position.0", e => {
			setHasBack(false)
		})
		return () => {
			eventBus.off("scene.position.0")
		}
	}, [])
	const [hasNext, sethasNext] = useState(true)
	useEffect(() => {
		eventBus.on("scene.position.last", e => {
			sethasNext(false)
		})
		return () => {
			eventBus.off("scene.position.last")
		}
	}, [])
	useEffect(() => {
		eventBus.on("scene.position.show", e => {
			sethasNext(true)
			setHasBack(true)
		})
		return () => {
			eventBus.off("scene.position.show")
		}
	}, [])
	return (
		<>
			<div
				className={classNames("control-item-mobile")}
				hidden={!state.sceneCofing?.info.spotSwitchBtn.show}
				style={!hasBack ? { display: "none" } : {}}
				onClick={handleLast}
			>
				{/* <Tooltip
					title={Intl.formatMessage({
						id: "scene.back.btn",
						defaultMessage: "上一个点位"
					})}
					trigger={["hover", "focus", "click", "contextMenu"]}
				>
					<i className={"iconfont icon-shangyibu"}></i>
				</Tooltip> */}
				<img className={"item-img-mobile"} src={require("../../assets/mobile-font/qianjin.png")}></img>
				<div>前点</div>
			</div>

			<div
				className={classNames("control-item-mobile")}
				hidden={!state.sceneCofing?.info.spotSwitchBtn.show}
				onClick={handleNext}
				style={!hasNext ? { display: "none" } : {}}
			>
				{/* <Tooltip
					title={Intl.formatMessage({
						id: "scene.go.btn",
						defaultMessage: "下一个点位"
					})}
					trigger={["hover", "focus", "click", "contextMenu"]}
				>
					<i className={"iconfont icon-xiayibu"}></i>
				</Tooltip> */}
				<img className={"item-img-mobile"} src={require("../../assets/mobile-font/houtui.png")}></img>
				<div>后点</div>
			</div>
		</>
	)
}
export default PositionMobileTrigger
