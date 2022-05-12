import urlFunc from "@/utils/url.func"
import axios from "axios"
import JSZip from "jszip"

interface RingConfig {
	el: HTMLDivElement

	pic: string
	turnnum?: number
	playnum?: number
	movenum?: number
	progress?: boolean
	load?: Function
}

export default class RingSDK {
	ratio = 0 //  图片长宽比例

	r = 0
	g = 0
	b = 0
	current = 0 // 当前播放第几张
	// 鼠标事件
	mouse = {
		offsetX: 0,
		offsetY: 0,
		_x: 0,
		_y: 0,
		x: 0,
		y: 0,
		move: false,
		startDis: 0,
		endDis: 0
	}
	scale = 1 // 放大系数
	max = 50 // 最大放大系数
	time = 0 // 播放时间
	autoplay = true // 默认不自动播放
	turn = true
	turnnum = 1 // 加载旋转速度
	playnum = 9 // 自动旋转速度
	movenum = 0 // 拖拽位置距离触发

	fillColor = false
	islocal = false
	dpo = window.devicePixelRatio ? window.devicePixelRatio : 1
	el: HTMLDivElement
	num = 0
	pic = ""

	load
	canvas: HTMLCanvasElement
	context: CanvasRenderingContext2D
	width = 0
	_width = 0
	height = 0
	_height = 0
	_ratio = 0
	maxWidth = 0
	maxHeight = 0
	imgs: HTMLImageElement[] = []
	constructor(config: RingConfig) {
		//外界传入参数
		this.el = config.el
		this.pic = config.pic

		this.turnnum = config.turnnum || 9
		this.playnum = config.playnum || 9
		this.movenum = config.movenum || 0

		this.load = config.load
		this.canvas = document.createElement("canvas")
		this.context = this.canvas.getContext("2d")
		this.width = this.el.clientWidth * this.dpo
		this.height = this.el.clientHeight * this.dpo
		this._ratio = this.width / this.height
		this.canvas.width = this.width
		this.canvas.height = this.height
		this._init()
	}
	_init() {
		this.el.innerHTML = ""
		this.el.appendChild(this.canvas)
		this._loadimg()
		this._eventHandler()
	}
	play(val: boolean) {
		this.autoplay = val
	}
	reset() {
		this.scale = 1
		if (this._ratio > this.ratio) {
			this._height = this.height
			this._width = this.height * this.ratio
		} else {
			this._width = this.width
			this._height = this.width / this.ratio
		}

		this.current = 0
		this.mouse.offsetX = 0
		this.mouse.offsetY = 0
	}

	resize() {
		this.width = this.el.clientWidth * this.dpo
		this.height = this.el.clientHeight * this.dpo
		this.canvas.width = this.width
		this.canvas.height = this.height
		this.reset()
	}

	toData() {
		return this.canvas.toDataURL("image/png")
	}

