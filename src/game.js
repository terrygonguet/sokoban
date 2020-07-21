import { id, resetId } from "./tools"
import { dispatch } from "hybrids"

/** @typedef {import("./components/warehouse").WarehouseElement} WarehouseElement */

/** @typedef {import("./components/block").Block} Block */

/**
 * @param {WarehouseElement} host
 * @param {KeyboardEvent} e
 */
export function onKeydown(host, e) {
	const { width, height, blocks, canMove, levels, level } = host
	if (!canMove) return
	const player = getCharacter(blocks)
	if (!player) return

	let deltaX = 0,
		deltaY = 0
	switch (e.key.toLowerCase()) {
		case "arrowup":
			deltaY = -1
			break
		case "arrowdown":
			deltaY = 1
			break
		case "arrowleft":
			deltaX = -1
			break
		case "arrowright":
			deltaX = 1
			break
		case " ":
			host.level = "2"
			return
		case "r":
			if (canMove) reset(host)
			break
	}

	const oneOver = getBlocksAt(blocks, player.x + deltaX, player.y + deltaY)
	const twoOver = getBlocksAt(blocks, player.x + deltaX * 2, player.y + deltaY * 2)
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

	// validate boxes
	const boxes = blocks.filter(isBox)
	boxes.forEach(b => {
		const blocksOnSamePlace = getBlocksAt(blocks, b.x, b.y)
		if (blocksOnSamePlace.some(isObjective)) b.type = "box-ok"
		else b.type = "box"
	})
	if (boxes.every(b => b.type == "box-ok")) {
		host.canMove = false
		setTimeout(() => {
			const i = levels.indexOf(level)
			if (i == levels.length - 1) alert("You win!")
			else host.level = levels[i + 1]
		}, 500)
	}
	if (e.key.startsWith("Arrow")) {
		// trigger render
		host.blocks = blocks.map(a => a)
		// prevent input too fast for animation
		host.canMove = false
		setTimeout(() => (host.canMove = true), 110)
	}
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
	dispatch(host, "levelloaded", { detail: level })
}

/**
 * @param {WarehouseElement} host
 */
export function reset(host) {
	loadLevel(host, host.level)
}

/**
 * @param {Block[]} blocks
 */
export function getCharacter(blocks) {
	return blocks.find(b => b.type == "character")
}

/**
 * @param {Block[]} blocks
 * @param {number} x
 * @param {number} y
 */
export function getBlocksAt(blocks, x, y) {
	return blocks.filter(b => b.x == x && b.y == y)
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
	return ["box", "box-ok"].includes(block.type)
}

/**
 * @param {Block} block
 */
export function isObjective(block) {
	return block.type == "objective"
}
