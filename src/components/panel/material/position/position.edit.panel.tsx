import { useMini } from "@/utils/use.func"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Button, Card, Form, Input, Select, TreeSelect } from "antd"
import { FormattedMessage, useIntl } from "umi"
import { panelContext } from "@/components/provider/panel.context"
import { JMKContext } from "@/components/provider/jmk.context"
import serviceLocal from "@/services/service.local"
import { doAlone, doTree } from "@/utils/array.fix"
import { JMTInterface } from "@/interfaces/jmt.interface"
import fileType from "@/constant/file.type"
import eventBus from "@/utils/event.bus"
import Slide from "@/components/transitions/slide"
import classNames from "classnames"
import "./position.edit.panel.less"
import urlFunc from "@/utils/url.func"
import { SearchOutlined } from "@ant-design/icons"
import commonFunc from "@/utils/common.func"
const { Option } = Select
interface Props {
	closePanel: Function
}
interface Item {
	pid?: number
	key?: number
	name?: string
	value?: number
	config: {
		tour: any
		pic: string
	}
	order?: number
}
interface TreeItem extends Item {
	children?: TreeItem[]
}
const _PositionEdit: React.FC<Props> = props => {
	const { closePanel } = props
	const mobile = commonFunc.browser().mobile
	const Intl = useIntl()
	const JMTRef = useRef<JMTInterface>(null)
	const [form] = Form.useForm()
	const { state } = useContext(JMKContext)
	const [treeData, setTreeData] = useState<TreeItem[]>([])
	const [done, setDone] = useState(false)
	const [filter, setFilter] = useState({})
	const allData = useRef([])
	// 获取大纲数据
	useEffect(() => {
		serviceLocal.getOutLine(state.sceneName, "").then(res => {
			if (res.code == "200") {
				res.data = JSON.parse(JSON.stringify(res.data).replace(/title/g, "title").replace(/key/g, "value"))
				setTreeData(
					[{ title: "全部", pid: 0, value: 0, config: { tour: "", pic: "" } }].concat(doTree(res.data, "value", "pid"))
				)
				setDone(true)
			}
		})
	}, [])
	const [hasDefClass, setHasDefClass] = useState(false)
	const [classList, setClassList] = useState([])
	// 获取分类数据
	useEffect(() => {
		serviceLocal.getExhibitClass(state.sceneName, "").then(res => {
			if (res.code == "200") {
				res.data = JSON.parse(JSON.stringify(res.data).replace(/name/g, "title").replace(/id/g, "value"))
				setClassList([{ title: "全部", value: 0 }].concat(res.data))
				setHasDefClass(true)
			}
		})
	}, [])
	const [positionData, setPositionData] = useState([])
	// 获取展厅定位数据
	useEffect(() => {
		// serviceLocal.getExhibitPosition(state.sceneName, "").then(res => {
		// 	if (res.code == "200") {
		// 		setPositionData(res.data)
		// 		allData.current = res.data
		// 	}
		// })
	}, [])
	// 隐藏定位面板
	const onClose = useCallback(() => {
		closePanel()
	}, [])

	// 大纲选择树
	const [outLineVal, setOutLineVal] = useState()
	const onChangeOutLineTree = useCallback(value => {
		setOutLineVal(value)
	}, [])
	// 分类
	const [classVal, setClassVal] = useState()
	const onChangeClassTree = useCallback(value => {
		setClassVal(value)
	}, [])
	// 提交

	useEffect(() => {
		const filterValue = Object.keys(filter)
			.map(m => {
				if (!!filter[m]) {
					if (m === "name") {
						// return { key: m, func: (val: string) => val.indexOf(filter[m]) > -1 }
						return { key: m, func: (val: string) => (!!val ? val.indexOf(filter[m]) > -1 : false) }
					} else {
						return {
							key: m,
							func: (val: string) => {
								return val === filter[m]
							}
						}
					}
				}
			})
			.filter(m => !!m)
		let data: any[] = []
		if (filterValue.length) {
			filterValue.forEach(filterItem => {
				data = !data.length
					? allData.current.filter(item => filterItem.func(item[filterItem.key]))
					: data.filter(item => filterItem.func(item[filterItem.key]))
			})
		} else {
			data = [...allData.current]
		}

		setPositionData(data)
	}, [filter])
	const onValuesChange = useCallback(data => setFilter({ ...filter, ...data }), [filter])
	const [currentIndex, setCurrentIndex] = useState(0)
	// const handlePosition = useCallback(
	// 	item => () => {
	// 		if (!!item?.config.tour) {
	// 			const { cameraPos, rotation } = item.config.tour
	// 			console.log(state.jmt.getViewer())
	// 			state.jmt.getViewer().moveAndHeadTo(cameraPos, rotation)
	// 		}
	// 	},
	// 	[positionData]
	// )

	const handlePosition = useCallback(
		index => () => {
			setCurrentIndex(index)
			if (!!positionData[index]?.config.tour) {
				const { cameraPos, rotation } = positionData[index].config.tour
				state.jmt.getViewer().moveAndHeadTo(cameraPos, rotation)
			}
		},
		[positionData]
	)
	useEffect(() => {
		if (!!positionData[currentIndex]?.config.tour) {
			const { cameraPos, rotation } = positionData[currentIndex].config.tour
			state.jmt.getViewer().moveAndHeadTo(cameraPos, rotation)
		}
		if (currentIndex == 0) {
			console.log("第一个")
			eventBus.emit("scene.position.0", 0)
		} else if (currentIndex == positionData.length) {
			console.log("最后一个")
			eventBus.emit("scene.position.last", 0)
		} else {
			console.log("都显示")
			eventBus.emit("scene.position.show", 0)
		}
	}, [currentIndex, positionData])
	useEffect(() => {
		eventBus.on("scene.position.trigger", e => {
			setCurrentIndex(currentIndex + e)
		})
		return () => {
			// eventBus.off("scene.position.trigger")
		}
	}, [currentIndex])
	return (
		// <Grow in={show}>
		<Slide direction="left" in unmountOnExit={!treeData.length}>
			<Card
				id={!!mobile ? "mobilePositionCard" : "positionCard"}
				bordered={false}
				title={<FormattedMessage id="scene.exhibits.position" />}
				extra={
					<Button onClick={onClose} type="text">
						<i className={classNames("rulefont rule-shensuo")}></i>
					</Button>
				}
			>
				<div id="PositionEdit">
					<div>
						<Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onValuesChange={onValuesChange} form={form}>
							<div style={{ display: "flex" }}>
								<Form.Item name="outLine" label="" rules={[]} style={{ marginRight: 10 }}>
									<TreeSelect
										className="formItem"
										style={{ width: 160 }}
										value={outLineVal}
										dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
										treeData={treeData}
										placeholder={<FormattedMessage id="scene.navigation.tip" />}
										treeDefaultExpandAll
									/>
								</Form.Item>
								<Form.Item name="classify" label="" rules={[]}>
									<TreeSelect
										className="formItem"
										style={{ width: 60 }}
										value={classVal}
										dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
										treeData={classList}
										placeholder={<FormattedMessage id="scene.all.tip" />}
										treeDefaultExpandAll
									/>
								</Form.Item>
							</div>

							<Form.Item name="name" label="" rules={[{ message: "请输入1-30个文字", max: 30 }]}>
								<Input
									style={{ width: 230 }}
									className="formInput"
									placeholder="请输入展品关键词"
									suffix={
										<Button type="text" style={{ color: "#666666" }}>
											<SearchOutlined />
										</Button>
									}
								/>
							</Form.Item>
						</Form>
					</div>
					<div className="positionItem">
						{positionData.map((item, index) => {
							return (
								<div
									key={item.id}
									data-id={item.id}
									className="positionItem-box"
									// onClick={handlePosition(item)}
									onClick={handlePosition(index)}
								>
									<div
										// className="list"
										className={classNames("list", { current: index == currentIndex })}
									>
										<div className={classNames({ imageBox: index == currentIndex })}>
											{item.cover[0] ? (
												<img src={urlFunc.replaceUrl(item.cover[0])} alt="" />
											) : (
												<img className="thumbnail" src={require("@/assets/image/none.png")} alt="" />
											)}
										</div>
										<div className="title">{item.name}</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</Card>
		</Slide>
		// </Grow>
	)
}

const PositionEdit = useMini(_PositionEdit)
export default PositionEdit
