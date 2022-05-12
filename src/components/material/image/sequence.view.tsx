import { assetData, ExtData } from "@/interfaces/extdata.interface"
import React from "react"
import NormalSequence from "./template/normal.sequence"

interface Props {
	extInfo: assetData
}

const SequenceView: React.FC<Props> = props => {
	const { extInfo } = props
	return (
		<div id="SequenceView" className="full" style={{ overflowY: "auto" }}>
			<NormalSequence extInfo={extInfo} />
		</div>
	)
}

export default SequenceView
