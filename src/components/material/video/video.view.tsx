import { assetData, ExtData } from "@/interfaces/extdata.interface"
import React from "react"
import NormalVideo from "./template/normal.video"

interface Props {
	extInfo: assetData
}

const VideoView: React.FC<Props> = props => {
	const { extInfo } = props

	return (
		<div id="VideoView" className="full">
			<NormalVideo extInfo={extInfo} />
		</div>
	)
}

export default VideoView
