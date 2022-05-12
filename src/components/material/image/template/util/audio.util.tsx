import urlFunc from "@/utils/url.func"
import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons"
import { Button } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import commonFunc from "@/utils/common.func"
import eventBus from "@/utils/event.bus"
import classNames from "classnames"
import { useIntl } from "umi"

interface Props {
	src: string
}

const AudioUtil: React.FC<Props> = props => {
	const { src } = props
	const [play, setPlay] = useState(true)
	const isPlay = useRef(true)
	const musicRef = useRef<HTMLAudioElement>()
	const mobile = commonFunc.browser().mobile
	const Intl = useIntl()
	const toPlay = useCallback(() => {
		console.log(123)
		if (musicRef.current?.paused) {
			musicRef.current.play()
			isPlay.current = true
		} else {
			musicRef.current?.pause()
			isPlay.current = false
		}
	}, [])

	useEffect(() => {
		eventBus.on("scene.view.pusedMusic", (val: boolean) => {
			if (isPlay.current) {
				val ? musicRef.current?.pause() : musicRef.current?.play()
				setPlay(!val)
			}
		})
	}, [isPlay])
	useEffect(() => {
		return () => {
			if (musicRef.current) {
				musicRef.current.pause()
				musicRef.current = null
			}
		}
	}, [])
	useEffect(() => {
		if (!!src) {
			musicRef.current = new Audio(urlFunc.replaceUrl(src))
			musicRef.current.preload = "preload"
			musicRef.current.loop = false
			musicRef.current.autoplay = false
			musicRef.current.onplaying = () => setPlay(true)
			musicRef.current.onpause = () => setPlay(false)
			musicRef.current.play()
		}
	}, [src])
	return (
		<React.Fragment>
			{src && !mobile && (
				<Button
					hidden={!src || !!mobile}
					type="link"
					// icon={play ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
					onClick={toPlay}
				>
					<i className={classNames("rulefont", { "rule-yinle1": play, "rule-yinle": !play })}></i>
					{Intl.formatMessage({ id: "scene.bgMusic" })}
				</Button>
			)}

			{mobile && (
				<div className="musicContain" hidden={!src || !mobile}>
					<span
						className={classNames("rulefont", { "rule-yinle1": play, "rule-yinle": !play })}
						onClick={toPlay}
					></span>
				</div>
			)}
		</React.Fragment>
	)
}

export default AudioUtil
