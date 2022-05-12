import serviceLocal from "@/services/service.local"
import eventBus from "@/utils/event.bus"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useIntl } from "umi"
import { ModalCustom } from "../modal/modal.context"
import ViewerModal from "../modal/sceneView/viewer.modal"
import { JMKContext } from "../provider/jmk.context"

const CustomButtonMobile = () => {
	const [play, setPlay] = useState(false)
	const Intl = useIntl()
	const { state: JMK } = useContext(JMKContext)

	const changeStatus = useCallback(() => {
		setPlay(!play)
		if (!play) {
			// getNewUrl()
		} else {
		}
	}, [JMK, play])

	// 获取自定义按钮
	const [btnData, setBtnData] = useState([])
	useEffect(() => {
		// serviceLocal.getCustomButton(JMK.sceneName, "").then(res => {
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

	const [show, setShow] = useState(false)
	useEffect(() => {
		eventBus.on("scene.show", () => {
			setShow(JMK.sceneCofing.info.customButton.visible)
		})
		return () => {
			// eventBus.off("scene.show")
		}
	}, [JMK])
	return (
		<>
			<div className={classNames("control-item-mobile", { on: play })} hidden={!show} onClick={changeStatus}>
				<img
					src={
						!!play
							? require("../../assets/mobile-font/dingzhi(2).png")
							: require("../../assets/mobile-font/anniuzu.png")
					}
					className={"item-img-mobile"}
				></img>
				<div>定制</div>
			</div>
		</>
	)
}
export default CustomButtonMobile
