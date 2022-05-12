import { contentType } from "@/constant/jmk.type"
import { assetData } from "@/interfaces/extdata.interface"

import React, { Suspense, useMemo } from "react"
interface Props {
	data: assetData
}
const ViewBrowser = (props: Props) => {
	const { data } = props

	const ViewEle = useMemo(() => {
		if (data) {
			// if ([contentType.PIC, contentType.GIF, null].includes(data.contentType)) {
			// 	return React.lazy(() => import("@/components/material/image/image.view"))
			// }
			// if (data.contentType === contentType.MP4) {
			// 	return React.lazy(() => import("@/components/material/video/video.view"))
			// }
			// if (data.contentType === contentType.PICGIF) {
			// 	return React.lazy(() => import("@/components/material/image/sequence.view"))
			// }
			// return null
			return React.lazy(() => import("@/components/material/material.index"))
		} else {
			return null
		}
	}, [data])
	return <Suspense fallback={<>loading...</>}>{!!ViewEle && <ViewEle extInfo={data} />}</Suspense>
}

export default ViewBrowser
