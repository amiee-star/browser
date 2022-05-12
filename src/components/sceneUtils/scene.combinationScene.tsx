import { combinScenes } from "@/interfaces/jmt.interface"
import serviceLocal from "@/services/service.local"
import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useState } from "react"
import "./scene.combinationScene.less"

const CombinationScene = () => {
	const [show, setShow] = useState(false)
	const [sceneShow, setSceneShow] = useState(false)
	// 组合展厅列表
	const [combinationList, setCombinationList] = useState<combinScenes[]>([])
	const [currentCom, setCurrentCom] = useState<combinScenes>()
	const [currentSceneName, setCurrentSceneName] = useState("")
	const getCombinationList = useCallback(() => {
		serviceLocal.combinScenes().then(res => {
			setCombinationList(res.data)
		})
	}, [])
	useEffect(() => {
		eventBus.on("scene.show", () => {
			setSceneShow(true)
			getCombinationList()
		})
	}, [])
	useEffect(() => {
		if (sceneShow && combinationList.length > 0) {
			const UrlData = new URL(location.href)
			const combinationName = UrlData.searchParams.get("combinationName")
			const sceneName = UrlData.searchParams.get("sceneName")
			setCurrentSceneName(sceneName)
			const combination = combinationList.find((item: combinScenes) => item.name === combinationName)
			if (!!combinationName && !!combination && combination.scenes.find(m => m.scene === sceneName)) {
				setCurrentCom(combination)
				setShow(true)
			}
		}
	}, [sceneShow, combinationList])
	const toScene = useCallback(
		item => () => {
			if (window.openUrlInFocusWindow) {
				window.openUrlInFocusWindow(
					window.publicPath + `view.html?sceneName=${item.scene}&combinationName=${currentCom.name}`
				)
			} else {
				window.open(window.publicPath + `view.html?sceneName=${item.scene}&combinationName=${currentCom.name}`)
			}
		},
		[currentSceneName, currentCom]
	)
	const [transType, setTransType] = useState(false)
	const changeType = useCallback(() => {
		setTransType(!transType)
	}, [transType])
	return (
		<div id="CombinationScene" hidden={!show} style={{ left: transType ? "0" : "-200px" }}>
			<div className="SceneLeft">
				{currentCom?.scenes.map((item: any, index) => {
					return (
						<div
							key={item.scene}
							className={classNames({
								sceneCard: true,
								sceneChecked: currentSceneName === item.scene
							})}
							onClick={toScene(item)}
						>
							<img src={item.thumbnail} alt="" />
							<p>{item.scene} </p>
						</div>
					)
				})}
			</div>
			<div className="btnName" onClick={changeType}>
				<p>{currentCom?.btName}</p>
			</div>
		</div>
	)
}

export default CombinationScene
