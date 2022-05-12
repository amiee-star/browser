import { assetData } from "@/interfaces/extdata.interface"
import urlFunc from "@/utils/url.func"
import React from "react"
import "./normal.video.less"
interface Props {
	extInfo: assetData
}
const NormalVideo: React.FC<Props> = props => {
	const { extInfo } = props
	const { thumb, name, texture } = extInfo
	return (
		<div id="NormalVideo" className="full">
			<div className="header">
				<span className="title">{name}</span>
			</div>
			<div className="content">
				<video
					preload="auto"
					controls
					disablePictureInPicture
					controlsList="nodownload"
					autoPlay
					poster={thumb}
					src={urlFunc.replaceUrl(texture)}
				/>
			</div>
		</div>
	)
}

export default NormalVideo
