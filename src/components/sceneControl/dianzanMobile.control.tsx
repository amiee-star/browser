import serviceScene from "@/services/service.scene"
import eventBus from "@/utils/event.bus"
import formatnum from "@/utils/formatnum.func"
import { message } from "antd"
import classNames from "classnames"
import moment from "moment"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useIntl } from "umi"
import { InfoContext } from "../provider/info.context"
import { JMKContext } from "../provider/jmk.context"

const MobileDianzanControl = () => {
	const [play, setPlay] = useState(false)
	const Intl = useIntl()
	const { state } = useContext(InfoContext)
	const { state: JMK } = useContext(JMKContext)
	const [like, setLike] = useState(state.likeCount || 0)
	const [isFirst, setIsFirst] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const changeStatus = useCallback(() => {
		setPlay(!play)
		if (like > (state.likeCount || 0)) {
			if (!isFirst) {
				message.error({
					content: Intl.formatMessage({
						id: "scene.good.tips",
						defaultMessage: "无法重复点赞"
					})
				})
				setIsFirst(true)
			}
		} else {
			const { width, height } = window.screen
			serviceScene
				.sceneCommit({
					app: "scene",
					event: "2002",
					obj: JMK.sceneName || "",
					ds: `${width}x${height}`,
					t: moment().unix(),
					page: location.href
				})
				.then(res => {
					if (res.code == 200) {
						setLike(like + 1)
						setIsActive(true)
					}
				})
		}
	}, [JMK, play])
	console.log(JMK.sceneCofing.info, "JMK.sceneCofing.info")
	const [show, setShow] = useState(false)
	useEffect(() => {
		eventBus.on("scene.show", () => {
			setShow(JMK.sceneCofing.info.isLikes)
		})
		return () => {
			// eventBus.off("scene.show")
		}
	}, [JMK])
	return (
		<>
			<div className={classNames("control-item-mobile", { on: play })} hidden={!show} onClick={changeStatus}>
				<img
					src={
						!!play
							? require("../../assets/mobile-font/dianzan(2).png")
							: require("../../assets/mobile-font/dianzan(1).png")
					}
					className={"item-img-mobile"}
				></img>
				<div>{formatnum(like)}</div>
			</div>
		</>
	)
}
export default MobileDianzanControl
