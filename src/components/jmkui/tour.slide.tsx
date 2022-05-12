import urlFunc from "@/utils/url.func"
import { useMini } from "@/utils/use.func"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import ReactIdSwiper from "react-id-swiper"
import { ReactIdSwiperCustomProps } from "react-id-swiper/lib/types"

import "swiper/css/swiper.min.css"
import { JMKContext } from "../provider/jmk.context"
import "./tour.slide.less"
interface Props {
	data: any[]
}
const _TourSlide: React.FC<Props> = props => {
	const { data } = props
	const { state } = useContext(JMKContext)
	const [current, setCurrent] = useState(null)
	const swiperRef = useRef<ReactIdSwiperCustomProps & HTMLDivElement>()
	const teleportStarted = useCallback((e: any) => {
		setCurrent(e.view)
	}, [])
	useEffect(() => {
		if (state.editHook) {
			state.editHook.teleport.addEventListener("teleportDone", teleportStarted)
		}
	}, [state])
	const switchView = useCallback(
		view => () => {
			state.editHook.teleport.switchToView(view, 3)
		},
		[state]
	)
	return (
		<div id="TourSlide">
			{!!data.length && (
				<ReactIdSwiper ref={swiperRef} spaceBetween={10} slidesPerView="auto">
					{data.map((m, i) => {
						return (
							<div key={m.id}>
								<div
									className={classNames({
										full: true,
										"flex-cn": true,
										active: current ? m === current : !i
									})}
									onClick={switchView(m)}
								>
									<img src={m.thumb ? urlFunc.replaceUrl(m.thumb) : require("@/assets/image/none.png")} />
								</div>
							</div>
						)
					})}
				</ReactIdSwiper>
			)}
		</div>
	)
}

const TourSlide = useMini(_TourSlide)
export default TourSlide
