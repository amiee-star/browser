export const setHex = (value: number) => {
	return {
		r: ((value >> 16) & 255) / 255,
		g: ((value >> 8) & 255) / 255,
		b: (value & 255) / 255
	}
}
export const getHex = (value: { r: number; g: number; b: number }) => {
	return ((255 * value.r) << 16) ^ ((255 * value.g) << 8) ^ ((255 * value.b) << 0)
}

export const getHexString = (hex: number) => {
	return ("000000" + hex.toString(16)).slice(-6)
}
