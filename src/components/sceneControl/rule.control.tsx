import classNames from "classnames"
import React, { useCallback, useContext, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"
const RuleControl: React.FC = () => {
	const [open, setOpen] = useState(false)
	const { state } = useContext(JMKContext)
	const switchRule = useCallback(() => {
		if (state.editHook) {
			setOpen(!open)
			state.editHook.enableRuler(!open)
		}
	}, [state, open])
	return (
		<div className={classNames("control-item", { on: open })} onClick={switchRule}>
			<i className={classNames("rulefont", "rule-bird-eye")} />
			测量
		</div>
	)
}

export default RuleControl
