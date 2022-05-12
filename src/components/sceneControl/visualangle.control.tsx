import commonFunc from "@/utils/common.func"
import { Popover } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"
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
	const options = useMemo(
		() => [
			{
				txt: Intl.formatMessage({ id: "scene.visual.3d", defaultMessage: "三维" }),
				show,
				key: "rule-_3d",
				name: "orbit"
			},
			{
				txt: Intl.formatMessage({ id: "scene.visual.bird", defaultMessage: "鸟瞰" }),
				show,
				key: "rule-pingmiantu",
				name: "top"
			},
			{
				txt: Intl.formatMessage({ id: "scene.visual.roam", defaultMessage: "漫游" }),
				show: true,
				key: "rule-manyou",
				name: "walk"
			}
		],
		[show, select]
	)
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
	const Select = useCallback(
		(name: string) => () => {
			switch (name) {
				case "orbit":
					const orbitView = viewsList.find(m => m.name == "Orbit view")
					JMK.editHook.switchToView(orbitView.name)
					break
				case "top":
					const topView = viewsList.find(m => m.name == "Top view")
					JMK.editHook.switchToView(topView.name)
					break
				case "walk":
					const walkView = viewsList.find(m => m.name == "Walk view")
					JMK.editHook.switchToView(walkView.name)
					break
				default:
			}
		},
		[JMK, select, viewsList]
	)
	return (
		// <div className={classNames("control-item", { on: select !== state.mpSdk?.Mode.Mode.INSIDE })}>
		<div className={mobile ? classNames("control-item-mobile") : classNames("control-item")} hidden={!show}>
			<Popover
				trigger={["click", "hover"]}
				content={
					<>
						{options.map(m => {
							return (
								<div className={classNames("control-item")} key={m.key} onClick={Select(m.name)}>
									<i className={classNames("rulefont", m.key)} />
									<div style={{ width: "50px", textAlign: "center" }}>{m.txt}</div>
								</div>
							)
						})}
					</>
				}
			>
				{!mobile && <i className={classNames("rulefont", "rule-shijiao1")} />}
				{!!mobile && (
					<>
						<img
							// src={!!play ? require("../../assets/mobile-font/danmu2.png") : require("../../assets/mobile-font/danmu.png")}
							src={require("../../assets/mobile-font/shijiao(1).png")}
							className={"item-img-mobile"}
						></img>
						<div>视角</div>
					</>
				)}

				{/* {Intl.formatMessage({
					id: "scene.visual.btn",
					defaultMessage: "视角"
				})} */}
			</Popover>
		</div>
	)
}
export default VisualAngleControl
