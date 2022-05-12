import React from "react"
import "./model.slide.util.less"
interface ModelItem {
	fileType: number
	path: string
	picId: string
}

interface Props {
	modelList: ModelItem[]
}

const ModelSlideUtil: React.FC<Props> = props => {
	const { modelList } = props
	return (
		<div className="full" id="ModelSlideUtil">
			{modelList.map(m => {
				return <iframe className="full" key={m.picId} src={m.link} frameBorder="0" allowFullScreen />
			})}
		</div>
	)
}

export default ModelSlideUtil
