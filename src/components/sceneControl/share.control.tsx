import NativeShare from "@/lib/nativeshare"
import commonFunc from "@/utils/common.func"
import { Col, message, Popover, Row, Tooltip } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useRef, useState, useMemo } from "react"
import shareFunc from "@/utils/share.func"
import { QRNormal } from "react-qrbtf"
import { useIntl } from "umi"
import { InfoContext } from "../provider/info.context"
import { ModalCustom } from "../modal/modal.context"
import shareQQ from "@/components/modal/sceneView/shareqq.modal"
import "./share.control.less"
import eventBus from "@/utils/event.bus"
import { JMKContext } from "../provider/jmk.context"

const ShareControl = () => {
	const [open, setOpen] = useState(false)
	const [show, setShow] = useState(false)
	const [visible, setVisible] = useState(false)

	const { state } = useContext(InfoContext)
	const { state: JMK } = useContext(JMKContext)
	const Intl = useIntl()
	const Share = useRef(new NativeShare())
	const changeStatus = useCallback(() => {
		setOpen(!open)
		setVisible(!open)
	}, [open])

	// useEffect(() => {
	// 	eventBus.on("scene.shareqq.modalClose", () => {
	// 		setOpen(false)
	// 	})
	// 	return () => {
	// 		eventBus.off("scene.shareqq.modalClose")
	// 	}
	// }, [])

	// useEffect(() => {
	// 	if (!window.isLocal && !state.ispreview && !!state.data && !state.data.buttonOptions.share) {
	// 		const { title, description: desc, contact } = state.data!
	// 		Share.current.setShareData({
	// 			title,
	// 			desc,
	// 			link: location.href,
	// 			icon: contact.headimgurl
	// 		})
	// 	}
	// }, [state.data])

	useEffect(() => {
		eventBus.on("scene.show", () => {
			setShow(JMK.sceneCofing.info.isShare)
		})
		return () => {
			// eventBus.off("scene.show")
		}
	}, [JMK])
	const shareAction = useCallback(
		(action: string) => () => {
			if (commonFunc.browser().weixin) {
				message.error(
					Intl.formatMessage({ id: "scene.share.tips", defaultMessage: "微信内打开链接分享，请点击右上角···进行分享" })
				)
			} else {
				try {
					if (action === "qqFriend") {
						ModalCustom({
							content: shareQQ
						})
						setVisible(false)
					} else {
						shareFunc[action](location.href, "", "")
					}
					// Share.current.call(action)
				} catch (err) {}
			}
		},
		[]
	)
	const shareContent = (
		<Row style={{ width: 155 }} justify="center">
			<Col span={24}>{Intl.formatMessage({ id: "share.title", defaultMessage: "二维码分享:" })}</Col>
			<Col span={24}>
				<QRNormal value={location.href} size={120} />
			</Col>
			<Col className="link-share" span={24}>
				{Intl.formatMessage({ id: "share.link", defaultMessage: "链接分享:" })}
			</Col>
			<Col className="shareType" span={24}>
				<Row justify="space-around" align="middle">
					<Col className="type1" style={{ padding: 5 }} onClick={shareAction("weibo")}>
						<img src={require("@/assets/images/share/weibo.png")} />
					</Col>
					<Col className="type2" style={{ padding: 5 }} onClick={shareAction("qqFriend")}>
						<img src={require("@/assets/images/share/qq.png")} />
					</Col>
					<Col className="type3" style={{ padding: 5 }} onClick={shareAction("qZone")}>
						<img src={require("@/assets/images/share/qqzone.png")} />
					</Col>
				</Row>
			</Col>
		</Row>
	)
	return (
		//  { white: state.data.skinSetting === 1 }
		<div className={classNames("control-item share", { on: open })} hidden={!show}>
			<Tooltip
				title={Intl.formatMessage({
					id: "scene.share.btn",
					defaultMessage: "分享"
				})}
			>
				<Popover
					trigger={["click"]}
					content={shareContent}
					visible={visible}
					onVisibleChange={changeStatus}
					overlayClassName={"share-control"}
				>
					<i className={classNames("rulefont", "rule-share")} />
					{/* {Intl.formatMessage({
					id: "scene.share.btn",
					defaultMessage: "分享"
				})} */}
				</Popover>
			</Tooltip>
		</div>
	)
}
export default ShareControl
