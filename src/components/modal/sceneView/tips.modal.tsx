import { Button, Col, Row } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { useIntl } from "umi"
import { ModalRef } from "../modal.context"
import commonFunc from "@/utils/common.func"
import "./tips.modal.less"

interface Props {}
interface dataItem {
	img: any
	text: string
}
const TipsModal: React.FC<Props & ModalRef> = props => {
	const Intl = useIntl()
	const mobile = commonFunc.browser().mobile
	const dataArr = [
		{
			img: require("@/assets/images/tips/pic1.png"),
			text: Intl.formatMessage({
				id: "scene.tips.text1"
			})
		},
		{
			img: require("@/assets/images/tips/pic2.png"),
			text: Intl.formatMessage({
				id: "scene.tips.text2"
			})
		},
		{
			img: require("@/assets/images/tips/pic3.png"),
			text: Intl.formatMessage({
				id: "scene.tips.text3"
			})
		}
	]
	const dataArrMobile = [
		{
			img: require("@/assets/images/tips/pic_mobile.png"),
			text: Intl.formatMessage({
				id: "scene.tips.text1"
			})
		},
		{
			img: require("@/assets/images/tips/pic2_mobile.png"),
			text: Intl.formatMessage({
				id: "scene.tips.text2"
			})
		}
	]
	const Close = useCallback(() => props.modalRef.current?.destroy(), [])
	const [mapArr, setMapArr] = useState<dataItem[]>([])
	useEffect(() => {
		if (mobile) {
			setMapArr(dataArrMobile)
		} else {
			setMapArr(dataArr)
		}
	}, [mobile])
	return (
		<div className={`${mobile ? "tipsModalMobile" : "tipsModal"}`}>
			<Row wrap={false} justify="space-around" align="middle">
				{mapArr.map((item, index) => {
					return (
						<Col key={index}>
							<img src={item.img} />
							<p>{item.text}</p>
						</Col>
					)
				})}
			</Row>
			<Button className="btn" type="text" size="large" onClick={Close}>
				{Intl.formatMessage({
					id: "scene.tips.text4",
					defaultMessage: "知道了"
				})}
			</Button>
		</div>
	)
}
export default TipsModal
