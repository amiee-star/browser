import eventBus from "@/utils/event.bus"
import { Button, Card, Input, Form, message } from "antd"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"
import { AsyncModal, ModalRef } from "../modal/modal.context"
import { CloseOutlined } from "@ant-design/icons"
import { Base64 } from "js-base64"
const SceneVerification: React.FC = () => {
	const Intl = useIntl()
	const { state } = useContext(JMKContext)
	const showRef = useRef(false)
	const openModal = useCallback(async () => {
		try {
			const result = await AsyncModal({
				content: UsePassWordModal
			})
			if (!!result) {
				if (state.sceneCofing.info.openingVideo.show) {
					eventBus.emit("scene.openVideo.show", true)
				} else {
					eventBus.emit("scene.open")
				}
			}
		} catch (error) {
			message.error(error)
		}
	}, [state])
	useEffect(() => {
		const UrlData = new URL(location.href)
		// const password = UrlData.searchParams.get("code")
		// const time = UrlData.searchParams.get("time")

		if (UrlData.searchParams.has("code")) {
			const codeArr = UrlData.searchParams.get("code") && UrlData.searchParams.get("code").split("JIMUYIDA", 2)
			const password = codeArr && codeArr[0]
			const time = codeArr && codeArr[1]

			if (!!state.sceneCofing?.info.usePwd && !showRef.current) {
				if (!!password && !!time) {
					const realPwd = Base64.decode(password)
					const realTime = Base64.decode(time)
					if (realPwd === state.sceneCofing.info.password && new Date().getTime() < Number(realTime) * 1000) {
						if (state.sceneCofing.info.openingVideo.show) {
							eventBus.emit("scene.openVideo.show", true)
						} else {
							eventBus.emit("scene.open")
						}
					} else {
						message.error("异常进入")
					}
				} else {
					showRef.current = true
					openModal()
				}
			}
		} else {
			if (!!state.sceneCofing?.info.usePwd && !showRef.current) {
				showRef.current = true
				openModal()
			}
		}
	}, [state.sceneCofing])
	return <></>
}
interface Props {}
const UsePassWordModal: React.FC<Props & ModalRef<any>> = props => {
	const { resolve, reject, modalRef } = props
	const { state } = useContext(JMKContext)
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback(data => {
		if ("password" in data) {
			data.password === state.sceneCofing.info.password
				? (resolve(true), modalRef.current.destroy())
				: message.error("密码错误")
		}
	}, [])
	return (
		<Card
			style={{ width: 500 }}
			// title="验证密码"
			title=""
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form layout="horizontal" onFinish={onFinish}>
				<Form.Item label="访问密码" name="password">
					<Input.Password placeholder="请输入密码" />
				</Form.Item>
				<Form.Item>
					<div className="t-r">
						<Button htmlType="submit" type="primary">
							确认
						</Button>
					</div>
				</Form.Item>
			</Form>
		</Card>
	)
}
export default SceneVerification
