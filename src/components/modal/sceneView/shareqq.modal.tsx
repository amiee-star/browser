import React, { useCallback, useContext, useEffect } from "react"
import { QRNormal } from "react-qrbtf"
import { ModalRef } from "../modal.context"
import classNames from "classnames"
import { useIntl, getLocale } from "umi"
import eventBus from "@/utils/event.bus"
import "./shareqq.less"

const ShareQQ: React.FC<ModalRef> = props => {
	const { modalRef } = props
	const lang = getLocale()
	const Intl = useIntl()
	const closeHandle = () => {
		modalRef.current?.destroy()
		eventBus.emit("scene.shareqq.modalClose")
	}
	return (
		<div className={classNames("shareqq", { en_us: lang === "en-US" })}>
			<i className={classNames("rulefont close", "rule-guanbi3")} onClick={closeHandle}></i>
			<div className="content">
				<div className="qrcode">
					<QRNormal value={location.href} size={120} />
				</div>
				<div className="tips-area">
					<div className="tips">
						{Intl.formatMessage({
							id: "scene.shareqq.tips",
							defaultMessage: "手机QQ扫描二维码，点击右上角 ··· 按钮"
						})}
					</div>
					<div className="tips">
						{Intl.formatMessage({
							id: "scene.shareqq.tips2",
							defaultMessage: "分享到QQ好友或QQ空间"
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ShareQQ
