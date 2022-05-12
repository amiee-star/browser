import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import { Tooltip } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"

const MusicControl = () => {
	const Intl = useIntl()
	const AudioRef = useRef<HTMLAudioElement>()
	const { state, dispatch } = useContext(JMKContext)
	const [play, setPlay] = useState(false)
	const changeStatus = useCallback(() => {
		play ? AudioRef.current?.pause() : AudioRef.current?.play()
		play ? eventBus.emit("scene.view.pusedMusic", true) : eventBus.emit("scene.view.pusedMusic", false)
		setPlay(!play)
	}, [play])
	useEffect(() => {
		if (!state.sceneCofing?.info.closeMusic) {
			if (!state.sceneAudio && !AudioRef.current) {
				AudioRef.current = new Audio(urlFunc.replaceUrl(state.sceneCofing?.info.musicFile))
				AudioRef.current.preload = "preload"
				AudioRef.current.loop = true
				AudioRef.current.onplay = () => setPlay(true)
				AudioRef.current.onpause = () => setPlay(false)
				dispatch({
					type: "set",
					payload: {
						sceneAudio: AudioRef.current
					}
				})
			}
		}
	}, [state.sceneAudio])
	useEffect(() => {
		eventBus.on("scene.show", () => {
			state.sceneCofing?.info.musicAutoPlay && AudioRef.current?.play()
		})
		return () => {
			if (!!AudioRef.current) {
				AudioRef.current.onplaying = null
				AudioRef.current.onpause = null
			}
		}
	}, [])
	return (
		<div
			className={classNames("control-item", { on: play })}
			hidden={state.sceneCofing?.info.closeMusic}
			onClick={changeStatus}
		>
			<Tooltip
				title={Intl.formatMessage({
					id: "jmk.scene.backgroundmusic",
					defaultMessage: "背景音乐"
				})}
				trigger={["hover", "focus", "click", "contextMenu"]}
			>
				<img
					src={!play ? require("@/assets/image/musicStop.png") : require("@/assets/image/musicPlay.gif")}
					style={{ marginTop: -4 }}
				></img>
			</Tooltip>
		</div>
	)
}
export default MusicControl
