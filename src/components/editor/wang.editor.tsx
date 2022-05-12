import Editor from "@/lib/wangEditor"
import React, { useEffect, useRef } from "react"

import firstIndentEditor, { menuKey } from "./firstIndent.editor"
interface Props {
	onChange?: (content?: string) => void
	editConf?: Omit<typeof Editor.prototype.config, "onchange">
}
const WangEditor: React.FC<Props> = props => {
	const { onChange, editConf = {} } = props

	const editorBox = useRef<HTMLDivElement>()
	const editor = useRef<Editor>()
	useEffect(() => {
		if (!editor.current && !!editorBox.current) {
			editor.current = new Editor(editorBox.current)
			editor.current.config = { ...editor.current.config, ...editConf }
			editor.current.config.onchange = (newContent: string) => {
				!!onChange && onChange(newContent)
			}

			// editor.current.config.customUploadImg = (files: File[], insert: (url: string) => void) => {
			// 	// files 是 input 中选中的文件列表
			// 	// insert 是获取图片 url 后，插入到编辑器的方法
			// 	// 上传代码返回结果之后，将图片插入到编辑器中
			// 	for (let index = 0; index < files.length; index++) {
			// 		const file = files[index]
			// 		let form = new FormData()
			//     form.append("file", file)
			//     //调用上传接口
			// 		uploadFile(form).then(res => {
			// 			insert(url + res.url)
			// 		})
			// 	}
			// }

			editor.current.menus.extend(menuKey, firstIndentEditor)
			editor.current.config.menus.push(menuKey)
			editor.current.create()
		}
		return () => {
			editor.current && editor.current.destroy()
		}
	}, [])
	return <div ref={editorBox} className="full" style={{ position: "relative" }} />
}

export default WangEditor
