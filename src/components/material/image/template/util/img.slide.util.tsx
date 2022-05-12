import { ModalCustom, ModalRef } from "@/components/modal/modal.context"
import PhotoView from "@/components/utils/photo.view"
import urlFunc from "@/utils/url.func"
import commonFunc from "@/utils/common.func"
import React, { useCallback } from "react"
import Swiper from "react-id-swiper"
import "swiper/css/swiper.min.css"
import "./img.slide.util.less"
interface ImageItem {
	fileType: number
	path: string
	picId: string
}

interface Props {
	imgList: ImageItem[]
}

const ImgSlideUtil: React.FC<Props> = props => {
	const { imgList } = props
	const mobile = commonFunc.browser().mobile
	const imgClick = useCallback(
		(src: string) => () => {
			ModalCustom({
				content: ImageView,
				params: {
					src
				}
			})
		},
		[]
	)
	return (
		<div className="full" id="ImgSlideUtil">
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
							<img src={urlFunc.replaceUrl(m.path)} onClick={imgClick(urlFunc.replaceUrl(m.path))} />
						</div>
					)
				})}
			</Swiper>
		</div>
	)
}

interface ImageViewProps {
	src: string
}
const ImageView: React.FC<ImageViewProps & ModalRef> = props => {
	const { src, modalRef } = props
	return (
		<div style={{ width: window.self.innerWidth, height: window.self.innerHeight }}>
			<PhotoView
				src={src}
				onClick={() => {
					modalRef.current.destroy()
				}}
			/>
		</div>
	)
}

export default ImgSlideUtil
