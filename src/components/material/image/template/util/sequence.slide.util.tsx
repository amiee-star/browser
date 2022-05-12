import commonFunc from "@/utils/common.func"
import React from "react"
import Swiper from "react-id-swiper"
import "swiper/css/swiper.min.css"
import "./sequence.slide.util.less"
import SequenceUtil from "./sequence.util"
interface ImageItem {
	fileType: number
	path: string
	picId: string
	delay?: {
		delay: number[]
		ext?: any
		w?: number
		h?: number
	}
}

interface Props {
	imgList: ImageItem[]
}

const SequenceSlideUtil: React.FC<Props> = props => {
	const { imgList } = props
	const mobile = commonFunc.browser().mobile

	return (
		<div className="full" id="SequenceSlideUtil">
			<Swiper
				pagination={mobile ? { el: ".swiper-pagination", type: "bullets", clickable: false } : { el: "" }}
				navigation={
					!mobile
						? {
								nextEl: ".swiper-button-next",
								prevEl: ".swiper-button-prev"
						  }
						: {}
				}
			>
				{imgList.map(m => {
					return (
						<div className="slide-item" key={m.picId}>
							<SequenceUtil imgList={[m]} delay={m.delay} />
						</div>
					)
				})}
			</Swiper>
		</div>
	)
}

export default SequenceSlideUtil
