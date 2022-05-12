import eventBus from "@/utils/event.bus"
import { Badge, Button, Divider, Popover, Space, Tooltip } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import TourUI from "../jmkui/tour.ui"
import DanmuMobileUI from "../jmkui/danmuMobile.ui"
import { JMKContext } from "../provider/jmk.context"
import AniControl from "../sceneControl/ani.control"
import MapControl from "../sceneControl/map.control"
import MusicControl from "../sceneControl/music.control"
import TourControl from "../sceneControl/tourplay.control"
import VirtualControl from "../sceneControl/virtual.control"
import TourSlideControl from "../sceneControl/tourSlide.control"
import VisualangleControl from "../sceneControl/visualangle.control"
// import VRControl from "../sceneControl/vr.control"
import PositionControl from "../sceneControl/position.control"
import ShareControl from "../sceneControl/share.control"
import GoodControl from "../sceneControl/good.control"
import Newessagecontrol from "../sceneControl/newmessage.control"

import Slide from "../transitions/slide"
import "./scene.control.less"
import TextControl from "../sceneControl/text.control"
import { useIntl } from "umi"
import { LinkOutlined } from "@ant-design/icons"
import serviceLocal from "@/services/service.local"
import { ModalCustom } from "../modal/modal.context"
import ViewerModal from "../modal/sceneView/viewer.modal"
import commonFunc from "@/utils/common.func"

import RightMenus from "@/components/panel/right.menus"
import MobilePositioneControl from "../sceneControl/positionMobile.control"
import MobileOutLineControl from "../sceneControl/outLineMobile.control"
import MobileDanmuControl from "../sceneControl/danmuMobile.control"
import MobileLiuyanControl from "../sceneControl/liuyanMobile.control"
import MobileDianzanControl from "../sceneControl/dianzanMobile.control"
import MobileCustomButtonControl from "../sceneControl/customButtonMobile.control"
import MobilepositionTriggerControl from "../sceneControl/positionTriggerMobile.control"
import TourSlideMobileControl from "../sceneControl/tourSlideMobile.control"
import TourplayMobileControl from "../sceneControl/tourplayMobile.control"
import VisualangMobileControl from "../sceneControl/visualangleMobile.control"

import OutLinePanel from "../panel/material/outLine/outLine.edit.panel"
import PositionPanel from "../panel/material/position/position.edit.panel"

// import Messagecontrol from "../sceneControl/message.control"
import Grow from "../transitions/grow"

