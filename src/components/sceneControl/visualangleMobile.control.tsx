import commonFunc from "@/utils/common.func"
import { Popover } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"
import "./visualangleMobile.control.less"
const VisualAngleControl = () => {
	const mobile = commonFunc.browser().mobile
	const Intl = useIntl()
	//!!!!!!!!!!
	// 相机位列表
	const { state: JMK } = useContext(JMKContext)
	const tourList: any[] = useMemo(() => JMK.editHook?.getTours() || [], [JMK.editHook])
	const viewsList: any[] = useMemo(() => JMK.editHook?.getViews() || [], [JMK.editHook])
	useEffect(() => {
		if (JMK.sceneCofing && !!JMK.sceneCofing.info.sceneObjs && !!JMK.editHook) {
			const sceneObjs = {
				views: JMK.sceneCofing.info.sceneObjs.views,
				tours: JMK.sceneCofing.info.sceneObjs.tours
			}
			JMK.editHook?.loadViewsAndTours(sceneObjs)
		}
	}, [JMK])
	const [show, setShow] = useState(false)
	const [select, setSelect] = useState("")
	const [play, setPlay] = useState(false)
	const options = useMemo(
		() => [
			{
				txt: Intl.formatMessage({ id: "scene.visual.3d", defaultMessage: "三维" }),
				show,
				// key: "rule-_3d",
				key: require("../../assets/mobile-font/sanwei.png"),
				name: "orbit",
				key1: require("../../assets/mobile-font/sanwei1.png")
			},
			{
				txt: Intl.formatMessage({ id: "scene.visual.bird", defaultMessage: "鸟瞰" }),
				show,
				// key: "rule-pingmiantu",
				key: require("../../assets/mobile-font/pingmiantu.png"),
				name: "top",
				key1: require("../../assets/mobile-font/pingmiantu2.png")
			},
			{
				txt: Intl.formatMessage({ id: "scene.visual.roam", defaultMessage: "漫游" }),
				show: true,
				// key: "rule-manyou",
				key: require("../../assets/mobile-font/manyou.png"),
				name: "walk",
				key1: require("../../assets/mobile-font/manyou2.png")
			}
		],
		[show, select]
	)

	const Select = useCallback(
		(name: string) => (e: any) => {
			e.stopPropagation()
			setSelect(name)
			switch (name) {
				case "orbit":
					const orbitView = viewsList.find(m => m.name == "Orbit view")
					JMK.editHook.switchToView(orbitView?.name)
					break
				case "top":
					const topView = viewsList.find(m => m.name == "Top view")
					JMK.editHook.switchToView(topView?.name)
					break
				case "walk":
					const walkView = viewsList.find(m => m.name == "Walk view")
					JMK.editHook.switchToView(walkView?.name)
					break
				default:
			}
		},
		[JMK, select, viewsList]
	)
	const changeStatus = useCallback(() => {
		setPlay(!play)
		if (!play) {
			setSelect("")
		}
	}, [JMK, play])
	// 有配置视角才显示
	useEffect(() => {
		const hasorbitView = viewsList.find(m => m.name == "Orbit view")
		const hastopView = viewsList.find(m => m.name == "Top view")
		const haswalkView = viewsList.find(m => m.name == "Walk view")

		if (!!hasorbitView || !!hastopView || !!haswalkView) {
			setShow(true)
		} else {
			setShow(false)
		}
		// setShow(true)
	}, [viewsList])
	return (
		<div className={classNames("control-item-mobile", { on: play })} onClick={changeStatus} hidden={!show}>
			<Popover
				trigger={["click"]}
				content={
					<>
						{options.map(m => {
							return (
								<div className={classNames("visualangle-item")} key={m.key} onClick={Select(m.name)}>
									<img
										src={select == m.name ? m.key1 : m.key}
										className={"item-img-mobile"}
										style={{ width: "3.2vw", height: "3.2vw" }}
									></img>
									<span>{m.txt}</span>
								</div>
							)
						})}
					</>
				}
			>
				<img
					src={
						!!play
							? require("../../assets/mobile-font/shijiao(2).png")
							: require("../../assets/mobile-font/shijiao(1).png")
					}
					// src={require("../../assets/mobile-font/shijiao(1).png")}
					className={"item-img-mobile"}
				></img>
				<div>视角</div>
			</Popover>
		</div>
	)
}
export default VisualAngleControl