	_loadimg() {
		let that = this
		axios
			.get(urlFunc.replaceUrl(this.pic), { responseType: "arraybuffer" })
			.then(res => {
				if (res.status === 200 || res.status === 0) {
					return Promise.resolve(res.data)
				} else {
					return Promise.reject(new Error(res.statusText))
				}
			})
			.then(JSZip.loadAsync)
			.then(res => {
				this.num = Object.keys(res.files).length
				return Object.keys(res.files)
					.sort((a, b) => {
						return Number(a.split(".")[0]) - Number(b.split(".")[0])
					})
					.map(m => res.file(m).async("blob"))
			})
			.then(res => {
				return res.map(m => {
					return new Promise<HTMLImageElement>(resolve => {
						let img = new Image()
						this.imgs.push(img)
						img.onload = () => {
							if (!that.ratio) {
								that.ratio = img.width / img.height
								that.maxWidth = img.width
								that.maxHeight = img.height
							}
							resolve(img)
						}
						m.then(res => {
							img.src = URL.createObjectURL(res)
						})
						img.onerror = function (err) {
							console.log(err, "图片加载错误")
						}
					})
				})
			})
			.then(res => {
				Promise.all(res)
					.then(() => {
						if (this._ratio > this.ratio) {
							this._height = this.height
							this._width = this.height * this.ratio
						} else {
							this._width = this.width
							this._height = this.width / this.ratio
						}
						this._render()
						this.load && this.load()
					})
					.catch(console.log)
			})
	}
	_render() {
		if (!!this.el) {
			this.time++
			if (this.current >= this.num) this.current = 0
			if (this.current < 0) this.current = this.num - 1
			this._draw(this.current)
			if (this.autoplay && this.time % this.playnum == 0) {
				this.current++
			}
			requestAnimationFrame(this._render.bind(this))
		}
	}
	destroy() {
		this.el = null
	}
	_draw(index: number) {
		let img = this.imgs[index]

		if (img) {
			this.context.clearRect(0, 0, this.width, this.height)
			if (this.r != undefined && !this.islocal) {
				this.context.fillStyle =
					"#" +
					this.r.toString(16).padStart(2, "0") +
					this.g.toString(16).padStart(2, "0") +
					this.b.toString(16).padStart(2, "0")
			} else {
				this.context.fillStyle = "#ffffff"
			}
			this.context.fillRect(0, 0, this.width, this.height)
			this.context.drawImage(
				img,
				0,
				0,
				img.width,
				img.height,
				this.mouse.offsetX + (this.width - this._width) / 2,
				this.mouse.offsetY + (this.height - this._height) / 2,
				this._width,
				this._height
			)
			if (!this._ratio) {
				this._ratio = this.width / this.height
			} else if (this.r == undefined && !this.islocal) {
				let data

				if (this._ratio >= this.ratio) {
					data = this.context.getImageData((this.width - this._width) / 2, 0, 1, 1).data
				} else {
					data = this.context.getImageData(0, (this.height - this.width / this.ratio) / 2, 1, 1).data
				}
				this.r = data[0]
				this.g = data[1]
				this.b = data[2]
			}
		}
	}

