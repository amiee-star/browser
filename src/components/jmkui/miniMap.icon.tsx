import { coverMinimap } from "@/interfaces/jmt.interface"
import { useMini } from "@/utils/use.func"
import Icon from "@ant-design/icons"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { SpringValue } from "react-spring"
import { useEditHook } from "../jmk/jmk.engine"
import { JMKContext } from "../provider/jmk.context"
import { debounce } from "../transitions/util"
import { positionSvg } from "../utils/svg.icon"

interface Props {
	imgData: any
	miniMap: Partial<coverMinimap>
	x: number
	y: number
	scale: number
}

const _MiniMapIcon: React.FC<Props> = props => {
	const { imgData, miniMap, x, y, scale } = props
	const iconBox = useRef<HTMLDivElement>()
	const { state } = useContext(JMKContext)
	const JMKHook = useEditHook()
	const SceneBBox: any = useMemo(() => (state.editHook ? state.editHook.getSceneBBox() : {}), [state.editHook])
	const [centerPositin, setCenterPosition] = useState({
		x: 0,
		y: 0
	})
	// 实际上一米 在地图上的比例
	const [TotalScale, setTotalScale] = useState(0)
	useEffect(() => {
		setTotalScale((miniMap.rect * imgData.width * scale) / imgData.sourceWidth)
	}, [miniMap, imgData, scale])

	// 化地图的位置
	const [imgPosition, setImgPosition] = useState({
		x: 0,
		y: 0
	})
	useEffect(() => {
		setImgPosition({
			x: x + 100 - imgData.width / 2,
			y: y + 100 - imgData.width / 2
		})
	}, [x, y, imgData])

	// 相机的绝对坐标
	const [cameraPosition, setCameraPositio] = useState([])
	useEffect(() => {
		setCameraPositio(JMKHook.getCameraPosition())
	}, [])

	// 相机的相对位置
	const [cameraRelative, setCameraRelative] = useState({
		x: 0,
		y: 0
	})
	useEffect(() => {
		setCameraRelative({
			x: cameraPosition[0] - SceneBBox.min.x,
			y: cameraPosition[1] - SceneBBox.min.y
		})
	}, [cameraPosition])

	useEffect(() => {
		if (state.editHook) {
			setCenterPosition({
				x: cameraRelative.x * TotalScale + imgPosition.x,
				y: cameraRelative.y * TotalScale + imgPosition.y
			})
		}
	}, [state.editHook, imgPosition, cameraRelative, TotalScale])

	return (
		<div
			className="minMapIcon"
			style={{
				transform: `translate(${centerPositin.x}px,${centerPositin.y}px)`
			}}
		>
			<Icon component={positionSvg} />
		</div>
	)
}

const MiniMapIcon = useMini(_MiniMapIcon)
export default MiniMapIcon
