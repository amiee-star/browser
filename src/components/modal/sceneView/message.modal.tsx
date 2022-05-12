import ViewBrowser from "@/components/sceneUtils/view.browser"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Input, Form, Col, Row, List, Skeleton, message, Empty } from "antd"
import React, { useCallback, useEffect, useState, useRef, ChangeEvent, useContext } from "react"
import { ModalCustom, ModalRef } from "../modal.context"
import commonFunc from "@/utils/common.func"
import "./message.modal.less"
import { useForm } from "antd/lib/form/Form"
import { assetData } from "@/interfaces/extdata.interface"
import { useIntl } from "umi"
import service from "@/services/service.scene"
import { LoadingOutlined } from "@ant-design/icons"
import moment from "moment"
import messageTipModal from "./messageTip.modal"
import { JMKContext } from "@/components/provider/jmk.context"
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
	const [list, setList] = useState([])
	const limit = 3
	const [pageNum, setPageNum] = useState(1)

	const [total, setTotal] = useState(0)
	const [loading, setLoading] = useState(false)
	const [initLoading, setInitLoading] = useState(true)
	const { state } = useContext(JMKContext)

	const modalClose = useCallback(() => {
		onClose && onClose()
		modalRef.current?.destroy()
	}, [])

	const onFinish = useCallback(
		data => {
			console.log(data)
			service.addMessage({ ...data, view_name: state.sceneName }).then(res => {
				console.log(res)
				if (res.code == 200) {
					ModalCustom({
						content: messageTipModal
					})
				}
				form.resetFields()
			})
		},
		[state]
	)

	const getList = useCallback(() => {
		// service.messageList({ limit, offset: (pageNum - 1) * limit, view_name: state.sceneName }).then(res => {
		// 	setTotal(res.data.count)
		// 	if (pageNum == 1) {
		// 		setList(res.data.rows)
		// 		setInitLoading(false)
		// 	} else {
		// 		setList([...list, ...res.data.rows])
		// 		setLoading(false)
		// 	}
		// })
	}, [limit, pageNum, state])

	useEffect(() => {
		getList()
	}, [pageNum])

	const onLoadMore = useCallback(() => {
		if (pageNum * limit < total && !initLoading) {
			setPageNum(pageNum + 1)
			setLoading(true)
		}
		if (pageNum * limit >= total) {
			message.error(
				Intl.formatMessage({
					id: "scene.message.noMore"
				})
			)
		}
	}, [initLoading, total, pageNum])

	const loadMore =
		!initLoading && !loading && list.length ? (
			<div className="footer">
				<div onClick={onLoadMore}>
					<img src={require("@/assets/image/shuaxin.png")} style={{ marginRight: "8px" }} />
					{Intl.formatMessage({
						id: "scene.message.toLoad"
					})}
				</div>
			</div>
		) : null

	return (
		<div id="messageModal">
			<div className="header">
				<span>
					{Intl.formatMessage({
						id: "scene.comment.btn",
						defaultMessage: "留言"
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
					<Form.Item
						name="content"
						rules={[
							{
								required: true,
								message: Intl.formatMessage({
									id: "scene.message.content.placehold"
								})
							}
						]}
					>
						<TextArea rows={3} style={{ color: "#3E3E3E" }} />
					</Form.Item>

					<Form.Item>
						<Row gutter={8}>
							<Col>
								<Form.Item
									name="name"
									rules={[
										{
											required: true,
											message: Intl.formatMessage({
												id: "scene.message.name.placehold"
											})
										}
									]}
									className="input-fill-x"
								>
									<Input
										placeholder={Intl.formatMessage({
											id: "scene.message.name.placehold"
										})}
										className="input-fill"
										style={{ width: "200px", height: "35px", marginRight: "15px", color: "#3E3E3E" }}
									/>
								</Form.Item>
							</Col>
							<Col>
								<Button type="primary" style={{ height: "35px" }} htmlType="submit">
									{Intl.formatMessage({
										id: "scene.message.btn",
										defaultMessage: "提交留言"
									})}
								</Button>
							</Col>
						</Row>
					</Form.Item>
				</Form>
				<div className="line"></div>
				<div className="messageContent">
					{/* {list.length ? ( */}
					<List
						loading={initLoading}
						// itemLayout="horizontal"
						loadMore={loadMore}
						dataSource={list}
						split={false}
						renderItem={item => (
							<List.Item key={item.id}>
								{/* <Skeleton avatar title={false} loading={item.loading} active> */}
								<div className="messageItem" key={item.id}>
									<div className="itemHead">
										<div className="userInfo">
											<div className="portrait">
												<img src={require("@/assets/image/renwutouxiang.png")} />
											</div>
											<div className="name">{item.name}</div>
										</div>
										<div className="date">{moment(new Date(item.createdAt)).format("YYYY/MM/DD HH:mm")}</div>
									</div>
									<div className="itemContent">
										<div className="borderLine"></div>
										<div className="text">{item.content}</div>
									</div>
								</div>
								{/* </Skeleton> */}
							</List.Item>
						)}
					></List>
					{/* ) : (
						<Empty />
					)} */}
				</div>

				<div className="total">
					{Intl.formatMessage({
						id: "scene.message.total1"
					})}
					<span>{total}</span>
					{Intl.formatMessage({
						id: "scene.message.total2"
					})}
				</div>
			</div>
		</div>
	)
}
export default MessageModal
