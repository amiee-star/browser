import { coverData } from "@/interfaces/jmt.interface"
import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import { Button } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { JMKContext } from "../provider/jmk.context"
import "./scene.openVideo.less"
interface Props {
	zIndex?: number
}
const SceneIntoOpenVideo: React.FC<Props> = props => {
	const { zIndex = 0 } = props
	const { state } = useContext(JMKContext)
	const [show, setShow] = useState(false)
	// const [showBtn, setShowBtn] = useState(!window.YUNZHAN4D_IS_ELECTRON)
	const [play, setPlay] = useState(false)
	const playOnce = useRef(false)
	const appState = useRef(false)
	const showBtn = !window.YUNZHAN4D_IS_ELECTRON
	useEffect(() => {
		eventBus.on("scene.openVideo.show", e => {
			if (!!e) {
				setShow(true)
			} else {
				eventBus.emit("scene.open")
				appState.current = true
				if (!!playOnce.current) {
					setShow(false)
				}
			}
		})
		return () => {
			eventBus.off("scene.openVideo.show")
		}
	}, [])
	useEffect(() => {
		if (state.sceneCofing.info.openingVideo.show && !state.sceneCofing.info.usePwd && !videoEle.current) {
			setShow(true)
		}
	}, [state])
	useEffect(() => {
		if (!!show) {
			eventBus.emit("scene.open")
		}
	}, [show])
	const videoEle = useRef<HTMLVideoElement>()

	const videoLoad = useCallback((ref: HTMLVideoElement) => {
		if (!!ref) {
			videoEle.current = ref
			videoEle.current.addEventListener("ended", () => {
				playOnce.current = true
				if (!!appState.current) {
					setShow(false)
				} else {
					videoEle.current.play()
				}
			})
		}
	}, [])
	const over = useCallback(() => {
		setShow(false)
		eventBus.emit("scene.open")
	}, [])
	const isAuto = useMemo(() => {
		// return location.href.includes("autoplay")
		return !!state.sceneCofing.info.openingVideo.showSkip || location.href.includes("autoplay")
	}, [state])
	const playVideo = useCallback(() => {
		if (play) {
			videoEle.current.muted = true
		} else {
			videoEle.current.muted = false
		}
		setPlay(!play)
	}, [play])
	return (
		!!show && (
			<div
				id="openingVideo"
				style={{
					zIndex
				}}
			>
				<video
					ref={videoLoad}
					src={urlFunc.replaceUrl(state.sceneCofing.info.openingVideo.url)}
					muted={showBtn}
					autoPlay={true}
					preload="auto"
				>
					您的浏览器不支持 video 标签。
				</video>
				{!!showBtn && (
					<div
						style={{ position: "absolute", bottom: "50px", right: "50px", cursor: "pointer", textAlign: "center" }}
						onClick={playVideo}
					>
						<img
							src={!play ? require("@/assets/image/musicStop.png") : require("@/assets/image/musicPlay.gif")}
							width="40px"
							height="40px"
						></img>
						<p style={{ lineHeight: "30px" }}>{!play ? "开启音量" : "关闭音量"}</p>
					</div>
				)}
				<Button hidden={!isAuto} type="primary" onClick={over}>
					跳过
				</Button>
			</div>
		)
	)
}
export default SceneIntoOpenVideo
