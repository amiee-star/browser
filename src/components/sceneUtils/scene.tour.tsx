import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import React, { useCallback, useContext, useEffect, useState } from "react"
import Swiper from "react-id-swiper"
import { MpSdkContext } from "../provider/mpsdk.context"
import Collapse from "../transitions/collapse"
import "./scene.tour.less"
import "swiper/css/swiper.min.css"
const SceneTour = () => {
	const { state } = useContext(MpSdkContext)
	const [open, setOpen] = useState(false)
	const [show, setShow] = useState(false)
	const [data, setData] = useState<mpSdk.Tour.Snapshot[]>([])
	const [current, setCurrent] = useState<number>()
	useEffect(() => {
		state.mpSdk?.Tour.getData().then(res => {
			!!res.length && (setShow(true), setData(res))
		})
	}, [state.mpSdk])
	useEffect(() => {
		eventBus.on("scene.tour.close", () => setOpen(false))
		eventBus.on("scene.tour.open", () => setOpen(true))
		return () => {
			eventBus.off("scene.tour.close").off("scene.tour.open")
		}
	}, [])
	useEffect(() => {
		if (state.mpSdk) {
			state.mpSdk.on(state.mpSdk.Tour.Event.STEPPED, e => {
				setCurrent(e)
			})
			state.mpSdk.on(state.mpSdk.Tour.Event.STARTED, () => {
				eventBus.emit("scene.tour.close")
				eventBus.emit("scene.tour.play")
			})
			state.mpSdk.on(state.mpSdk.Tour.Event.STOPPED, () => {
				eventBus.emit("scene.tour.open")
				eventBus.emit("scene.tour.pause")
			})
		}
	}, [state.mpSdk])
	const changeStep = useCallback(
		(i: number) => () => {
			state.mpSdk?.Tour.step(i)
			eventBus.emit("scene.tour.pause")
		},
		[state.mpSdk]
	)
	return (
		<div id="SceneTour" hidden={!show}>
			<Collapse in={open}>
				<div className="swiper-box">
					{!!data.length && (
						<Swiper spaceBetween={10} slidesPerView={"auto"} slideToClickedSlide centeredSlides centeredSlidesBounds>
							{data.map((m, i) => {
								return (
									<div key={m.sid} className={current === i ? "swiper-slide-click-active" : ""} onClick={changeStep(i)}>
										<img src={urlFunc.replaceUrl(m.imageUrl, "fileHost")} />
									</div>
								)
							})}
						</Swiper>
					)}
				</div>
			</Collapse>
		</div>
	)
}

export default SceneTour
