import { html } from "hybrids"
import Block, { getCharacter, getBlocksAt, isTraversable, isBox } from "./block"
import { id, resetId } from "./tools"

/**
 * @typedef {Object} Warehouse
 * @property {Block[]} blocks
 * @property {number} width
 * @property {number} height
 * @property {boolean} canMove
 * @property {string} level
 */

/**
 * @typedef {HTMLElement & Warehouse} WarehouseElement
 */

/**
 * @typedef {import("./block").Block} Block
 */

/**
 * @param {WarehouseElement} host
 * @param {Function} invalidate
 * @param {KeyboardEvent} e
 */
function onKeydown(host, invalidate, e) {
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
 * @param {number} level
 */
async function loadLevel(host, level) {
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
		.map((n, i) =>
			n
				? {
						type: map[n],
						x: i % width,
						y: Math.floor(i / width),
						id: id(),
				  }
				: false,
		)
		.filter(Boolean)
}

export default {
	canMove: true,
	level: {
		observe: loadLevel,
	},
	width: 1,
	height: 1,
	blocks: [],
	character: {
		connect:
			/**
			 * @param {WarehouseElement} host
			 * @param {string} key
			 * @param {Function} invalidate
			 */
			function (host, key, invalidate) {
				host.level = "1"
				const cb = onKeydown.bind(undefined, host, invalidate)
				document.addEventListener("keydown", cb)
				return () => document.removeEventListener("keydown", cb)
			},
	},
	render:
		/** @param {WarehouseElement} host */
		({ blocks, width, height }) =>
			html`<style>
					#container {
						width: 100vw;
						height: 100vh;
						display: flex;
						justify-content: center;
						align-items: center;
						color: var(--color-text);
						background: linear-gradient(
									45deg,
									#444444 45px,
									transparent 45px
								)
								64px 64px,
							linear-gradient(
								45deg,
								#444444 45px,
								transparent 45px,
								transparent 91px,
								#333333 91px,
								#333333 135px,
								transparent 135px
							),
							linear-gradient(
								-45deg,
								#444444 23px,
								transparent 23px,
								transparent 68px,
								#444444 68px,
								#444444 113px,
								transparent 113px,
								transparent 158px,
								#444444 158px
							);
						background-color: #333333;
						background-size: 128px 128px;
					}

					main {
						display: grid;
						grid-template-columns: repeat(
							${width},
							var(--sprite-dimension)
						);
						grid-template-rows: repeat(
							${height},
							var(--sprite-dimension)
						);
						background: var(--warehouse-bg, #2a2a2a);
						position: relative;
					}
				</style>
				<div id="container">
					<main>
						${blocks.map(({ x, y, type, id }) =>
							html`<sk-block
								x="${x}"
								y="${y}"
								type="${type}"
							></sk-block>`
								.define({ skBlock: Block })
								.key(id),
						)}
					</main>
				</div>`,
}
