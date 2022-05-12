import eventBus from "@/utils/event.bus"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { DownOutlined, PauseCircleOutlined, PlayCircleOutlined, UpOutlined, UpSquareOutlined } from "@ant-design/icons"
import { Card, Select, Space, Typography, Button, notification } from "antd"
import React, { ChangeEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

import { JMKContext } from "../provider/jmk.context"
import "./danmuMobile.ui.less"
import "swiper/css/swiper.min.css"
import service from "@/services/service.scene"
import { SearchBar } from "antd-mobile/es/components/search-bar/search-bar"
import { doc } from "prettier"
import { useIntl } from "umi"

const _DanmuMobileUI: React.FC = () => {
	//!!!!!
	const Intl = useIntl()
	const timer = useRef<NodeJS.Timeout>()
	const [show, setShow] = useState(false)
	const [open, setOpen] = useState(true)
	const [content, setContent] = useState("")
	const [barrage, setBarrage] = useState("")
	const [top, setTop] = useState(20)
	let lock = true
	//
	const forceUpdate = useForceUpdate()
	const { state } = useContext(JMKContext)
	const paddingLeft = useMemo(() => {
		return 0
	}, [state])
	const paddingRight = useMemo(() => {
		return 0
	}, [state])
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

	//!!!!!!!!!!!!
	//发送
	const send = useCallback(
		val => {
			if (!lock) return
			lock = false
			setContent("")
			if (!!val) {
				service
					.barrageSubmit({ content: val, view_name: state.sceneName })
					.then(res => {
						setBarrage(val)
					})
					.finally(() => {
						lock = true
					})
			} else {
				lock = true
			}
		},
		[state]
	)
	const change = useCallback(
		() => (e: ChangeEvent<HTMLInputElement>) => {
			let { value } = e.target
			setContent(value)
		},
		[]
	)
	const uiStyle = useMemo(
		() => ({
			box: {
				width: "100vw",
				// 80/750*100vw
				height: "10.67vw",
				display: "flex",
				paddingLeft,
				paddingRight,
				transition: "all .3s",
				zIndex: 0,
				position: "fixed",
				bottom: "14.66666667vw",
				danmuIcon: {
					// 100/750*100vw
					width: "14.67vw",
					height: "100%",
					background: "rgba(37, 40, 62, 0.9)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					danmuImg: {
						width: "5.33vw",
						height: "4.12vw"
					}
				},
				danmuInput: {
					background: "rgba(0, 0, 0, 1)",
					color: "rgba(186, 186, 186, 1)",
					flex: 1
				}
			},
			body: { padding: 0 }
		}),
		[]
	)

	const defaultBarrageList = useRef([])
	// 获取默认弹幕列表
	const getDefaultBarrageList = useCallback(() => {
		if (!!state.sceneName && !!show) {
			service
				.defaultBarrage({
					limit: 9999,
					offset: 0
				})
				.then(res => {
					if (open && show) {
						defaultBarrageList.current = res.data.rows
					} else {
						defaultBarrageList.current = []
					}
				})
		}
	}, [open, show])

	// 随机播放一条默认
	const playDefault = useCallback(() => {
		if (defaultBarrageList.current.length > 0) {
			const defaultIndex = Math.floor(Math.random() * defaultBarrageList.current.length)
			getBarrage(defaultBarrageList.current[defaultIndex].content)
		}
	}, [open, show])
	// 弹幕列表
	const barrageList = useRef([])
	// 获取弹幕列表
	const getBarrageList = useCallback(() => {
		if (!!state.sceneName && !!show) {
			service
				.barrageList({
					limit: 9999,
					offset: 0,
					view_name: state.sceneName
				})
				.then(res => {
					if (open && show) {
						barrageList.current = res.data.rows
						playList(0)
						if (res.data.rows.length > 0) {
							findBarrage(res.data.rows[res.data.rows.length - 1].id)
						} else {
							findBarrage(0)
						}
					} else {
						barrageList.current = []
						defaultBarrageList.current = []
					}
				})
		}
	}, [state, open, show])

	useEffect(() => {
		if (!!state.sceneName) {
			getDefaultBarrageList()
			getBarrageList()
		}
	}, [state, open, show])

	// 查询新弹幕
	const findBarrage = useCallback(
		offset => {
			if (open && show) {
				service
					.barrageList({
						limit: 9999,
						offset: offset,
						view_name: state.sceneName
					})
					.then(res => {
						let newOffset = offset
						if (res.data.rows.length > 0) {
							res.data.rows.forEach(item => {
								getBarrage(item.content)
								newOffset = item.id
							})
						} else {
							playDefault()
						}
						const timet111 = setTimeout(() => {
							findBarrage(newOffset)
							clearTimeout(timet111)
						}, 3000)
					})
			} else {
				return false
			}
		},
		[state, open, show]
	)

	// 播放原来弹幕
	const playList = useCallback(
		num => {
			if (barrageList.current && num < barrageList.current.length) {
				getBarrage(barrageList.current[num].content)
				const timet222 = setTimeout(() => {
					const newNUm = num + 1
					playList(newNUm)
					clearTimeout(timet222)
				}, 3000)
			} else {
				return false
			}
		},
		[state]
	)

	const getBarrage = useCallback(
		c => {
			notification.info({
				message: c,
				placement: "bottomLeft",
				icon: <></>,
				closeIcon: <></>,
				className: "leftbarrage",
				bottom: 100,
				duration: 8,
				style: {
					boxShadow: "none"
				},
				getContainer: () => document.getElementById("BarrageList-box")
			})
		},
		[open, show]
	)

	useEffect(() => {
		eventBus.on("scene.show", () => {
			setShow(state.sceneCofing.info.danmu)
			setOpen(state.sceneCofing.info.danmu)
		})
		return () => {
			notification.destroy()
			clearInterval(timer.current)
		}
	}, [state])

	const openList = useCallback(
		e => {
			setOpen(!open)
			e.preventDefault()
			console.log(open)
			if (!!open) {
				notification.destroy()
			}
		},
		[open]
	)

	return (
		<>
			<div id="danmu-mobile-box" style={uiStyle.box}>
				<div style={uiStyle.box.danmuIcon} onClick={openList}>
					<img
						style={uiStyle.box.danmuIcon.danmuImg}
						src={
							!!open
								? require("../../assets/mobile-font/danmu-end.png")
								: require("../../assets/mobile-font/danmu-start.png")
						}
					></img>
				</div>
				<div style={uiStyle.box.danmuInput}>
					<Space direction="vertical">
						<SearchBar
							icon={null}
							placeholder="发个弹幕来一波..."
							value={content}
							onChange={change}
							clearable={false}
							maxLength={30}
						/>
						<Button className={"sendBtn"} onClick={send}>
							发送
						</Button>
					</Space>
				</div>
			</div>
			{!!open && <div id={"BarrageList-box"}></div>}
		</>
	)
}
const DanmuMobileUI = useMini(_DanmuMobileUI)

export default DanmuMobileUI
