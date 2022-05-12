import serviceScene from "@/services/service.scene"
import commonFunc from "@/utils/common.func"
import eventBus from "@/utils/event.bus"
import { Button, Progress } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"
import "./scene.loading.less"
import moment from "moment"
import classNames from "classnames"

const SceneLoading = () => {
	const isMobile = commonFunc.browser().mobile
	const [step, setStep] = useState(0)
	const [show, setShow] = useState(false)
	const { state } = useContext(JMKContext)
	const Intl = useIntl()
	const stepRef = useRef({ asset: 0, scene: 0 })
	const { width, height } = window.screen
	const changeStep = useCallback(
		(type: "asset" | "scene", n: number) => {
			type === "asset" && (stepRef.current.asset = n * 100)
			type === "scene" && (stepRef.current.scene = !!state.jmt ? 100 : n * 100)
			setStep(Math.round(stepRef.current.asset * 0.2 + stepRef.current.scene * 0.8))
		},
		[state]
	)
	useEffect(() => {
		if (!!state.jmt) {
			stepRef.current.scene = 100
		}
	}, [state])
	useEffect(() => {
		eventBus.on("jmk.asset.loading", n => changeStep("asset", n))
		eventBus.on("jmk.loading", n => changeStep("scene", n))
		return () => {
			eventBus.off("jmk.asset.loading")
			eventBus.off("jmk.loading")
		}
	}, [])
	const isAuto = useMemo(() => {
		return location.href.includes("autoplay")
	}, [])
	const enterHall = useCallback(() => {
		setShow(false)
		eventBus.emit("scene.show")
		serviceScene.sceneCommit({
			app: "scene",
			event: "1001",
			obj: state.sceneName || "",
			ds: `${width}x${height}`,
			t: moment().unix(),
			page: location.href
		})
		// 手机里播放视频纹理
		if (isMobile) {
			if (state.editHook) {
				var aniMtls = state.editHook.scene.getAnimatedMaterials()
				for (var b = aniMtls.next(); !b.done; b = aniMtls.next()) {
					b.value.play()
				}
			}
		}
	}, [state])
	useEffect(() => {
		setShow(true)
	}, [])
	useEffect(() => {
		if (!!state.jmt && !!isAuto && !!state.editHook) {
			setShow(false)
			eventBus.emit("scene.show")
		}
	}, [state])
	useEffect(() => {
		if (!!state.jmt) {
			eventBus.emit("scene.openVideo.show", false)
		}
	}, [state])
	console.log(show)
	return (
		<div id="SceneLoading" hidden={!show}>
			<div className="enter">
				{/* <Progress
					type="circle"
					width={65}
					percent={step}
					size="small"
					trailColor="#fff"
					strokeColor="#09C9FF"
					style={{
						display: step === 100 || !!state.jmt ? "none" : "inline-block"
					}}
				/> */}
				<div className={classNames("cube", { hideAnimation: step === 100 })}>
					<div className="sides">
						<div className="top"></div>
						<div className="right"></div>
						<div className="bottom"></div>
						<div className="left"></div>
						<div className="front"></div>
						<div className="back"></div>
					</div>
				</div>
				<Button
					className="enterHall"
					type="default"
					shape="round"
					hidden={(step < 100 && !state.jmt) || !!isAuto}
					onClick={enterHall}
				>
					{Intl.formatMessage({
						id: "showcase.show"
					})}
				</Button>
			</div>
		</div>
	)
}
export default SceneLoading
