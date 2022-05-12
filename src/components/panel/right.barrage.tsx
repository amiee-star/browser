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

const RightBarrage: React.FC = () => {
	const Intl = useIntl()
	const timer = useRef<NodeJS.Timeout>()
	const [show, setShow] = useState(false)
	const [open, setOpen] = useState(true)
	const [content, setContent] = useState("")
	const [barrage, setBarrage] = useState("")
	const [top, setTop] = useState(20)
	const { state } = useContext(JMKContext)
	let lock = true
	const send = useCallback(val => {
		if (!lock) return
		lock = false
		setContent("")
		if (!!val) {
			service
				.barrageSubmit({ content: val })
				.then(res => {
					setBarrage(val)
				})
				.finally(() => {
					lock = true
				})
		} else {
			lock = true
		}
	}, [])
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
				barrage.parentElement.style.marginBottom = "167px"
			}
		})
		eventBus.on("scene.tour.hidden", () => {
			setTop(top - 167)
			let barrage = document.getElementsByClassName("leftbarrage")[0]
			if (barrage) {
				barrage.parentElement.style.marginBottom = "0px"
			}
		})
	}, [top])

	const defaultBarrageList = useRef([])
	useEffect(() => {
		if (!!open && !!show) {
			service
				.defaultBarrage({
					limit: 20,
					offset: 0
				})
				.then(res => {
					defaultBarrageList.current = res.data.rows
				})

			let id = 0

			timer.current = setInterval(async () => {
				let index = Math.floor(Math.random() * defaultBarrageList.current.length)

				service.newestbarrage({ id }).then(res => {
					if (res.data) {
						id = res.data.id

						getBarrage(res.data.content)
					} else {
						defaultBarrageList.current.length && getBarrage(defaultBarrageList.current[index].content)
					}
				})
			}, 5000)
		}
		if (!open) {
			clearInterval(timer.current)
			notification.destroy()
		}
	}, [open, show])

	const getBarrage = useCallback(
		c => {
			if (open && show) {
				notification.info({
					message: c,
					placement: "bottomLeft",
					icon: <></>,
					closeIcon: <></>,
					className: "leftbarrage",
					bottom: top + 70,
					duration: 10,
					style: {
						boxShadow: "none"
					}
				})
			}
		},
		[open, show]
	)

	useEffect(() => {
		eventBus.on("scene.show", () => {
			// setShow(true)
			// setOpen(true)
			setShow(state.sceneCofing.info.danmu)
			setOpen(state.sceneCofing.info.danmu)
		})
		return () => {
		}
	}, [])

	return (
		<div id="wrapBox" hidden={!show} style={{ bottom: top }}>
			<div id="rightBtnBox">
				<div className="border-radius-linear-gradient">
					<Badge>
						<Button
							onClick={addCount}
							className="border-radius-linear-gradient-content"
							type="primary"
							icon={<i className={classNames("iconfont icon-lianjie")} />}
						>
							<span>
								{Intl.formatMessage({
									id: "scene.giveLike.btn"
								})}
								<i></i>
							</span>
						</Button>
					</Badge>
				</div>
			</div>
		</div>
	)
}

export default RightBarrage
