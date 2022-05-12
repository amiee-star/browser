import React, { useCallback } from "react"
import { ModalRef } from "../modal.context"
import commonFunc from "@/utils/common.func"
import { CloseOutlined } from "@ant-design/icons"
import "./service.modal.less"
interface Props {
	custServiceUrl: string
}
const TipsModal: React.FC<Props & ModalRef> = props => {
	const { custServiceUrl } = props
	const closeHandle = useCallback(() => props.modalRef.current?.destroy(), [])
	const mobile = commonFunc.browser().mobile

	return (
		<div id={`${mobile ? "serviceContntMobile" : "serviceContnt"}`}>
			<iframe src={custServiceUrl} frameBorder="0"></iframe>
			<span className={`${mobile ? "closeBtn" : ""}`} onClick={closeHandle}>
				<CloseOutlined />
			</span>
		</div>
	)
}
export default TipsModal
