export const formatnum = (val: number) => {
	console.log(val, "valvalvalval")
	if (!val) {
		return 0
	} else if (val < 1000) {
		return val
	} else if (val < 10000) {
		return parseInt(val / 1000).toFixed(1) + "k"
	} else if (val < 100000) {
		return parseInt(val / 10000).toFixed(1) + "w"
	} else if (val < 10000000) {
		return parseInt(val / 10000).toFixed(0) + "w"
	} else if (val < 100000000) {
		return parseInt(val / 10000000).toFixed(0) + "kw"
	} else {
		return "9kw+"
	}
}

export default formatnum
