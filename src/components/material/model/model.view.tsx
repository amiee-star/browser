import { objInfoData } from "@/interfaces/rule.interface"
import React from "react"
import NormalModel from "./template/normal.model"

interface Props {
	extInfo: objInfoData
}

const ModelView: React.FC<Props> = props => {
	const { extInfo } = props
	const { template = "normal" } = extInfo
	return (
		<div id="ModelView" className="full" style={{ overflowY: "auto" }}>
			{template === "normal" && <NormalModel extInfo={extInfo} />}
		</div>
	)
}

export default ModelView
