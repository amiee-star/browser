import { PlayData } from "@/components/sceneUtils/scene.textplay"
import { assetData } from "@/interfaces/extdata.interface"
import EventEmitter from "eventemitter3"
interface eventList {
	"jmk.loading": (n: number) => void
	"jmk.sceneChanged": (e: any) => void
	"jmk.assetSelected": (e: assetData) => void
	"jmk.assetClick": () => void
	"jmk.assetAdd": (e: assetData) => void
	"jmk.assetsLoaded": (e: any) => void
	"jmk.positionChanged": () => void
	"tour.change": () => void
	"view.setThumb": (e: any) => void
	"scene.show": (e?: any) => void
	"scene.open": (e?: any) => void
	"jmk.asset.loading": (e: number) => void
	"scene.view.pusedMusic": (e?: boolean) => void
	"scene.view.playVideo": (e?: boolean) => void
	"scene.map.show": (e?: boolean) => void
	"scene.openVideo.show": (e?: boolean) => void
	"scene.tour.show": () => void
	"scene.tour.hidden": () => void
	"scene.controlBtn.hidden": () => void
	"scene.controlBtn.show": () => void
	"scene.view.shuttleVideo": (e?: any) => void
	"scene.view.shuttleVideoUrl": (e?: any) => void
	"scene.tour.play": (e?: boolean) => void
	"scene.text.play": (e: PlayData) => void
	"scene.text.stop": () => void
	"scene.position.trigger": (e: number) => void
	"scene.position.0": (e: number) => void
	"scene.position.last": (e: number) => void
	"scene.position.show": (e: number) => void
	"scene.danmu.show": () => void
	"scene.danmu.hide": () => void
	"scene.liuyan.show": () => void
	"scene.liuyan.hide": () => void
	"scene.customButton.show": () => void
	"scene.customButton.hide": () => void
	"scene.outLine.show": () => void
	"scene.positions.show": () => void
	"scene.outLine.hide": () => void
	"scene.outLine.hide1": () => void
	"scene.positions.hide": () => void
	"scene.positions.hide1": () => void
}
export default new EventEmitter<eventList>()
