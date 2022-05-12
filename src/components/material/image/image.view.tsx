import { assetData, ExtData } from "@/interfaces/extdata.interface"
import React from "react"
import NormalImage from "./template/normal.image"

interface Props {
	extInfo: assetData
}

const ImageView: React.FC<Props> = props => {
	const { extInfo } = props
	return (
		<div id="ImageView" className="full" style={{ overflowY: "auto" }}>
			<NormalImage extInfo={extInfo} />
		</div>
	)
}

export default ImageView
