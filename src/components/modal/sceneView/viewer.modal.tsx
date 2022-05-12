import ViewBrowser from "@/components/sceneUtils/view.browser"
import { CloseOutlined } from "@ant-design/icons"
import { Button } from "antd"
import React, { useCallback, useEffect } from "react"
import { ModalRef } from "../modal.context"
import commonFunc from "@/utils/common.func"
import "./viewer.modal.less"
import { assetData } from "@/interfaces/extdata.interface"
import classNames from "classnames"

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
	width?: number
	height?: number
}

const ViewerModal: React.FC<Props & ModalRef> = props => {
	const { data, onClose, modalRef, url, width, height } = props
	const mobile = commonFunc.browser().mobile
	const modalClose = useCallback(() => {
		onClose && onClose()
		modalRef.current?.destroy()
	}, [])
	useEffect(() => {
		document.getElementsByClassName("ant-modal-mask")[0].style.backgroundColor = `rgba(0, 0, 0, ${
			data?.extdata.info.custom.openBgOpacity / 100
		})`
	}, [])
	return (
		<div id={mobile ? "viewerModalMobile" : "viewerModal"}>
			<div className="modal-close">
				<Button type="link" shape="circle" size="large" icon={<CloseOutlined size={26} />} onClick={modalClose} />
			</div>
			<div className="modal-content">
				{!!url ? (
					<iframe
						frameBorder="0"
						allowFullScreen
						className={classNames({
							full: width ? false : true
						})}
						style={{
							backgroundColor: "#fff",
							opacity: data?.extdata.info.custom.openIframeOpacity
								? data?.extdata.info.custom.openIframeOpacity / 100
								: "0.5"
						}}
						src={url}
						// width={width ? "80%" : "auto"}
						width={width ? width : "auto"}
						height={height ? height : "auto"}
					/>
				) : (
					<div className="full">
						<ViewBrowser data={data} />
					</div>
				)}
			</div>
		</div>
	)
}
export default ViewerModal
