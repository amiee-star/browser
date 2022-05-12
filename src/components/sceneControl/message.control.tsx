import eventBus from "@/utils/event.bus"
import { Tooltip, Button, Modal } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useState } from "react"

import { ModalCustom } from "../modal/modal.context"
import MessageModal from "../modal/sceneView/message.modal"
import { JMKContext } from "../provider/jmk.context"

const messageControl = () => {
	const [show, setShow] = useState(false)
	const { state: JMK } = useContext(JMKContext)
	const liuyan = useCallback(() => {
		// Modal.confirm({
		// 	title: "",
		// 	cancelText: "",
		// 	width: 1070,
		// 	icon: <> </>,
		// 	maskClosable: true,
		// 	className: "liuyanmodal",
		// 	style: {
		// 		backgroundColor: "transparent"
		// 	},
		// 	content: (
		// 		<div>
		// 			<img src={require("@/assets/image/liuyan.jpg")} />
		// 			<div
		// 				className="close"
		// 				onClick={() => {
		// 					Modal.destroyAll()
		// 				}}
		// 			></div>
		// 		</div>
		// 	)
		// })
		ModalCustom({
			content: MessageModal
		})
	}, [])
	useEffect(() => {
		eventBus.on("scene.show", () => {
			setShow(JMK.sceneCofing.info.isMessage)
		})
		return () => {
			// eventBus.off("scene.show")
		}
	}, [JMK])
	return (
		<div className="border-radius-linear-gradient" onClick={liuyan} hidden={!show}>
			<Button type="primary" icon={<i className={classNames("rulefont rule-liuyan1")} />}>
				<span>
					留言<i></i>
				</span>
			</Button>
		</div>
	)
}
export default messageControl