	_eventHandler() {
		let that = this
		const mousemove = (event: MouseEvent) => {
			if (!this.mouse.move) return
			this.mouse.x = event.clientX
			this.mouse.y = event.clientY
			if (event.which == 1) {
				if (Math.abs(this.mouse.x - this.mouse._x) > this.movenum) {
					if (this.mouse.x < this.mouse._x) {
						this.current++
					} else {
						this.current--
					}
				}
			} else if (event.which == 3) {
				// 鼠标右键
				if (this.scale > 1) {
					if (this._width > this.width) {
						this.mouse.offsetX += this.mouse.x - this.mouse._x
						let maxX = (this._width - this.width) / 2
						if (this.mouse.offsetX >= maxX) this.mouse.offsetX = maxX
						else if (this.mouse.offsetX < -maxX) this.mouse.offsetX = -maxX
					}
					if (this._height > this.height) {
						this.mouse.offsetY += this.mouse.y - this.mouse._y
						let maxY = (this._height - this.height) / 2
						if (this.mouse.offsetY >= maxY) this.mouse.offsetY = maxY
						else if (this.mouse.offsetY < -maxY) this.mouse.offsetY = -maxY
					}
				}
			}
			this.mouse._x = this.mouse.x
			this.mouse._y = this.mouse.y
		}

		const scale = (direction: boolean) => {
			if (direction) {
				let scale = 1.5
				if (this._height < this.maxHeight * scale) {
					this.scale++
					this._width = this._width * 1.05
					this._height = this._height * 1.05
				} else {
				}
			} else {
				//缩小
				this.scale--
				if (this.scale > 1) {
					this._width = this._width / 1.05
					this._height = this._height / 1.05
				} else {
					this.scale = 1
					if (this._ratio > this.ratio) {
						this._height = this.height
						this._width = this.height * this.ratio
					} else {
						this._width = this.width
						this._height = this.width / this.ratio
					}
				}
			}
		}

		const mousewheel = (event: MouseEvent & { wheelDelta: number }) => {
			event.preventDefault()
			const direction = (event.wheelDelta || -event.detail) > 0 ? true : false
			scale(direction)
		}

		this.canvas.oncontextmenu = _ => {
			return false
		}
		this.canvas.addEventListener(
			"mousedown",
			event => {
				that.mouse._x = event.clientX
				that.mouse._y = event.clientY
				that.mouse.move = true
				let mark = this.autoplay
				if (mark) this.autoplay = false
				document.addEventListener("mousemove", mousemove, false)
				document.addEventListener(
					"mouseup",
					_ => {
						that.mouse.move = false
						document.removeEventListener("mousemove", mousemove)
						if (mark) this.autoplay = true
					},
					{ once: true }
				)
			},
			false
		)

		let mousewheelevt = /Firefox/i.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel"
		this.canvas.addEventListener(mousewheelevt, mousewheel, false)

		const touchmove = (event: TouchEvent) => {
			// event.preventDefault();
			if (!this.mouse.move) return
			let touches = event.touches
			this.mouse.x = touches[0].clientX
			this.mouse.y = touches[0].clientY
			if (touches.length == 1) {
				let _maxDis = this.scale * 0.2 + 0.3
				let maxDis = Math.min(_maxDis, 2)
				if (Math.abs(this.mouse.x - this.mouse._x) > maxDis) {
					if (this.mouse.x < this.mouse._x) {
						this.current++
					} else {
						this.current--
					}
				}
			} else {
				let { clientX: startX, clientY: startY } = touches[0]
				let { clientX: endX, clientY: endY } = touches[1]
				this.mouse.endDis = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
				if (Math.abs(this.mouse.endDis - this.mouse.startDis) < 6) {
					// if (this.scale > 1) {
					// if (this._width > this.width) {
					this.mouse.offsetX += (this.mouse.x - this.mouse._x) * 2
					// let maxX = (this._width - this.width) / 2
					// if (this.mouse.offsetX >= maxX) this.mouse.offsetX = maxX
					// else if (this.mouse.offsetX < -maxX) this.mouse.offsetX = -maxX
					// }
					// if (this._height > this.height) {
					this.mouse.offsetY += (this.mouse.y - this.mouse._y) * 2
					// let maxY = (this._height - this.height) / 2
					// if (this.mouse.offsetY >= maxY) this.mouse.offsetY = maxY
					// else if (this.mouse.offsetY < -maxY) this.mouse.offsetY = -maxY
					// }
					// }
				} else {
					let mark = this.mouse.endDis > this.mouse.startDis ? true : false
					scale(mark)
				}

				this.mouse.startDis = this.mouse.endDis
			}
			this.mouse._x = this.mouse.x
			this.mouse._y = this.mouse.y
			return false
		}

		this.canvas.addEventListener(
			"touchstart",
			event => {
				event.preventDefault()
				let mark = this.autoplay
				if (mark) this.autoplay = false
				that.mouse.move = true
				let touches = event.touches
				that.mouse._x = touches[0].clientX
				that.mouse._y = touches[0].clientY
				if (touches.length == 1) {
					that.mouse.move = true
				} else {
					let { clientX: startX, clientY: startY } = touches[0]
					let { clientX: endX, clientY: endY } = touches[1]
					this.mouse.startDis = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
				}
				document.addEventListener("touchmove", touchmove, false)
				document.addEventListener(
					"touchend",
					_ => {
						that.mouse.move = false
						document.removeEventListener("touchmove", touchmove)
						if (mark) this.autoplay = true
					},
					{ once: true }
				)
			},
			false
		)

		window.addEventListener(
			"resize",
			_ => {
				console.log("resize")
				that.resize()
			},
			false
		)
	}
}
