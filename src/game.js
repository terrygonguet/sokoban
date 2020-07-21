import { clamp, id, resetId } from "./tools"

/** @typedef {import("./components/warehouse").WarehouseElement} WarehouseElement */

/** @typedef {import("./components/block").Block} Block */

/**
 * @param {WarehouseElement} host
 * @param {KeyboardEvent} e
 */
export function onKeydown(host, e) {
	const { width, height, blocks, canMove } = host
	if (!canMove) return
	const player = getCharacter(blocks)
	if (!player) return

	let deltaX = 0,
		deltaY = 0
	switch (e.key) {
		case "ArrowUp":
			deltaY = -1
			break
		case "ArrowDown":
			deltaY = 1
			break
		case "ArrowLeft":
			deltaX = -1
			break
		case "ArrowRight":
			deltaX = 1
			break
		case " ":
			host.level = "2"
			return
	}

	const oneOver = getBlocksAt(blocks, player.x + deltaX, player.y + deltaY)
	const twoOver = getBlocksAt(
		blocks,
		player.x + deltaX * 2,
		player.y + deltaY * 2,
	)
	if (oneOver.every(isTraversable)) {
		player.x += deltaX
		player.y += deltaY
	} else if (oneOver.some(isBox) && twoOver.every(isTraversable)) {
		player.x += deltaX
		player.y += deltaY
		const box = oneOver.find(isBox)
		box.x += deltaX
		box.y += deltaY
	}

	if (e.key.startsWith("Arrow")) {
		host.blocks = blocks.map((a) => a)
		host.canMove = false
		setTimeout(() => (host.canMove = true), 110)
	}
}

/**
 * @param {WarehouseElement} host
 * @param {WheelEvent} e
 */
export function onScroll(host, e) {
	host.zoom = clamp(host.zoom + Math.sign(e.deltaY) * 0.1, 0.5, 2)
}

/**
 * @param {WarehouseElement} host
 * @param {number} level
 */
export async function loadLevel(host, level) {
	let data
	try {
		data = await import(`./levels/${level}.js`)
	} catch (err) {
		return alert(err)
	}

	const {
		default: { blocks, width, height, map },
	} = data
	resetId()
	host.width = width
	host.height = height
	host.blocks = blocks
		.map(([x, y, n]) =>
			n
				? {
						type: map[n],
						x,
						y,
						id: id(),
				  }
				: false,
		)
		.filter(Boolean)
}

/**
 * @param {Block[]} blocks
 */
export function getCharacter(blocks) {
	return blocks.find((b) => b.type == "character")
}

/**
 * @param {Block[]} blocks
 * @param {number} x
 * @param {number} y
 */
export function getBlocksAt(blocks, x, y) {
	return blocks.filter((b) => b.x == x && b.y == y)
}

/**
 * @param {Block} block
 */
export function isTraversable(block) {
	return ["objective", "floor"].includes(block.type)
}

/**
 * @param {Block} block
 */
export function isBox(block) {
	return block.type == "box"
}
