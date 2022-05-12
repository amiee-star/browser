import ViewBrowser from "@/components/sceneUtils/view.browser"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Input, Form, Col, Row, List, Skeleton, message, Empty } from "antd"
import React, { useCallback, useEffect, useState, useRef, ChangeEvent } from "react"
import { ModalCustom, ModalRef } from "../modal.context"
import commonFunc from "@/utils/common.func"
import "./messageTip.modal.less"
import { useForm } from "antd/lib/form/Form"
import { assetData } from "@/interfaces/extdata.interface"
import { useIntl } from "umi"
import service from "@/services/service.scene"
import { LoadingOutlined } from "@ant-design/icons"
import moment from "moment"
declare global {
	interface Window {
		openFrame: boolean
	}
}
window.openFrame = false
interface Props {
	url?: string
	data: assetData
	onClose?: Function
}

const MessageModal: React.FC<Props & ModalRef> = props => {
	const Intl = useIntl()
	const { data, onClose, modalRef } = props
	const { TextArea } = Input
	const [form] = useForm<any>()
	// const [list, setList] = useState([])
	// const limit = 3
	// const [pageNum, setPageNum] = useState(1)

	// const [total, setTotal] = useState(0)
	// const [loading, setLoading] = useState(false)
	// const [initLoading, setInitLoading] = useState(true)

	const modalClose = useCallback(() => {
		onClose && onClose()
		modalRef.current?.destroy()
	}, [])

	const onFinish = useCallback(data => {
		// console.log("ZHIDAOL")
	}, [])

	return (
		<div id="messageTipModal">
			<div className="header">
				<span>
					{Intl.formatMessage({
						id: "scene.messageModal.tipHeader",
						defaultMessage: "提示"
					})}
				</span>
				<Button
					type="link"
					shape="circle"
					size="large"
					icon={<CloseOutlined size={36} style={{ color: "#fff" }} />}
					onClick={modalClose}
				/>
			</div>
			<div className="modalBody">
				<Form form={form} layout="vertical" preserve={false} requiredMark={false} onFinish={onFinish}>
					<Form.Item>
						<span className="tipWord">
							{Intl.formatMessage({
								id: "scene.messageModal.tip",
								defaultMessage: "提示"
							})}
						</span>
					</Form.Item>
				</Form>
				<Button type="primary" onClick={modalClose}>
					{Intl.formatMessage({
						id: "scene.message.ok",
						defaultMessage: "知道了"
					})}
				</Button>
			</div>
		</div>
	)
}
export default MessageModal
