import eventBus from "@/utils/event.bus"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { DownOutlined, PauseCircleOutlined, PlayCircleOutlined, UpOutlined, UpSquareOutlined } from "@ant-design/icons"
import { Card, Select, Space, Typography, Button } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"
import Slide from "../transitions/slide"
import Swiper from "react-id-swiper"
import "swiper/css/swiper.min.css"
import TourSlide from "./tour.slide"
import { rgba } from "@/lib/@react-spring/shared/cjs/colorMatchers"

const _TourUI: React.FC = () => {
	const forceUpdate = useForceUpdate()
	const { state: JMK } = useContext(JMKContext)
	// 相机位列表
	const tourList: any[] = useMemo(() => JMK.editHook?.getTours() || [], [JMK.editHook])
	const viewsList: any[] = useMemo(() => JMK.editHook?.getViews() || [], [JMK.editHook])
	// const tourList: any[] = useMemo(() => JMK.sceneCofing.info.sceneObjs?.tours || [], [JMK.editHook])
	// const viewsList: any[] = useMemo(() => JMK.sceneCofing.info.sceneObjs?.views || [], [JMK.editHook])
	const [currentViews, setCurrentViews] = useState([])
	const [isRunning, setIsRunning] = useState(false)
	const [tourIndex, setTourIndex] = useState(-1)
	const [tourValue, setTourValue] = useState(-1)
	const paddingLeft = useMemo(() => {
		return 0
	}, [JMK])
	const paddingRight = useMemo(() => {
		return 0
	}, [JMK])
	const sceneChanged = useCallback(() => {
		setTimeout(() => {
			forceUpdate()
		}, 0)
	}, [])
	useEffect(() => {
		eventBus.off("jmk.sceneChanged", sceneChanged).on("jmk.sceneChanged", sceneChanged)
		eventBus.off("tour.change", sceneChanged).on("tour.change", sceneChanged)
		return () => {
			eventBus.off("jmk.sceneChanged", sceneChanged)
			eventBus.off("tour.change", sceneChanged)
		}
	}, [])
	const changeStatus = useCallback(
		isRunning => () => {
			setIsRunning(isRunning)
			if (openTour.changeBGM && JMK.sceneAudio) {
				if (isRunning) {
					JMK.sceneAudio.play()
				} else {
					JMK.sceneAudio.pause()
				}
			}
		},
		[JMK]
	)
	useEffect(() => {
		JMK.editHook && JMK.editHook.getAutoTour().addEventListener("tourStopped", changeStatus(false))
		JMK.editHook && JMK.editHook.getAutoTour().addEventListener("tourStarted", changeStatus(true))
	}, [JMK])
	// 下拉选择tour
	const tourChange = useCallback(
		value => {
			JMK.editHook.getAutoTour().stop()
			setTourValue(value)
			// setCurrentTour(tourList.find(item => item.id === value))
			if (!!value) {
				setTourIndex(tourList.findIndex(item => item.id === value))
			} else {
				setTourIndex(-1)
			}
		},
		[tourList, JMK]
	)
	useEffect(() => {
		eventBus.on("scene.tour.play", e => {
			if (!!e) {
				JMK.editHook.getAutoTour().stop()
				JMK.editHook.getAutoTour().start(tourIndex)
			} else {
				JMK.editHook.getAutoTour().stop()
			}
		})
		return () => {
			eventBus.off("scene.tour.play")
		}
	}, [JMK, tourIndex])
	const uiStyle = useMemo(
		() => ({
			box: {
				width: "100vw",
				paddingLeft,
				paddingRight,
				transition: "all .3s",
				zIndex: 0,
				background: "#020202",
				opacity: 0.6
			},
			body: { padding: 0 }
		}),
		[]
	)
	useEffect(() => {
		if (tourIndex == -1) {
			setCurrentViews(viewsList.filter(m => !m.internal))
		} else {
			setCurrentViews(tourList[tourIndex].views.map((m: any) => viewsList.find(n => n.id === m.id)))
		}
	}, [tourIndex, viewsList, tourList])
	const openTour: any = useMemo(() => (JMK.sceneCofing ? JMK.sceneCofing.info.openTour : {}), [JMK])
	const [sceneShow, setSceneShow] = useState(false)
	useEffect(() => {
		eventBus.on("scene.open", () => {
			setSceneShow(true)
		})
	}, [])
	useEffect(() => {
		if (JMK.editHook && sceneShow) {
			const UrlData = new URL(location.href)
			const tourData = UrlData.searchParams.get("tour")
			const viewData = UrlData.searchParams.get("view")
			const showRoomType = UrlData.searchParams.get("showRoomType")

			if (!!tourData) {
				const index = tourList.findIndex(item => item.id === tourData)
				setTourIndex(index)
				setTourValue(tourData)
				const view = viewsList.find((item: any) => item.id == viewData)
				JMK.editHook.teleport.switchToView(view, 3)
				if (showRoomType === "0") {
					setTimeout(function () {
						JMK.editHook.getAutoTour().start(index)
					}, 3000)
				}

				//
			}
			if (!tourData && openTour.show) {
				const index = tourList.findIndex(item => item.id === openTour.tour)
				setTourIndex(index)
				setTourValue(openTour.tour)
				// JMK.editHook.getAutoTour().start(index)
			}
		}
	}, [JMK.editHook, sceneShow])
	return (
		<div id="TourUI" style={uiStyle.box}>
			<Card
				title={
					<Space direction="horizontal">
						<Typography.Text>导览路径</Typography.Text>
						{/* {!isRunning && (
							<>
								<Button type="link" icon={<PlayCircleOutlined />} onClick={play} />
							</>
						)}
						{isRunning && (
							<>
								<Button type="link" icon={<PauseCircleOutlined />} onClick={stopTour} />
							</>
						)} */}
						<div hidden={tourList.length > 1 ? false : true}>
							<Select
								dropdownMatchSelectWidth={false}
								// defaultValue={-1}
								defaultActiveFirstOption={true}
								value={tourValue}
								options={[{ label: "所有", value: -1 }].concat(
									tourList.map(item => {
										return {
											label: item.name,
											value: item.id
										}
									})
								)}
								onChange={tourChange}
							/>
						</div>
					</Space>
				}
				bodyStyle={uiStyle.body}
				// extra={
				// 	<Space>
				// 		<Select
				// 			dropdownMatchSelectWidth={false}
				// 			defaultValue=""
				// 			options={[{ label: "所有", value: "" }].concat(
				// 				tourList.map(item => {
				// 					return {
				// 						label: item.name,
				// 						value: item.id
				// 					}
				// 				})
				// 			)}
				// 			onChange={tourChange}
				// 		/>
				// 		<Button onClick={toggleBody} ghost icon={showBody ? <DownOutlined /> : <UpOutlined />} />
				// 	</Space>
				// }
			>
				<Slide direction="up" in={true} unmountOnExit={!currentViews.length}>
					<TourSlide data={currentViews.filter((m: { hideFromMenu: boolean }) => !m.hideFromMenu)} />
				</Slide>
			</Card>
		</div>
	)
}
const TourUI = useMini(_TourUI)

export default TourUI
