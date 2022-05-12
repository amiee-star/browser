import { FILETYEP } from "@/interfaces/rule.interface"
import { Col, Row } from "antd"
import classNames from "classnames"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import ModelSlideUtil from "./model/template/util/model.slide.util"
import VideoSlideUtil from "./video/template/util/video.slide.util"
import "./material.index.less"
import ArticleUtil from "./image/template/util/article.util"
import AudioUtil from "./image/template/util/audio.util"
import ImgSlideUtil from "./image/template/util/img.slide.util"
import LinkUtil from "./image/template/util/link.util"
import commonFunc from "@/utils/common.func"
import SequenceSlideUtil from "./image/template/util/sequence.slide.util"
import { assetData, ExtDataInfo, ExtDataInfoCustom } from "@/interfaces/extdata.interface"
import RingSlideUtil from "./ring/template/util/ring.slide.util"
interface Props {
	extInfo: assetData
}
const MaterialIndex: React.FC<Props> = props => {
	const { extInfo } = props

	const { name, extdata } = extInfo
	const { info } = extdata
	const { custom } = info
	const customData = custom
	// const [customData, setCustomData] = useState<ExtDataInfoCustom>()
	const [cartoonShow, setCartoonShow] = useState(false)
	// const [info, setInfo] = useState<ExtDataInfo>()

	const mobile = commonFunc.browser().mobile
	// useEffect(() => {
	// 	if (extInfo.extdata) {
	// 		setInfo(extInfo.extdata.info)
	// 	}
	// }, [extInfo])
	// useEffect(() => {
	// 	if (info) {
	// 		const { custom } = info
	// 		setCustomData(custom)
	// 	}
	// }, [info])
	const getAlbums = useMemo(() => {
		const { contentType: fileType, id: objId, thumb: thumbnail, texture: picPath, link } = extInfo
		const initVal = {
			[fileType === FILETYEP.GIF ? FILETYEP.PIC : fileType]: [
				{
					fileType: fileType === FILETYEP.GIF ? FILETYEP.PIC : fileType,
					picId: objId,
					path: picPath || thumbnail,
					link: link || picPath
				}
			]
		}
		// fileType !== null
		//   ? {
		//     [fileType === FILETYEP.GIF ? FILETYEP.PIC : fileType]: [
		//       { fileType: fileType === FILETYEP.GIF ? FILETYEP.PIC : fileType, picId: objId || picId, path: thumbnail || picPath, delay }
		//     ]
		//   }
		//   : {}
		if (customData?.detailAlbum) {
			return customData?.detailAlbum?.reduce(
				(prevVal: any, currentVal: any) => {
					const checkCurrent = {
						fileType: currentVal.fileType === FILETYEP.GIF ? FILETYEP.PIC : currentVal.fileType,
						picId: currentVal.picId,
						path: currentVal.picPath || currentVal.link || "",
						modelFile: currentVal.modelFile,
						link: currentVal.link || "",
						thumbnail: currentVal.picPathCompre?.replace(
							"height=0&width=64&x-image-process=image/resize,w_64",
							"height=0&width=512&x-image-process=image/resize,w_512"
						) // 视频的封面
					}
					if (!!prevVal[checkCurrent.fileType]) {
						prevVal[checkCurrent.fileType].push(checkCurrent)
					} else {
						prevVal[checkCurrent.fileType] = [checkCurrent]
					}
					return prevVal
				},
				customData.detailAlbumEye ? initVal : []
			)
		} else {
			return initVal
		}
	}, [extInfo])
	const [tabIndex, setTabIndex] = useState(Object.keys(getAlbums).reverse()[0])
	const tabChange = useCallback((m: string) => () => setTabIndex(m), [])
	// 热点的时候为null 需要监听getAlbums之后赋值
	useEffect(() => {
		setTabIndex(Object.keys(getAlbums).reverse()[0])
	}, [getAlbums])

	useMemo(() => {
		// eventBus.on("scene.material.musicPlay", (val) => {
		//   setCartoonShow(!val)
		// })
	}, [])
	return (
		<div id={mobile ? "NormalImageMobile" : "NormalImage"} className="full">
			<div className="header">
				{!mobile && (
					<div className="header-box">
						<span className="title">{customData.tag.title}</span>
						{info && customData && (
							<Row gutter={[0, 5]} className="other">
								<Col>
									<AudioUtil src={customData?.detailAudio?.musicFile} />
								</Col>
								<Col>
									<LinkUtil url={info.url} target={info.target} txt={info.btnText} />
								</Col>
							</Row>
						)}
					</div>
				)}

				<div className="header-box-mobile" hidden={!mobile}>
					<p className="title otw">{name}</p>
				</div>
			</div>
			<div className="content">
				{/* 头部tab项 */}
				<div className="tab-nav flex">
					<div className="pc" hidden={Object.keys(getAlbums).length < 2}>
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
											"rule-shijiao1": m === "15",
											active: tabIndex === m
										})}
									/>
								)
							})}
					</div>
					{mobile && customData && info && (
						<Row gutter={[0, 5]} className="other-mobile">
							<Col>
								<AudioUtil src={customData?.detailAudio?.musicFile} />
							</Col>
							<Col>
								<LinkUtil url={info.url} target={info.target} txt={info.btnText} />
							</Col>
						</Row>
					)}
				</div>
				{/* tab内容 */}
				<div className="tab-content">
					{(tabIndex === "1" || tabIndex === "2" || tabIndex === "5") && getAlbums[tabIndex] && (
						<ImgSlideUtil imgList={getAlbums[tabIndex]} />
					)}
					{tabIndex === "6" && <SequenceSlideUtil imgList={getAlbums[tabIndex]} />}
					{tabIndex === "3" && <VideoSlideUtil videoList={getAlbums[tabIndex]} />}
					{tabIndex === "4" && <ModelSlideUtil modelList={getAlbums[tabIndex]} />}
					{tabIndex === "15" && <RingSlideUtil modelList={getAlbums[tabIndex]} />}
				</div>
				{/* 详情介绍 */}
				<div className="content-artic full-w">
					<ArticleUtil articleId={customData.detailArticle?.id} discripe={info.description} />
				</div>
			</div>
			{/* <div className="cartoon" hidden={cartoonShow}>
				<img src={customData?.detailAudio?.peopleImg} />
			</div> */}
		</div>
	)
}

export default MaterialIndex
