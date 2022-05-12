import { objInfoData } from "@/interfaces/rule.interface"
import React from "react"
import "./normal.ring.less"
interface Props {
	extInfo: objInfoData
}
const NormalRing: React.FC<Props> = props => {
	const { extInfo } = props
	const { thumbnail, name, videoThumb } = extInfo
	return (
		<div id="NormalRing" className="full">
			<div className="header">
				<span className="title">{name}</span>
			</div>
			<div className="content"></div>
		</div>
	)
}

export default NormalRing
