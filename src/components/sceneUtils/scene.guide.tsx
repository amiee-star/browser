import eventBus from "@/utils/event.bus"
import { Button } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { JMKContext } from "../provider/jmk.context"
import "./scene.guide.less"
interface Props {
	zIndex?: number
}
const SceneGuide: React.FC<Props> = props => {
	const { zIndex = 0 } = props
	const { state } = useContext(JMKContext)
	const [show, setShow] = useState(false)
	const [tourshow, setTourshow] = useState(false)
	useEffect(() => {
		eventBus.on("scene.show", () => {
			if (state.sceneCofing.info.guidePage.show) {
				setShow(true)
			}
			if (state.sceneCofing.info.openTour.show && state.sceneCofing.info.guidePage.show) {
				setTourshow(true)
			}
			if (state.sceneCofing.info.openTour.show && !state.sceneCofing.info.guidePage.show) {
				playTour()
			}
		})
	}, [state])

	const over = useCallback(() => {
		setShow(false)
		tourshow && playTour()
	}, [tourshow])
	const playTour = useCallback(() => {
		eventBus.emit("scene.tour.play", true)
		setTourshow(false)
	}, [state])

	return (
		<>
			{!!show && (
				<div
					id="beginnerGuidance"
					style={{
						zIndex
					}}
				>
					<div className="guideImgBox">
						<div className="guideImg1">
							<img src={require(`../../assets/image/guide/1.png`)}></img>
						</div>
						<div className="guideImg2">
							<img src={require(`../../assets/image/guide/2.png`)}></img>
							<img src={require(`../../assets/image/guide/3.png`)}></img>
						</div>
						<div className="guideImg4">
							<img src={require(`../../assets/image/guide/4.png`)}></img>
						</div>
					</div>
					<Button className="overBtn" onClick={over}>
						完成
					</Button>
				</div>
			)}
		</>
	)
}
export default SceneGuide