const SceneControl = () => {
	const mobile = commonFunc.browser().mobile
	const Intl = useIntl()
	const { state } = useContext(JMKContext)

	const [show, setShow] = useState(false)
	const controls = useMemo(() => {
		return [
			{
				context: <TourSlideControl />
			},
			{
				context: <TourControl />
			},
			{
				context: <VisualangleControl />
			},
			{
				context: <MapControl />
			},
			{
				context: <VirtualControl />
			},
			{
				context: <MusicControl />
			},
			{
				context: <AniControl />
			},
			// {
			// 	context: <RuleControl />
			// }
			// {
			// 	context: <VRControl />
			// },
			{
				context: <TextControl />
			},
			{
				context: <PositionControl />
			},
			{
				context: <ShareControl />
			},
			{
				context: <GoodControl />
			},
			{
				context: <Newessagecontrol />
			}
		]
	}, [state])

	const maxShow = useMemo(() => controls.length, [])

	useEffect(() => {
		eventBus.on("scene.show", () => setShow(true))
	}, [])
	// 自动导览时隐藏控制按钮
	useEffect(() => {
		// eventBus.on("scene.controlBtn.hidden", () => setShow(false))
	}, [])
	// 点击屏幕显示控制按钮
	useEffect(() => {
		if (!show) {
			state.jmt?.getViewer().onSceneClicked((e: any) => {
				setShow(true)
			})
		}
	}, [state.jmt, show])
	const [showTours, setShowTours] = useState(false)
	useEffect(() => {
		eventBus.on("scene.tour.show", () => {
			setShowTours(true)
		})
		return () => {
			eventBus.off("scene.tour.show")
		}
	}, [showTours])
	useEffect(() => {
		eventBus.on("scene.tour.hidden", () => {
			setShowTours(false)
		})
		return () => {
			eventBus.off("scene.tour.hidden")
		}
	}, [showTours])
	const showEle = useMemo(
		() =>
			controls.slice(0, maxShow).map((m, i) => {
				return <React.Fragment key={`control-${i}`}>{m.context}</React.Fragment>
			}),
		[]
	)
	const hideEle = useMemo(
		() =>
			controls.slice(maxShow).map((m, i) => {
				return <React.Fragment key={`control-more-${i}`}>{m.context}</React.Fragment>
			}),
		[]
	)
	const getBox = useCallback(() => document.getElementById("SceneControl")!, [])

	// 获取自定义按钮
	const [btnData, setBtnData] = useState([])
	useEffect(() => {
		// serviceLocal.getCustomButton(state.sceneName, "").then(res => {
		// 	if (res.code == "200") {
		// 		setBtnData(res.data)
		// 	}
		// })
	}, [])
	const getNewUrl = useCallback(() => {
		if (!!btnData.length) {
			const data = btnData[0]
			if (btnData[0].buttonType == 0 && btnData[0].buttonUrl) {
				ModalCustom({
					content: ViewerModal,
					params: {
						url: data.buttonUrl,
						width: 1200,
						height: 675,
						data: null
					}
				})
			} else {
				// 新窗口打开
				if (window.openUrlInFocusWindow) {
					window.openUrlInFocusWindow(data.buttonUrl)
				} else {
					window.open(data.buttonUrl)
				}
			}
		}
	}, [btnData])
	//移动端重点功能区
	const mobileMainControl = useMemo(() => {
		return [
			{
				context: <TourSlideMobileControl />
			},
			{
				context: <TourplayMobileControl />
			},
			{
				context: <VisualangMobileControl />
			},
			{
				context: <MapControl />
			},
			{
				context: <VirtualControl />
			},
			{
				context: <MusicControl />
			},
			{
				context: <AniControl />
			},
			{
				context: <TextControl />
			}
		]
	}, [state])
	const mainShow = useMemo(() => mobileMainControl.length, [])
	const mainshowEle = useMemo(
		() =>
			mobileMainControl.slice(0, mainShow).map((m, i) => {
				return <React.Fragment key={`mainControl-${i}`}>{m.context}</React.Fragment>
			}),
		[]
	)

	//移动端互动交流区
	const mobileInteractControl = useMemo(() => {
		return [
			{
				context: <MobileDanmuControl />
			},
			{
				context: <MobileLiuyanControl />
			},
			{
				context: <MobileDianzanControl />
			}
		]
	}, [state])
	const interactShow = useMemo(() => mobileInteractControl.length, [])
	const interactshowEle = useMemo(
		() =>
			mobileInteractControl.slice(0, interactShow).map((m, i) => {
				return <React.Fragment key={`interactControl-${i}`}>{m.context}</React.Fragment>
			}),
		[]
	)
	const [isMore, setIsMore] = useState(false)
	const getMore = useCallback(() => {
		setIsMore(!isMore)
	}, [isMore])

	//移动端 更多操作区
	const mobileMoreControl = useMemo(() => {
		return [
			{
				context: <MobileOutLineControl />
			},
			{
				context: <MobilePositioneControl />
			},
			{
				context: <MobilepositionTriggerControl />
			},
			{
				context: <MobileCustomButtonControl />
			}
		]
	}, [state])
	const moreShow = useMemo(() => mobileMoreControl.length, [])
	const moreshowEle = useMemo(
		() =>
			mobileMoreControl.slice(0, moreShow).map((m, i) => {
				return <React.Fragment key={`moreControl-${i}`}>{m.context}</React.Fragment>
			}),
		[]
	)
	// 显示弹幕
	const [showDanmu, setShowDanmu] = useState(false)
	useEffect(() => {
		eventBus.on("scene.danmu.show", () => {
			setShowDanmu(true)
		})
		eventBus.on("scene.danmu.hide", () => {
			setShowDanmu(false)
		})
		return () => {
			eventBus.off("scene.danmu.show")
			eventBus.off("scene.danmu.hide")
		}
	}, [showDanmu])
	const [showOutLine, setShowOutLine] = useState(false)
	const [showPositions, setShowPositions] = useState(false)
	// 显示留言
	const [showLiuyan, setShowLiuyan] = useState(false)
	useEffect(() => {
		eventBus.on("scene.liuyan.show", () => {
			setShowLiuyan(true)
		})
		eventBus.on("scene.liuyan.hide", () => {
			setShowLiuyan(false)
		})
		eventBus.on("scene.outLine.show", () => {
			setShowOutLine(true)
		})
		eventBus.on("scene.positions.show", () => {
			setShowPositions(true)
		})
		eventBus.on("scene.positions.hide1", () => {
			setShowPositions(false)
		})
		eventBus.on("scene.outLine.hide1", () => {
			setShowOutLine(false)
		})
		eventBus.on("scene.position.trigger", e => {
			setShowPositions(true)
		})
		return () => {
			eventBus.off("scene.liuyan.show")
			eventBus.off("scene.liuyan.hide")
			eventBus.off("scene.outLine.show")
			eventBus.off("scene.positions.show")
			eventBus.off("scene.positions.hide1")
			eventBus.off("scene.outLine.hide1")
			eventBus.off("scene.position.trigger")
		}
	}, [showLiuyan, showOutLine, showPositions])
	const closePanelPositions = useCallback(() => {
		setShowPositions(false)
		eventBus.emit("scene.positions.hide")
	}, [])
	const closePanelOutLine = useCallback(() => {
		setShowOutLine(false)
		eventBus.emit("scene.outLine.hide")
	}, [])
	return (
		<>
			{!!mobile ? (
				<div id="SceneControlMobile">
					<Slide direction="up" in={show}>
						<div className={classNames("control-box")}>
							<div className="main-control">{mainshowEle}</div>

							<div className="interact-control">{interactshowEle}</div>
							<div className="more-control control-item-mobile" onClick={getMore}>
								<img
									className="mobile-control-item"
									src={
										isMore
											? require("../../assets/mobile-font/gengduo(2).png")
											: require("../../assets/mobile-font/gengduo(1).png")
									}
									alt=""
								></img>
								<div>更多</div>
							</div>
						</div>
					</Slide>
					{/* 更多功能区 */}
					<div hidden={!isMore}>
						<div className="more-control-box">{moreshowEle}</div>
					</div>
					{/* 弹幕 */}
					<div hidden={!showDanmu}>
						<DanmuMobileUI />
					</div>
					{/* 留言 */}
					{/* <div hidden={!showLiuyan}><Messagecontrol /></div> */}
					{/* 导览路径 */}
					<div hidden={!showTours}>
						<TourUI />
					</div>
					{/* 大纲 */}
					<Grow in={showOutLine} unmountOnExit>
						<OutLinePanel closePanel={closePanelOutLine}></OutLinePanel>
					</Grow>
					{/* 展厅定位 */}
					<Grow in={showPositions} unmountOnExit>
						<PositionPanel closePanel={closePanelPositions}></PositionPanel>
					</Grow>
				</div>
			) : (
				<div id="SceneControl">
					<Slide direction="up" in={show}>
						<div className={classNames("control-box")}>
							{/* <div className="copyright">
						<img src={require("@/assets/images/watermark.png")} />
					</div> */}

							<div className="control-btn">
								{showEle}
								{!!hideEle.length && (
									<div className="control-item">
										<Popover
											overlayClassName="more"
											getPopupContainer={getBox}
											content={hideEle}
											trigger={["click", "hover"]}
											destroyTooltipOnHide={{ keepParent: true }}
										>
											<i className="rulefont rule-more" />
										</Popover>
									</div>
								)}
							</div>
							{!!state.sceneCofing.info.customButton.visible && (
								<div className="border-radius-linear-gradient">
									<Badge>
										<Button onClick={getNewUrl} type="primary" icon={<i className={"iconfont icon-lianjie"} />}>
											<span className="lianjie-btn">
												{!!btnData[0] ? btnData[0].buttonName : ""}
												<i></i>
											</span>
										</Button>
									</Badge>
								</div>
							)}
						</div>
					</Slide>
					{/* 作用于pop组件动态载入的组件,pop未显示的时候,他的content内部不进行挂载,导致音乐组件不进行自动播放 */}
					{!show && <div hidden>{hideEle}</div>}
					{/* 导览路径 */}
					<div hidden={!showTours}>
						<TourUI />
					</div>
				</div>
			)}
		</>

		// <div id="SceneControl">
		// 	<Slide direction="up" in={show}>
		// 		<div className={classNames("control-box")}>
		// 			{/* <div className="copyright">
		// 				<img src={require("@/assets/images/watermark.png")} />
		// 			</div> */}

		// 			<div className="control-btn">
		// 				{showEle}
		// 				{!!hideEle.length && (
		// 					<div className="control-item">
		// 						<Popover
		// 							overlayClassName="more"
		// 							getPopupContainer={getBox}
		// 							content={hideEle}
		// 							trigger={["click", "hover"]}
		// 							destroyTooltipOnHide={{ keepParent: true }}
		// 						>
		// 							<i className="rulefont rule-more" />
		// 						</Popover>
		// 					</div>
		// 				)}
		// 			</div>
		// 			{!!state.sceneCofing.info.customButton.visible && (
		// 				<div className="border-radius-linear-gradient">
		// 					<Badge>
		// 						<Button onClick={getNewUrl} type="primary" icon={<i className={"iconfont icon-lianjie"} />}>
		// 							<span className="lianjie-btn">
		// 								{!!btnData[0] ? btnData[0].buttonName : ""}
		// 								<i></i>
		// 							</span>
		// 						</Button>
		// 					</Badge>
		// 				</div>
		// 			)}
		// 		</div>
		// 	</Slide>
		// 	{/* 作用于pop组件动态载入的组件,pop未显示的时候,他的content内部不进行挂载,导致音乐组件不进行自动播放 */}
		// 	{!show && <div hidden>{hideEle}</div>}
		// 	<div hidden={!showTours}>
		// 		<TourUI />
		// 	</div>
		// </div>
	)
}
export default SceneControl
