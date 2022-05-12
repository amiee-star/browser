import React, { useCallback, useEffect, useState } from "react"
import commonFunc from "@/utils/common.func"
import "./article.util.less"
import { useIntl } from "umi"
import serviceLocal from "@/services/service.local"
import { Button, Space } from "antd"
import { ModalCustom } from "@/components/modal/modal.context"
import ViewerModal from "@/components/modal/sceneView/viewer.modal"
import urlFunc from "@/utils/url.func"

interface Props {
	articleId: string
	discripe: string
}

const ArticleUtil: React.FC<Props> = props => {
	const { articleId, discripe } = props
	const [articleData, setArticleData] = useState<any>()
	const Intl = useIntl()
	const mobile = commonFunc.browser().mobile

	useEffect(() => {
		if (!!articleId) {
			serviceLocal.getArticle({ id: articleId }).then(res => {
				setArticleData(res.data.content)
			})
		}
	}, [articleId])
	console.log(articleData, "articleDataarticleDataarticleDataarticleData")
	const viewPdf = useCallback(() => {
		ModalCustom({
			content: ViewerModal,
			params: {
				url: `${window.publicPath}pdf/web/viewer.html?file=${urlFunc.replaceUrl(articleData.pdf)}`,
				data: null
			}
		})
	}, [articleData])
	return (
		<div id={mobile ? "ArticleUtilMobile" : "ArticleUtil"} hidden={!articleId && !discripe}>
			<pre className="discripe">{discripe}</pre>
			<div className="top" hidden={!articleId}>
				<Space direction="horizontal" align="center">
					<span>
						{Intl.formatMessage({
							id: "scene.article.title",
							defaultMessage: "详情描述"
						})}
					</span>
					<Button hidden={!articleData?.pdf} type="primary" size="small" onClick={viewPdf}>
						Pdf浏览
					</Button>
				</Space>
			</div>
			<div dangerouslySetInnerHTML={{ __html: !!articleData && articleData }} />
		</div>
	)
}

export default ArticleUtil
