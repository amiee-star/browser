import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import "./right.menus.less"
import OutLinePanel from "./material/outLine/outLine.edit.panel"
import PositionPanel from "./material/position/position.edit.panel"
import { FormattedMessage } from "umi"
import { Space } from "antd"
import Grow from "../transitions/grow"
import { JMKContext } from "../provider/jmk.context"
import classNames from "classnames"
import eventBus from "@/utils/event.bus"
import serviceLocal from "@/services/service.local"

const RightMenus: React.FC = () => {
	const { state } = useContext(JMKContext)
	const [show, setShow] = useState("")
	const [showMenus, setShowMenus] = useState(false)
	const [hasPosition, setHasPosition] = useState(false)
	// 获取展厅定位数据
	useEffect(() => {
		// serviceLocal.getExhibitPosition(state.sceneName, "").then(res => {
		// 	if (res.code == "200") {
		// 		res.data.length >= 1 ? setHasPosition(true) : setHasPosition(false)
		// 	}
		// })
	}, [])
	const btnList = useMemo(
		() => ({
			material: [
				{
					key: "outLine",
					name: <FormattedMessage id="scene.navigation" />,
					group: "main",
					icon: "rulefont rule-shiliangtubiao_6",
					show: state.sceneCofing.info.outline.show
					//&& !!state.sceneCofing.info.usePwd
				},
				{
					key: "position",
					name: <FormattedMessage id="scene.exhibits.position" />,
					group: "main",
					icon: "rulefont rule-sousuo",
					show: hasPosition
				}
			]
		}),
		[hasPosition]
	)
	useEffect(() => {
		setShow(show)
	}, [show])
	const [done, setDone] = useState(false)
	const itemClick = useCallback(
		(key: string) => () => {
			console.log(key)
			setShow(key)
			setDone(true)
		},
		[show]
	)
	const closePanel = useCallback(() => {
		console.log("关闭")
		setShow("")
	}, [])
	useEffect(() => {
		eventBus.on("scene.show", () => {
			setShowMenus(true)
		})
	}, [])
	useEffect(() => {
		eventBus.on("scene.position.trigger", e => {
			setDone(true)
			setShow("position")
		})
		return () => {
			eventBus.off("scene.position.trigger")
		}
	}, [])
	// useEffect(() => {
	// 	eventBus.on("scene.position.triggerNext", e => {
	// 		setDone(true)
	// 		setShow("position")
	// 	})
	// 	return () => {
	// 		eventBus.off("scene.position.triggerNext")
	// 	}
	// }, [])
	// useEffect(() => {
	// 	eventBus.on("scene.position.triggerBack", e => {
	// 		setDone(true)
	// 		setShow("position")
	// 	})
	// 	return () => {
	// 		eventBus.off("scene.position.triggerBack")
	// 	}
	// }, [])
	return (
		<div hidden={!!showMenus ? false : true}>
			<div className="full" id="RightMenus">
				<div
					className="main-btn"
					style={state.sceneCofing.info.outline.show || hasPosition ? { display: "block" } : { display: "none" }}
				>
					<Space direction="vertical" size="large">
						{btnList["material"]
							.filter(m => m.group === "main")
							.map(m => {
								return (
									<Grow in key={m.key}>
										<div
											onClick={itemClick(m.key)}
											className="rightBtn"
											style={m.show ? { display: "block" } : { display: "none" }}
										>
											<i className={classNames(m.icon)}></i>
										</div>
									</Grow>
								)
							})}
					</Space>
				</div>
				{!!done && (
					<>
						<Grow in={show == "outLine"} style={{ position: "absolute", right: 0, top: 0 }} unmountOnExit>
							<OutLinePanel closePanel={closePanel}></OutLinePanel>
						</Grow>
						<Grow in={show == "position"} style={{ position: "absolute", right: 0, top: 0 }}>
							<PositionPanel closePanel={closePanel}></PositionPanel>
						</Grow>
					</>
				)}
			</div>
		</div>
	)
}

export default RightMenus
