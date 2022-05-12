import { assetData } from "@/interfaces/extdata.interface"
import { coverData, JMTInterface, loadTextureParam, viewExtobj } from "@/interfaces/jmt.interface"
import eventBus from "@/utils/event.bus"
import { useMini } from "@/utils/use.func"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { JMKContext } from "../provider/jmk.context"

interface Props {
	dataUrl: string
	sceneName: string
	edit?: boolean
	coverData: coverData
}
const _JMKEngine: React.FC<Props> = props => {
	const { dataUrl, sceneName, coverData } = props
	const [open, setOpen] = useState(!(coverData.info.usePwd || coverData.info.openingVideo.show))
	const JMTRef = useRef<JMTInterface>(null)
	const { state, dispatch } = useContext(JMKContext)
	const engineBox = useRef<HTMLDivElement>(null)
	const loadProgress = useCallback((n: any) => {
		const percent = n.totalDone() / n.total
		eventBus.emit("jmk.loading", percent)
	}, [])
	const assetClickCallBack = useCallback((e: { asset: assetData }) => {
		eventBus.emit("jmk.assetSelected", e.asset)
	}, [])
	const assetLoadingProgressCallBack = useCallback((e: any) => {
		const percents = e.data.current / e.data.total
		eventBus.emit("jmk.asset.loading", percents)
	}, [])
	const onSceneLoaded = useCallback(
		app => (n: any, option: any) => {
			if (!option.switched) {
				n.removeEventListener("assetClick", assetClickCallBack)
				n.addEventListener("assetClick", assetClickCallBack)
				n.removeEventListener("assetLoadingProgress", assetLoadingProgressCallBack)
				n.addEventListener("assetLoadingProgress", assetLoadingProgressCallBack)
				n.loadAssets(coverData.info.extobjs || [])
			}
			eventBus.emit("scene.view.shuttleVideo", false)
			dispatch({
				type: "set",
				payload: {
					jmt: JMTRef.current,
					editHook: n,
					app
				}
			})
		},
		[props, state]
	)
	const frameLoad = useCallback((e: Event) => {
		const iframe = e.currentTarget as HTMLIFrameElement
		const { JMT } = iframe.contentWindow
		JMTRef.current = JMT
		const app: any = new JMT.App()
		app.ui.loadProgress = loadProgress
		const config: any = new JMT.SceneLoadConfig()
		config.el = "s3d-canvas"
		config.assetsUrl = dataUrl
		config.YUp = true
		config.onSceneLoaded = onSceneLoaded(app)
		app.start(config)
	}, [])
	useEffect(() => {
		if (!open) return
		const iframe = document.createElement("iframe")
		iframe.frameBorder = "0"
		iframe.allowFullscreen = true
		iframe.id = "f3d-canvas"
		iframe.width = "100%"
		iframe.height = "100%"
		iframe.src = `${window.publicPath}jmk/index.html#autoplay`
		iframe.onload = frameLoad
		engineBox.current.appendChild(iframe)
	}, [open])
	useEffect(() => {
		eventBus.on("scene.open", () => setOpen(true))
		return () => {
			eventBus.off("scene.open")
		}
	}, [])
	return <div ref={engineBox} className="full hidden" />
}
const JMKEngine = useMini(_JMKEngine)
export default JMKEngine
