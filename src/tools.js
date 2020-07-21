let _id = 1
export function id() {
	return _id++
}

export function resetId() {
	return (_id = 0)
}
