import eventBus from "@/utils/event.bus"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import commonFunc from "@/utils/common.func"
import classNames from "classnames"
import { InfoContext } from "../provider/info.context"
import { useIntl } from "umi"
import "./scene.overdue.less"

const SceneOverdue: React.FC = () => {
	const mobile = commonFunc.browser().mobile
	const [isOverdue, setIsOverdue] = useState(false)
	const { state } = useContext(InfoContext)
	const durationEndTs = state.data.durationEndTs
	const Intl = useIntl()

	useEffect(() => {
		if (durationEndTs) {
			if (durationEndTs - new Date().getTime() <= 0) {
				setIsOverdue(true)
			} else {
				setIsOverdue(false)
			}
		}
	}, [state])

	return (
		<div id={mobile ? "SceneOverdueMobile" : "SceneOverdue"} hidden={!isOverdue}>
			<div className="content">
				<div className={classNames("rulefont images", "rule-jinyongzhanting")}></div>
				<div className="tips-title">
					{Intl.formatMessage({ id: "scene.overdue.title", defaultMessage: "此展厅已到期" })}
				</div>
				{mobile ? (
					<div className="tips">
						<p>
							{Intl.formatMessage({
								id: "scene.overdue.tips.mobile1",
								defaultMessage: "展厅负责人请咨询客服或自行续费开通"
							})}
						</p>
						<p>
							{Intl.formatMessage({
								id: "scene.overdue.tips.mobile2",
								defaultMessage: "对您造成的不便请谅解"
							})}
						</p>
					</div>
				) : (
					<div className="tips">
						{Intl.formatMessage({
							id: "scene.overdue.tips.pc",
							defaultMessage: "展厅负责人请咨询客服或自行续费开通，对您造成的不便请谅解"
						})}
					</div>
				)}
			</div>
		</div>
	)
}

export default SceneOverdue
