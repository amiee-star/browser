import { Popover } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"

const VirtualControl = () => {
	const Intl = useIntl()
	const { state } = useContext(JMKContext)
	const [show, setShow] = useState(false)
	const [select, setSelect] = useState(null)
	const [options, setOptions] = useState([])
	useEffect(() => {
		if (state.editHook) {
			const options = state.editHook.getRoamCharacters()
			if (options.length) {
				setShow(true)
				setOptions(options)
			} else {
				setShow(false)
			}
		}
	}, [state])
	const Select = useCallback(
		(index: number) => () => {
			setSelect(index === select ? null : index)
			state.editHook?.enableRoamCharacter(index, index === select ? false : true)
		},
		[state, select]
	)
	return (
		<div className="control-item" hidden={!show}>
			<Popover
				trigger={["click", "hover"]}
				content={
					<>
						{options.map((m, index) => {
							return (
								<div
									className={classNames("control-item", { on: select === index })}
									key={m.id}
									onClick={Select(index)}
								>
									{m.name}
								</div>
							)
						})}
					</>
				}
			>
				<i className={classNames("rulefont", "rule-eye")} />
				{Intl.formatMessage({
					id: "scene.virtual.btn",
					defaultMessage: "人物"
				})}
			</Popover>
		</div>
	)
}
export default VirtualControl
