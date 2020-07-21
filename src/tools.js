let _id = 1
export function id() {
	return _id++
}

export function resetId() {
	return (_id = 0)
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function clamp(value, min, max) {
	return value < min ? min : value > max ? max : value
}
