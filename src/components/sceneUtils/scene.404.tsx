import React, { useEffect, useState } from "react"
import "./scene.404.less"
import { viewInfo, InfoData } from "@/interfaces/rule.interface"
import { useIntl } from "umi"
interface Props {
	data: viewInfo & InfoData
	debug?: boolean
}
const secneNotFind: React.FC<Props> = props => {
	const [timeCount, setTimeCount] = useState(3)
	const [show] = useState(false)
	const { data, debug } = props
	const Intl = useIntl()

	useEffect(() => {
		const timer = setInterval(() => {
			let count = timeCount
			if (count === 0) {
				toIndex()
				clearInterval(timer)
				return
			}
			count--
			setTimeCount(count)
		}, 1000)
		return () => {
			clearInterval(timer)
		}
	}, [timeCount])

	const toIndex = () => {
		if (!data.isLocalize && !debug) {
			window.location.href = "//www.3dyunzhan.com/"
		}
	}
	return (
		<div className="notfound" onClick={toIndex}>
			<div className="content">
				<img src={require("@/assets/images/notfound.png")} alt="" />
				<p className="tip">
					{Intl.formatMessage({
						id: "scene.404.tip",
						defaultMessage: "坏了，这里的内容被地外文明劫持了！"
					})}
				</p>
				<p className="desc">
					{Intl.formatMessage({
						id: "scene.404.desc",
						defaultMessage: "安全第一，我们先回首页"
					})}
					<span>{timeCount}</span>
				</p>
			</div>
		</div>
	)
}
export default secneNotFind
