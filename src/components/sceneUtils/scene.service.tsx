import eventBus from "@/utils/event.bus"
import React, { useEffect, useState, useContext } from "react"
import serviceModal from "@/components/modal/sceneview/service.modal"
import liveModal from "@/components/modal/sceneview/live.modal"
import { InfoContext } from "../provider/info.context"
import commonFunc from "@/utils/common.func"
import { ModalCustom } from "../modal/modal.context"
import moment from "moment"
import { useIntl } from "umi"
import "./scene.service.less"

const SceneService = () => {
	const [showService, setShowService] = useState<Boolean>(false)
	const [showLive, setShowLive] = useState<Boolean>(false)
	const [custServiceCode, setCustServiceCode] = useState()
	const { state } = useContext(InfoContext)
	const Intl = useIntl()
	const mobile = commonFunc.browser().mobile

	useEffect(() => {
		eventBus.on("showcase.show", () => {
			const liveEndTime = state.data.sceneTemplateLive.liveEndTime?.valueOf()
			const liveStartTime = state.data.sceneTemplateLive.liveStartTime?.valueOf()
			const currentTime = moment().format("YYYY-MM-DD HH:mm:ss")?.valueOf()
			if (state.data.myCustService && state.data.custServiceCode) {
				setShowService(true)
				setCustServiceCode(state.data.custServiceCode)
			}
			if (
				state.data.liveService &&
				state.data.sceneTemplateLive.liveUrl &&
				liveEndTime > currentTime &&
				liveStartTime < currentTime
			) {
				setShowLive(true)
			}
		})
	}, [showService, showLive, custServiceCode])

	const showServiceHandle = () => {
		if (mobile) {
			ModalCustom({
				content: serviceModal,
				params: {
					custServiceUrl: custServiceCode
				}
			})
		} else {
			const leftVal = (screen.width - 800) / 2
			const topVal = (screen.height - 600) / 2
			window.open(
				custServiceCode,
				"_blank",
				"width=800,height=600,toolbars=yes,resizable=yes,scrollbars=yes,left=" + leftVal + ",top=" + topVal
			)
		}
	}

	const showLiveHandle = () => {
		const liveType = state.data.sceneTemplateLive.liveOpenType
		const liveUrl = state.data.sceneTemplateLive.liveUrl
		if (liveType == 1) {
			window.open(liveUrl, "_blank")
		} else {
			ModalCustom({
				content: liveModal,
				params: {
					liveUrl: liveUrl
				}
			})
		}
	}

	return (
		<div id={mobile ? "toolMobile" : "tool"}>
			<div id={mobile ? "serviceMobile" : "service"} hidden={!showService} onClick={showServiceHandle}>
				<div className="pcfixed-tools">
					<div className="kef">
						<img className="roll" src={require("@/assets/images/service/roll.png")} alt="" />
						<span className={mobile ? "mkfbtn" : "kfbtn"}>
							{Intl.formatMessage({ id: "scene.service" })}
						</span>
						<img className="kfbg" src={require("@/assets/images/service/kfbg.png")} alt="" />
					</div>
				</div>
			</div>
			<div id={mobile ? "liveMobile" : "live"} hidden={!showLive} onClick={showLiveHandle}>
				<ul>
					<li className="m1"></li>
					<li className="m2"></li>
					<li className="m3"></li>
				</ul>
				<span>{Intl.formatMessage({ id: "scene.live" })}</span>
			</div>
		</div>
	)
}
export default SceneService
