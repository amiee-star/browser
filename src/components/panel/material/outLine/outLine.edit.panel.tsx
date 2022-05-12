import { useMini } from "@/utils/use.func"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { Button, Card, Col, Row, Tree } from "antd"
import { FormattedMessage, useIntl } from "umi"
import { panelContext } from "@/components/provider/panel.context"
// import { useEditHook } from "@/components/jmk/jmk.engine"

import { JMKContext } from "@/components/provider/jmk.context"
import serviceLocal from "@/services/service.local"
import { doAlone, doTree } from "@/utils/array.fix"

import Slide from "../../../transitions/slide"
import "./outLine.edit.panel.less"
import classNames from "classnames"
import commonFunc from "@/utils/common.func"
interface Props {
	isShowOutLine?: boolean
	closePanel?: Function
}
interface Item {
	key?: number
	pid?: number
	title?: string
	config?: {
		tour: any
		pic: string
	}
}
interface treeNodeInfo {
	dropToGap: any
	dropPosition: number
	dragNode: any
	node: any
}
interface TreeItem extends Item {
	children?: TreeItem[]
}
const _OutLineEdit: React.FC<Props> = props => {
	const { closePanel } = props
	const mobile = commonFunc.browser().mobile
	const Intl = useIntl()
	// const JMKHook = useEditHook()
	const { state } = useContext(JMKContext)
	const { state: panelState, dispatch } = useContext(panelContext)
	const [treeData, setTreeData] = useState<TreeItem[]>([])
	const [done, setDone] = useState(false)
	useEffect(() => {
		serviceLocal.getOutLine(state.sceneName, "").then(res => {
			if (res.code == "200") {
				setTreeData(res.data)
				setDone(true)
			}
		})
	}, [])

	useEffect(() => {
		setShowOutLine(true)
	}, [])
	// 是否显示大纲面板
	const [ShowOutLine, setShowOutLine] = useState(true)
	// 隐藏面板
	const onClose = useCallback(() => closePanel(), [])
	const titleRender = useCallback(
		nodeData => (
			<Row justify="space-between" align="middle">
				<Col className={"nodeTitle"}>{nodeData.title}</Col>
			</Row>
		),
		[treeData]
	)

	// 拖拽
	const onDrop = (info: treeNodeInfo) => {
		const dropKey = info.node.key
		const dragKey = info.dragNode.key
		const dropPos = info.node.pos.split("-")
		const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

		const loop = (data: string | any[], key: any, callback: any) => {
			for (let i = 0; i < data.length; i++) {
				if (data[i].key === key) {
					return callback(data[i], i, data)
				}
				if (data[i].children) {
					loop(data[i].children, key, callback)
				}
			}
		}
		const data = doTree(treeData, "key", "pid")

		let dragObj: any
		loop(data, dragKey, (item: any, index: any, arr: any[]) => {
			arr.splice(index, 1)
			dragObj = item
		})

		if (!info.dropToGap) {
			loop(data, dropKey, (item: { children: any[] }) => {
				item.children = item.children || []
				item.children.unshift(dragObj)
			})
		} else if ((info.node.props.children || []).length > 0 && info.node.props.expanded && dropPosition === 1) {
			loop(data, dropKey, (item: { children: any[] }) => {
				item.children = item.children || []
				item.children.unshift(dragObj)
			})
		} else {
			let ar: any[] = []
			let i = 0
			loop(data, dropKey, (item: any, index: number, arr: any[]) => {
				ar = arr
				i = index
			})
			if (dropPosition === -1) {
				ar.splice(i, 0, dragObj)
			} else {
				ar.splice(i + 1, 0, dragObj)
			}
		}

		setTreeData(data)
	}

	// 点击树节点
	const handleTreeNode = useCallback(
		(key: number[]) => {
			let item: Item = {}
			let list = doAlone(treeData, "children")
			item = list.find(m => m.key === key[0])
			if (!!item?.config?.tour) {
				const { cameraPos, rotation } = item.config.tour

				// editor 对象moveAndHeadTo方法
				state.jmt.getViewer().moveAndHeadTo(cameraPos, rotation)
			}
			setTreeData(doTree(list, "key", "pid"))
		},
		[treeData, state]
	)

	return (
		<Slide direction="left" in unmountOnExit={!treeData.length}>
			<Card
				id={!!mobile ? "mobileOutLineCard" : "OutLineCard"}
				bordered={false}
				title={<FormattedMessage id="scene.navigation" />}
				extra={
					<Button onClick={onClose} type="text">
						<i className={classNames("rulefont rule-shensuo")}></i>
					</Button>
				}
			>
				<div id="OutLineEdit">
					<Tree
						className="draggable-tree"
						draggable
						blockNode
						titleRender={titleRender}
						onDrop={onDrop}
						treeData={doTree(treeData, "key", "pid")}
						onSelect={handleTreeNode}
					/>
				</div>
			</Card>
		</Slide>
	)
}

const OutLineEdit = useMini(_OutLineEdit)
export default OutLineEdit
