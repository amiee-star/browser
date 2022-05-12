import ModalContext from "@/components/modal/modal.context"
import { PageProps } from "@/interfaces/app.interface"
import React from "react"
const Layout = (props: PageProps) => {
	return <ModalContext>{props.children}</ModalContext>
}
export default Layout
