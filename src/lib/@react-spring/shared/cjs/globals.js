"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
var FrameLoop_1 = require("./FrameLoop")
var helpers_1 = require("./helpers")
exports.frameLoop = new FrameLoop_1.FrameLoop()
exports.now = function () {
	return performance.now()
}
exports.colorNames = null
exports.skipAnimation = false
exports.requestAnimationFrame =
	typeof window !== "undefined"
		? window.requestAnimationFrame
		: function () {
				return -1
		  }
exports.batchedUpdates = function (callback) {
	return callback()
}
exports.willAdvance = function () {}
exports.assign = function (globals) {
	var _a
	return (
		(_a = Object.assign(
			{
				to: exports.to,
				now: exports.now,
				frameLoop: exports.frameLoop,
				colorNames: exports.colorNames,
				skipAnimation: exports.skipAnimation,
				createStringInterpolator: exports.createStringInterpolator,
				requestAnimationFrame: exports.requestAnimationFrame,
				batchedUpdates: exports.batchedUpdates,
				willAdvance: exports.willAdvance
			},
			pluckDefined(globals)
		)),
		(exports.to = _a.to),
		(exports.now = _a.now),
		(exports.frameLoop = _a.frameLoop),
		(exports.colorNames = _a.colorNames),
		(exports.skipAnimation = _a.skipAnimation),
		(exports.createStringInterpolator = _a.createStringInterpolator),
		(exports.requestAnimationFrame = _a.requestAnimationFrame),
		(exports.batchedUpdates = _a.batchedUpdates),
		(exports.willAdvance = _a.willAdvance),
		_a
	)
}
// Ignore undefined values
function pluckDefined(globals) {
	var defined = {}
	for (var key in globals) {
		if (globals[key] !== undefined) defined[key] = globals[key]
	}
	return defined
}
//# sourceMappingURL=globals.js.map
