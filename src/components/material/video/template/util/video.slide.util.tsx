import commonFunc from "@/utils/common.func"
import urlFunc from "@/utils/url.func"
import React, { useCallback, useEffect, useRef, useState } from "react"
import Swiper from "react-id-swiper"
import eventBus from "@/utils/event.bus"
import "swiper/css/swiper.min.css"
import "./video.slide.util.less"
import { Button } from "antd"
import { PlayCircleOutlined } from "@ant-design/icons"
interface VideoItem {
	fileType: number
	path: string
	picId: string
}

interface Props {
	videoList: VideoItem[]
}

const VideoSlideUtil: React.FC<Props> = props => {
	const { videoList } = props
	const ref = useRef(null)
	const refVideo = useRef(null)
	const mobile = commonFunc.browser().mobile
	const onPlay = () => {
		eventBus.emit("scene.view.playVideo", true)
	}

	const onPause = () => {
		eventBus.emit("scene.view.playVideo", false)
	}

	useEffect(() => {
		refVideo.current = document.getElementById("videoRef0")
		refVideo.current.addEventListener("play", onPlay)
		refVideo.current.addEventListener("pause", onPause)
	}, [])

	const slideNextTransitionStart = () => {
		if (ref.current !== null && ref.current.swiper !== null) {
			if (refVideo.current) {
				refVideo.current.pause()
				let index = ref.current.swiper.activeIndex
				refVideo.current = document.getElementById("videoRef" + index)
				refVideo.current.addEventListener("play", onPlay)
				refVideo.current.addEventListener("pause", onPause)
			}
		}
	}

	const slidePrevTransitionStart = () => {
		if (ref.current !== null && ref.current.swiper !== null) {
			if (refVideo.current) {
				refVideo.current.pause()
				let index = ref.current.swiper.activeIndex
				refVideo.current = document.getElementById("videoRef" + index)
				refVideo.current.addEventListener("play", onPlay)
				refVideo.current.addEventListener("pause", onPause)
			}
		}
	}
	const videoType = useCallback((index, type) => {
		if (!mobile) {
			const videoDom = document.getElementById("videoRef" + index)
			const btnDom = document.getElementById("videoBtn" + index)
			if (type) {
				videoDom.play()
				btnDom.style.display = "none"
			} else {
				videoDom.pause()
				btnDom.style.display = "block"
				return false
			}
		}
	}, [])
	return (
		<div className="full" id="VideoSlideUtil">
			<Swiper
				ref={ref}
				on={{
					slideNextTransitionStart: slideNextTransitionStart,
					slidePrevTransitionStart: slidePrevTransitionStart
				}}
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
				{videoList.map((m, index) => {
					return (
						<div className="slide-item" key={m.picId}>
							<video
								id={"videoRef" + index}
								preload="auto"
								controls
								disablePictureInPicture
								controlsList="nodownload"
								style={{ width: "100%", height: "100%" }}
								src={urlFunc.replaceUrl(m.path)}
								onClick={e => {
									e.stopPropagation(), e.preventDefault(), videoType(index, false)
								}}
							/>
							{!mobile && (
								<div id={"videoBtn" + index} className="videoBtn">
									<p>
										<span
											onClick={() => {
												videoType(index, true)
											}}
										>
											<PlayCircleOutlined style={{ fontSize: "100px" }} />
										</span>
									</p>
								</div>
							)}
						</div>
					)
				})}
			</Swiper>
		</div>
	)
}

export default VideoSlideUtil
