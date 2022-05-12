import { Button } from "antd"
import React, { useCallback } from "react"
import { useIntl } from "umi"
import { ModalRef } from "../modal.context"
import { getLocale } from "umi"
import "./expire.modal.less"

interface Props {
	expire: number
}
const ExpireModal: React.FC<Props & ModalRef> = props => {
	const Close = useCallback(() => props.modalRef.current?.destroy(), [])
	const Intl = useIntl()
	const lang = getLocale()

	return (
		<div id={lang == "en-US" ? "ExpireModalEN" : "ExpireModal"}>
			<div className="column">
				<p>
					<img src={require("@/assets/images/tip.png")} />
				</p>
				<p>
					{Intl.formatMessage({
						id: "scene.expire.title1"
					})}
					<span>
						{" "}
						”
						{props.expire > 0
							? Intl.formatMessage({
									id: "scene.expire.title2"
							  })
							: Intl.formatMessage({
									id: "scene.expire.title3"
							  })}{" "}
						“
					</span>
				</p>
				<p>
					{Intl.formatMessage({
						id: "scene.expire.title4"
					})}
				</p>
				<p>
					{Intl.formatMessage({
						id: "scene.expire.title5"
					})}
				</p>
			</div>
			<Button type="text" size="large" onClick={Close}>
				{Intl.formatMessage({
					id: "scene.tips.text4",
					defaultMessage: "知道了"
				})}
			</Button>
		</div>
	)
}
export default ExpireModal
