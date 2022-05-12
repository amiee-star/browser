import eventBus from "@/utils/event.bus"
import { Tooltip } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"

const TourPlayControl = () => {
	const [play, setPlay] = useState(false)
	const [show, setShow] = useState(false)
	const Intl = useIntl()
	const { state: JMK } = useContext(JMKContext)
	const stopTour = useCallback(() => {
		setShow(true)
		setPlay(false)
		JMK.editHook.getAutoTour().stop()
	}, [JMK.jmt])
	useEffect(() => {
		if (!!play && JMK.jmt) {
			JMK.jmt?.getViewer().onSceneClicked((e: any) => stopTour())
		} else {
			JMK.jmt?.getViewer().removeSceneClicked((e: any) => stopTour())
		}
	}, [JMK.jmt, play])
	const changeStatus = useCallback(() => {
		eventBus.emit("scene.tour.play", !play)
		setPlay(!play)
		if (!play) {
			// JMK.editHook.getAutoTour().start()
			// eventBus.emit("scene.controlBtn.hidden")
		} else {
			// JMK.editHook.getAutoTour().stop()
			eventBus.emit("scene.controlBtn.show")
		}
	}, [JMK, play])
	const assetClick = useCallback(() => {
		if (play) {
			stopTour()
		}
	}, [JMK.jmt, play])
	useEffect(() => {
		eventBus.off("jmk.assetClick").on("jmk.assetClick", assetClick)
	}, [JMK.jmt, play])
	useEffect(() => {
		JMK.editHook?.getTours() ? setShow(true) : setShow(false)
	}, [JMK])
	const openTour: any = useMemo(() => (JMK.sceneCofing ? JMK.sceneCofing.info.openTour : {}), [JMK])
	useEffect(() => {
		if (JMK.editHook) {
			const UrlData = new URL(location.href)
			const tourData = UrlData.searchParams.get("tour")
			const showRoomType = UrlData.searchParams.get("showRoomType") === "0"
			if ((!!tourData && showRoomType) || openTour.show) {
				setPlay(true)
			}
		}

		// eventBus.on("scene.tour.play", () => setPlay(true))
		// eventBus.on("scene.tour.pause", () => setPlay(false))
		// return () => {
		// 	eventBus.off("scene.tour.play").off("scene.tour.pause")
		// }
	}, [JMK.editHook])
	return (
		<div className={classNames("control-item-mobile", { on: play })} hidden={!show} onClick={changeStatus}>
			<img
				src={
					!!play ? require("../../assets/mobile-font/tingzhi(2）.png") : require("../../assets/mobile-font/start1.png")
				}
				className={"item-img-mobile"}
				// src={require("../../assets/mobile-font/start1.png")}
			></img>
			<div>自动</div>
		</div>
	)
}
export default TourPlayControl
