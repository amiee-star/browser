import { assetData, ExtData } from "@/interfaces/extdata.interface"
import { FILETYEP, InfoCustom, objInfoData } from "@/interfaces/rule.interface"
import commonFunc from "@/utils/common.func"
import { Col, Row } from "antd"
import classNames from "classnames"
import React, { useCallback, useMemo, useState } from "react"
import ModelSlideUtil from "../../model/template/util/model.slide.util"
import VideoSlideUtil from "../../video/template/util/video.slide.util"
import "./normal.sequence.less"
import ArticleUtil from "./util/article.util"
import AudioUtil from "./util/audio.util"
import LinkUtil from "./util/link.util"
import SequenceUtil from "./util/sequence.util"
interface Props {
	extInfo: assetData
}
const NormalSequence: React.FC<Props> = props => {
	const { extInfo } = props
	const { name, extdata } = extInfo
	const { info } = extdata
	const { custom } = info
	const customData: InfoCustom = custom
	const mobile = commonFunc.browser().mobile
	const getAlbums = useMemo(() => {
		const { contentType: fileType, thumb, id: objId } = extInfo
		const initVal =
			fileType !== null
				? {
						[fileType === FILETYEP.GIF ? FILETYEP.PIC : fileType]: [
							{ fileType: fileType === FILETYEP.GIF ? FILETYEP.PIC : fileType, picId: objId, path: thumb }
						]
				  }
				: {}
		if (customData.detail_album) {
			return customData.detail_album?.reduce(
				(prevVal, currentVal) => {
					const checkCurrent = {
						fileType: currentVal.fileType === FILETYEP.GIF ? FILETYEP.PIC : currentVal.fileType,
						picId: currentVal.picId,
						path: currentVal.picPath || currentVal.link || ""
					}
					if (!!prevVal[checkCurrent.fileType]) {
						prevVal[checkCurrent.fileType].push(checkCurrent)
					} else {
						prevVal[checkCurrent.fileType] = [checkCurrent]
					}
					return prevVal
				},
				customData.detail_album_eye ? initVal : []
			)
		} else {
			return initVal
		}
	}, [extInfo])
	const [tabIndex, setTabIndex] = useState(Object.keys(getAlbums).reverse()[0])
	const tabChange = useCallback((m: string) => () => setTabIndex(m), [])
	return (
		<div id={mobile ? "NormalSequenceMobile" : "NormalSequence"} className="full">
			<div className="header">
				{!mobile && (
					<div className="header-box">
						<span className="title">{name}</span>
						<Row gutter={[0, 5]} className="other">
							<Col>
								<AudioUtil src={customData.detail_audio?.musicFile} />
							</Col>
							<Col>
								<LinkUtil url={info.url} target={info.target} txt={info.btnText} />
							</Col>
						</Row>
					</div>
				)}

				<div className="header-box-mobile" hidden={!mobile}>
					<p className="title otw">{name}</p>
				</div>
			</div>
			<div className="content">
				{mobile && (
					<Row gutter={[0, 5]} className="other-mobile">
						<Col>
							<AudioUtil src={customData.detail_audio?.musicFile} />
						</Col>
						<Col>
							<LinkUtil url={info.url} target={info.target} txt={info.btnText} />
						</Col>
					</Row>
				)}

				{/* 头部tab项 */}
				<div className="tab-nav" hidden={Object.keys(getAlbums).length < 2}>
					{Object.keys(getAlbums)
						.reverse()
						.map(m => {
							return (
								<i
									onClick={tabChange(m)}
									key={`tab-${m}`}
									className={classNames("rulefont", {
										"rule-tupian": m === "6",
										"rule-shipin": m === "3",
										"rule-moxing": m === "4",
										active: tabIndex === m
									})}
								/>
							)
						})}
				</div>
				{/* tab内容 */}
				<div className="tab-content">
					{tabIndex === "3" && <VideoSlideUtil videoList={getAlbums[tabIndex]} />}
					{tabIndex === "4" && <ModelSlideUtil modelList={getAlbums[tabIndex]} />}
				</div>
				{/* 详情介绍 */}
				<div className="content-artic full-w">
					<ArticleUtil articleId={customData.detail_article?.id} discripe={info.discripe} />
				</div>
			</div>
		</div>
	)
}

export default NormalSequence
