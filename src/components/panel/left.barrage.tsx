import React, { useCallback, useEffect, useState, useRef, ChangeEvent, useContext } from "react"
import "./left.barrage.less"
import { Input, Space, notification, Button, Badge, Tooltip } from "antd"
import classNames from "classnames"
import { useIntl } from "umi"
import eventBus from "@/utils/event.bus"
import service from "@/services/service.scene"
import { JMKContext } from "../provider/jmk.context"
import Messagecontrol from "../sceneControl/message.control"
import { QRNormal } from "react-qrbtf"
const { Search } = Input

const LeftBarrage: React.FC = () => {
	const Intl = useIntl()
	const timer = useRef<NodeJS.Timeout>()
	const [show, setShow] = useState(false)
	const [open, setOpen] = useState(true)
	const [content, setContent] = useState("")
	const [barrage, setBarrage] = useState("")
	const [top, setTop] = useState(20)
	const { state } = useContext(JMKContext)
	let lock = true
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
	useEffect(() => {
		eventBus.on("scene.tour.show", () => {
			setTop(top + 167)
			let barrage = document.getElementsByClassName("leftbarrage")[0]
			if (barrage) {
				barrage.parentElement.style.marginBottom = "100px"
			}
		})
		eventBus.on("scene.tour.hidden", () => {
			setTop(top - 167)
			let barrage = document.getElementsByClassName("leftbarrage")[0]
			if (barrage) {
				barrage.parentElement.style.marginBottom = "-67px"
			}
		})
	}, [top])

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
				bottom: top + 150,
				duration: 10,
				style: {
					boxShadow: "none"
				}
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
		},
		[open]
	)
	const [count, setCount] = useState(0)
	const addCount = useCallback(() => setCount(count + 1), [count])
	return (
		<div id="wrapBox" hidden={!show} style={{ bottom: top }}>
			<div id="LeftBarrage">
				<Space direction="vertical">
					<Search
						width={400}
						placeholder={Intl.formatMessage({
							id: "scene.barrage.placehold"
						})}
						enterButton={Intl.formatMessage({
							id: "scene.barrage.send"
						})}
						size="large"
						suffix={
							<i
								onClick={openList}
								className={!!open ? classNames("rulefont rule-danmuguan") : classNames("rulefont rule-danmukai")}
								style={{ cursor: "pointer" }}
							/>
						}
						prefix={<i className={classNames("rulefont rule-bianji1")} />}
						onSearch={send}
						value={content}
						onChange={change()}
					/>
				</Space>
			</div>
			<div id="rightBtnBox">
				{/* 4Dv1.0.2此处屏蔽 移到主操作栏 */}
				{/* <div className="border-radius-linear-gradient">
					<Badge count={count}>
						<Button
							onClick={addCount}
							className="border-radius-linear-gradient-content"
							type="primary"
							icon={<i className={classNames("rulefont rule-dianzan3")} />}
						>
							<span>
								{Intl.formatMessage({
									id: "scene.giveLike.btn"
								})}
								<i></i>
							</span>
						</Button>
					</Badge>
				</div> */}
				{/* 留言 */}

				{/* <Messagecontrol /> */}

				{/* <div className="border-radius-linear-gradient">
					<Tooltip
						placement="top"
						title={
							<div style={{ background: "#fff" }}>
								<QRNormal value={location.href} size={120} />
							</div>
						}
						trigger="click"
					>
						<Button type="primary" icon={<i className={classNames("rulefont rule-fenxiang")} />}>
							<span>
								{Intl.formatMessage({
									id: "scene.share.btn"
								})}
								<i></i>
							</span>
						</Button>
					</Tooltip>
				</div> */}
			</div>
		</div>
	)
}

export default LeftBarrage
