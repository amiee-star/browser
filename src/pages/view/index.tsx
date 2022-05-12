import JMKEngine from "@/components/jmk/jmk.engine"
import MinMapUI from "@/components/jmkui/minmap.ui"
import { JMKContext } from "@/components/provider/jmk.context"
import SceneControl from "@/components/sceneUtils/scene.control"
import SceneEvent from "@/components/sceneUtils/scene.event"
import SceneInfo from "@/components/sceneUtils/scene.info"
import SceneIntoBg from "@/components/sceneUtils/scene.intobg"
import SceneIntoTxt from "@/components/sceneUtils/scene.intotxt"
import SceneLoading from "@/components/sceneUtils/scene.loading"
import SceneIntoOpenVideo from "@/components/sceneUtils/scene.openVideo"
import SceneGuide from "@/components/sceneUtils/scene.guide"
import SceneVerification from "@/components/sceneUtils/scene.verification"
import RightMenus from "@/components/panel/right.menus"
import LeftBarrage from "@/components/panel/left.barrage"
import OutLine from "@/components/panel/material/outLine/outLine.edit.panel"
import { PageProps } from "@/interfaces/app.interface"
import { coverData } from "@/interfaces/jmt.interface"
import serviceLocal from "@/services/service.local"
import urlFunc from "@/utils/url.func"
import React, { useContext, useEffect, useMemo, useState } from "react"
import "./index.less"
import FixedUI from "@/components/utils/flexd.ui"
import SceneShuttleVideo from "@/components/sceneUtils/scene.shuttleVideo"
import MaterialLoading from "@/components/sceneUtils/material.loading"
import SceneTextPlay from "@/components/sceneUtils/scene.textplay"
// import CombinationScene from "@/components/sceneUtils/scene.combinationScene"
import commonFunc from "@/utils/common.func"
import serviceScene from "@/services/service.scene"
import { InfoContext } from "@/components/provider/info.context"

// import RightBarrage from "@/components/panel/right.barrage"
const EditorIndex = (props: PageProps) => {
	const mobile = commonFunc.browser().mobile
	const { sceneName } = props.location.query!
	const { state, dispatch } = useContext(JMKContext)
	const { state: infoState, dispatch: infoDispatch } = useContext(InfoContext)
	const realSceneName = useMemo(() => {
		return sceneName ? sceneName.toString() : "example-room"
	}, [sceneName])
	const [data, setData] = useState<coverData>(null)
	useEffect(() => {
		if (realSceneName) {
			serviceLocal.baseScene(realSceneName).then(base => {
				if (base.data.check == 2) window.location.href = "https://www.baidu.com"
				Promise.all([serviceLocal.cover(base.data.tempId), serviceScene.censusInfo({ sceneName: realSceneName })]).then(
					([cover, censusInfo]) => {
						dispatch({
							type: "set",
							payload: {
								sceneCofing: cover.data,
								sceneName: realSceneName,
								baseInfo: base.data
							}
						})
						const { likeCount, viewCount } = censusInfo.data
						infoDispatch({
							type: "set",
							payload: {
								likeCount,
								viewCount
							}
						})
						setData(cover.data)
					}
				)
			})
		}
	}, [realSceneName])

	return (
		data && (
			<>
				<JMKEngine
					coverData={data}
					dataUrl={urlFunc.replaceUrl(`/3d/${state.baseInfo.sceneId}/`)}
					sceneName={realSceneName}
				/>
				<SceneLoading />
				<SceneIntoBg zIndex={3} />
				<SceneIntoTxt zIndex={4} />
				{/* 密码 */}
				<SceneVerification />
				<SceneIntoOpenVideo zIndex={1000} />
				<SceneShuttleVideo zIndex={1000} />
				{/* pc时 显示操作教程图片 */}
				{!mobile && <SceneGuide />}
				<SceneInfo />
				<SceneControl />
				<MinMapUI />
				<SceneTextPlay />
				<SceneEvent />
				<MaterialLoading />
				{/* pc时为右侧大纲，点位操作栏 */}
				{/* {!mobile && <RightMenus />} */}
				{/* 组合展厅 */}
				{/* <CombinationScene /> */}
				{/* pc时显示pc端的 弹幕控件 */}
				{/* {!mobile && <LeftBarrage />} */}
				{/* <RightBarrage /> */}
				<FixedUI model="base" current="OUTLINE">
					<OutLine />
				</FixedUI>
			</>
		)
	)
}

export default EditorIndex
