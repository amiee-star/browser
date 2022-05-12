import { FILETYEP, InfoCustom } from "@/interfaces/rule.interface"
import { Col, Row } from "antd"
import classNames from "classnames"
import React, { useCallback, useMemo, useState } from "react"
import ModelSlideUtil from "../../model/template/util/model.slide.util"
import VideoSlideUtil from "../../video/template/util/video.slide.util"
import "./normal.image.less"
import ArticleUtil from "./util/article.util"
import AudioUtil from "./util/audio.util"
import ImgSlideUtil from "./util/img.slide.util"
import LinkUtil from "./util/link.util"
import commonFunc from "@/utils/common.func"
import SequenceSlideUtil from "./util/sequence.slide.util"
import { assetData } from "@/interfaces/extdata.interface"
interface Props {
	extInfo: assetData
}
const NormalImage: React.FC<Props> = props => {
	const { extInfo } = props
	const { name, extdata } = extInfo
	const { info } = extdata
	const { custom } = info
	const customData = custom
	const mobile = commonFunc.browser().mobile
	const getAlbums = useMemo(() => {
		const { contentType: fileType, id: objId, thumb: thumbnail } = extInfo
		const initVal =
			fileType !== null
				? {
						[fileType === FILETYEP.GIF ? FILETYEP.PIC : fileType]: [
							{
								fileType: fileType === FILETYEP.GIF ? FILETYEP.PIC : fileType,
								picId: objId,
								path: thumbnail
							}
						]
				  }
				: {}
		if (customData.detailAlbum && customData.detailAlbum.length) {
			return customData.detailAlbum?.reduce(
				(prevVal: any, currentVal: any) => {
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
				// customData.detailAlbumEye ? initVal : []
				initVal
			)
		} else {
			return initVal
		}
	}, [extInfo])
	const [tabIndex, setTabIndex] = useState(Object.keys(getAlbums).reverse()[0])

	const tabChange = useCallback((m: string) => () => setTabIndex(m), [])
	return (
		<div id={mobile ? "NormalImageMobile" : "NormalImage"} className="full">
			<div className="header">
				{!mobile && (
					<div className="header-box">
						<span className="title">{name}</span>
						<Row gutter={[0, 5]} className="other">
							<Col>
								<AudioUtil src={customData.detailAudio?.musicFile} />
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
							<AudioUtil src={customData.detailAudio?.musicFile} />
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
										"rule-tupian": ["1", "2", "5", "6"].includes(m),
										"rule-shipin": m === "3",
										"rule-moxing": m === "4",
										active: tabIndex === m
									})}
								/>
							)
						})}
				</div>
				{/* tab内容 */}
				<div className="tab-content" hidden={!tabIndex}>
					{(tabIndex === "1" || tabIndex === "2" || tabIndex === "5") && <ImgSlideUtil imgList={getAlbums[tabIndex]} />}
					{tabIndex === "6" && <SequenceSlideUtil imgList={getAlbums[tabIndex]} />}
					{tabIndex === "3" && <VideoSlideUtil videoList={getAlbums[tabIndex]} />}
					{tabIndex === "4" && <ModelSlideUtil modelList={getAlbums[tabIndex]} />}
				</div>
				{/* 详情介绍 */}
				<div className="content-artic full-w">
					<ArticleUtil articleId={customData.detailArticle?.id} discripe={info.discripe} />
				</div>
			</div>
		</div>
	)
}

export default NormalImage
