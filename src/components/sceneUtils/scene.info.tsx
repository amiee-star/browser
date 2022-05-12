import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import { DownOutlined, EyeOutlined, UpOutlined } from "@ant-design/icons"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { useIntl } from "umi"

import "./scene.info.less"
import { JMKContext } from "../provider/jmk.context"

const SceneInfo: React.FC = () => {
	const { state } = useContext(JMKContext)
	const Intl = useIntl()
	const companyInfo = [
		{
			icon: require("@/assets/images/people.png"),
			text: state.sceneCofing?.info.contact.contactName
		},
		{
			icon: require("@/assets/images/phone.png"),
			text: state.sceneCofing?.info.contact.contactPhone,
			tag: "tel"
		},
		{
			icon: require("@/assets/images/youxiang.png"),
			text: state.sceneCofing?.info.contact.contactEmail
		},
		{
			icon: require("@/assets/images/address.png"),
			text: state.sceneCofing?.info.contact.contactAddress
		}
	]
	const [isShow, setShow] = useState<Boolean>(false)
	const [isShowImage, setShowImage] = useState<Boolean>(false)
	const [isShowDetail, setShowDetail] = useState<Boolean>(false)
	const [downText, setDownText] = useState<string>(Intl.formatMessage({ id: "scene.info.down" }))
	const imgClick = useCallback(() => {
		if (state.sceneCofing?.info.buttonOptions.headerLink) {
			setShow(false)
			setShowDetail(false)
			setDownText(Intl.formatMessage({ id: "scene.info.down" }))
		}
	}, [isShowDetail, isShow, isShowImage])
	const handleMouseEnter = () => {
		if (!isShow) {
			setShow(true)
		} else {
			setShow(false)
			setShowDetail(false)
			setDownText(Intl.formatMessage({ id: "scene.info.down" }))
		}
	}
	const handleClickDown = () => {
		if (!isShowDetail) {
			setShowDetail(true)
			setDownText(Intl.formatMessage({ id: "scene.info.up" }))
		} else {
			setShowDetail(false)
			setDownText(Intl.formatMessage({ id: "scene.info.down" }))
		}
	}
	useEffect(() => {
		eventBus.on("scene.show", () => {
			setShowImage(true)
		})
	}, [])

	return (
		<div id="SceneInfo" hidden={state.sceneCofing?.info && !isShowImage}>
			{!state.sceneCofing?.info?.hideLogo && (
				<div className="content">
					<div className="hallImage" onClick={imgClick} onMouseEnter={handleMouseEnter}>
						<img
							src={
								state.sceneCofing?.info?.contact.headimgurl
									? urlFunc.replaceUrl(state.sceneCofing?.info?.contact.headimgurl)
									: require(`@/assets/images/logodefault.jpg`)
							}
						/>
					</div>
					<div className="info" hidden={!isShow} onClick={handleClickDown}>
						<p>
							<span className="title">{state.sceneCofing?.info?.contact.contactName}</span>
							{/* <span>
								<EyeOutlined /> {state.sceneCofing?.info.viewCount}
							</span> */}
						</p>
						<p>
							<span className="hallEnName otw">{state.sceneCofing?.info?.name}</span>
							<span className="downBtn">
								{downText} {isShowDetail ? <UpOutlined /> : <DownOutlined />}
							</span>
						</p>
					</div>
					<div className="pcDetail" hidden={!isShowDetail}>
						<p className="otw">{state.sceneCofing?.info.name}</p>
						<div className="desc">
							{state.sceneCofing?.info.description
								? state.sceneCofing?.info.description
								: Intl.formatMessage({ id: "scene.info.desc" })}
						</div>
						<div className="line"></div>
						<div className="contact">
							<ul>
								{companyInfo.map((item, index) => {
									return (
										item.text && (
											<li key={index}>
												<span>
													<img src={item.icon} alt="" />
												</span>
												<span className="otw">
													<a href={"tel:" + item.text}></a>
													{item.text}
												</span>
											</li>
										)
									)
								})}
							</ul>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
export default SceneInfo
