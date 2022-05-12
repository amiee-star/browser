import serviceScene from "@/services/service.scene"
import { message, Tooltip } from "antd"
import classNames from "classnames"
import moment from "moment"
import React, { useCallback, useContext, useEffect, useState } from "react"
import formatnum from "../../utils/formatnum.func"
import { InfoContext } from "../provider/info.context"
import { JMKContext } from "../provider/jmk.context"
import commonFunc from "@/utils/common.func"
import { useIntl } from "umi"
import eventBus from "@/utils/event.bus"

const GoodControl = () => {
	const { state } = useContext(InfoContext)
	const { state: JMK } = useContext(JMKContext)
	const mobile = commonFunc.browser().mobile
	const [show, setShow] = useState(false)
	const [isFirst, setIsFirst] = useState(false)

	const [like, setLike] = useState(0)
	const [isActive, setIsActive] = useState(false)
	const Intl = useIntl()
	useEffect(() => {
		eventBus.on("scene.show", () => {
			setShow(JMK.sceneCofing.info.isLikes)
		})
		return () => {
			// eventBus.off("scene.show")
		}
	}, [JMK])
	const [done, setDone] = useState(false)
	useEffect(() => {
		if (!!state.likeCount) {
			setLike(state.likeCount)

			setDone(true)
		}
	}, [])
	const dingAction = useCallback(() => {
		if (!window.isLocal) {
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
		}
	}, [like, JMK.sceneName, isFirst])
	return (
		!!done && (
			<div
				// style={
				// 	!mobile && state.data.skinSetting !== 3
				// 		? { width: 54, height: 70 }
				// 		: state.data.skinSetting === 1
				// 		? { height: 50 }
				// 		: { height: 50 }
				// }
				hidden={!show}
			>
				{/* {state.data.skinSetting === 3 ? ( */}
				<Tooltip
					title={Intl.formatMessage({
						id: "scene.giveLike.btn",
						defaultMessage: "点赞"
					})}
				>
					<div className={classNames("control-item good", { on: isActive })} onClick={dingAction}>
						<i className={classNames("rulefont", "rule-good")} />
						{/* {!isEn ? formatnum(like) : <p className="likeCount flex-center-column">{formatnum(like)}</p>} */}
						{formatnum(like)}
					</div>
				</Tooltip>
				{/* ) : ( */}
				{/* <div
					className={classNames("control-item good", { white: state.data.skinSetting === 1 }, { isActive: isActive })}
					onClick={dingAction}
				>
					<i className={classNames("rulefont", "rule-good")} />
					{formatnum(like)}
					<div hidden={isFirst} className={classNames("heart", { isActive: isActive })}></div>
				</div> */}
				{/* )} */}
			</div>
		)
	)
}
export default GoodControl
