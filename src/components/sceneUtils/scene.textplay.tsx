import eventBus from "@/utils/event.bus"
import React, { useState, useEffect, useCallback, useRef } from "react"
import Grow from "../transitions/grow"
import Typed from "typed.js"
import "./scene.textplay.less"
export interface PlayData {
	muisc: string
	pic: string
	word: { txt: string; start: string; end: string }[]
	speed?: number
	size?: string
}

const SceneTextPlay = () => {
	const [data, setData] = useState<PlayData>()
	const audioEle = useRef<HTMLAudioElement>(null)
	const TypedFunc = useRef<Typed>(null)
	const oldAudioSrc = useRef<string>("")
	useEffect(() => {
		eventBus.on("scene.text.play", e => {
			setData(e)
		})
		eventBus.on("scene.text.stop", () => {
			setData(null)
		})
		return () => {
			eventBus.off("scene.text.play")
			eventBus.off("scene.text.stop")
		}
	}, [])
	const coverTime = useCallback((t: string) => {
		const [h, m, ss] = t.split(":")
		const [s, mm] = ss.split(",")
		return Number(h) * 3600 * 1000 + Number(m) * 60 * 1000 + Number(s) * 1000 + Number(mm)
	}, [])
	const queenList = useRef<NodeJS.Timeout[]>([])
	useEffect(() => {
		if (!!data) {
			queenList.current.forEach(item => clearTimeout(item))
			queenList.current = []
			data.word.forEach(item => {
				const queen = setTimeout(() => {
					if (txtEle.current) {
						txtEle.current.innerHTML += item.txt.replace(/\r\n/g, "</br>")
						txtEle.current.scrollTo({ top: 999999 })
					}
				}, coverTime(item.start))
				queenList.current.push(queen)
			})
			// if (TypedFunc.current) {
			// 	TypedFunc.current.destroy()
			// }
			// if (audioEle.current) {
			// 	if (audioEle.current.src !== oldAudioSrc.current) {
			// 		audioEle.current.pause()
			// 	}
			// } else {
			// audioEle.current = new Audio()
			// audioEle.current.addEventListener("playing", () => {
			// 	TypedFunc.current = new Typed("#SceneTextPlay .text", {
			// 		strings: data.word,
			// 		typeSpeed: data.speed || 180,
			// 		smartBackspace: false,
			// 		fadeOut: true,
			// 		showCursor: false
			// 	})
			// })
			// TypedFunc.current = new Typed("#SceneTextPlay .text", {
			// 	strings: data.word,
			// 	typeSpeed: data.speed || 40,
			// 	smartBackspace: false,
			// 	fadeOut: true,
			// 	showCursor: false
			// })
			// }
			// audioEle.current.src = data.muisc
			// audioEle.current.play()
			// oldAudioSrc.current = data.muisc
		} else {
			// if (TypedFunc.current) TypedFunc.current.destroy()
			// if (audioEle.current) audioEle.current.pause()
		}
	}, [data])
	const txtEle = useRef<HTMLDivElement>()
	return (
		<div id="SceneTextPlay">
			<Grow in={!!data} unmountOnExit>
				<div className="warp">
					<div className="text-wrap" style={{ display: data?.word[0] ? "block" : "none" }}>
						<div className="text" ref={txtEle} />
					</div>
					<div className="pic">
						<img src={data?.pic} height={{ maximum: "400", medium: "320", minimum: "240" }[data?.size || "medium"]} />
					</div>
				</div>
			</Grow>
		</div>
	)
}
export default SceneTextPlay
