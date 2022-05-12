import ModalContext from "@/components/modal/modal.context"
import JMKProvider from "@/components/provider/jmk.context"
import UserProvider from "@/components/provider/user.context"
import InfoProvider from "@/components/provider/info.context"
import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const LayoutIndex = (props: PageProps) => {
	return (
		<UserProvider>
			<JMKProvider>
				<InfoProvider>
					{/* 有其他的context放于外侧 */}
					<ModalContext>{props.children}</ModalContext>
				</InfoProvider>
			</JMKProvider>
		</UserProvider>
	)
}

export default LayoutIndex
