import React from "react"
import { ConfigProvider } from "antd"

const ProjectEntry: React.FC = props => {
	return <ConfigProvider>{props.children}</ConfigProvider>
}
export default ProjectEntry
