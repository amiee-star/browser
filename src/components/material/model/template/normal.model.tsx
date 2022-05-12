import { objInfoData } from "@/interfaces/rule.interface"
import urlFunc from "@/utils/url.func"
import React from "react"
import "./normal.video.less"
interface Props {
	extInfo: objInfoData
}
const NormalModel: React.FC<Props> = props => {
	const { extInfo } = props
	const { thumbnail, name, videoThumb } = extInfo
	return (
		<div id="NormalModel" className="full">
			<div className="header">
				<span className="title">{name}</span>
			</div>
			<div className="content">
				<video
					preload="preload"
					controls
					disablePictureInPicture
					controlsList="nodownload"
					autoPlay
					poster={videoThumb}
					src={urlFunc.replaceUrl(thumbnail, "fileHost")}
				/>
			</div>
		</div>
	)
}

export default NormalModel
