import { Button } from "antd"
import React, { useCallback } from "react"
import classNames from "classnames"
import commonFunc from "@/utils/common.func"
import { useIntl } from "umi"

interface Props {
	url: string
	txt: string
	target: number
}

const LinkUtil: React.FC<Props> = props => {
	const { url, txt, target } = props
	const mobile = commonFunc.browser().mobile
	const Intl = useIntl()
	const toLink = useCallback(() => {
		const newUrl = url.toLocaleLowerCase().indexOf("http") == 0 ? url : "//" + url
		if (target === 3) {
			window.open(newUrl)
		} else {
			window.self.location.href = newUrl
		}
	}, [target])
	return (
		<React.Fragment>
			<Button hidden={!url || !!mobile} type="link" onClick={toLink}>
				<i className={classNames("rulefont", "rule-guanlian")}></i>
				{txt || Intl.formatMessage({ id: "scene.viewMore" })}
			</Button>
			<div className="linkContain" hidden={!mobile || !url}>
				<span className={classNames("rulefont", "rule-guanlian")} onClick={toLink}></span>
			</div>
		</React.Fragment>
	)
}

export default LinkUtil
