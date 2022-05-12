import ViewBrowser from "@/components/sceneUtils/view.browser"
import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const ViewIndex = (props: PageProps) => {
	const { tempId, id, ispreview } = props.location.query!
	return (
		<ViewBrowser
			tempId={tempId!.toString()}
			id={id!.toString()}
			ispreview={ispreview ? ["true", "1"].includes(ispreview.toString()) : false}
		/>
	)
}

export default ViewIndex
