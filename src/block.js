import { html } from "hybrids"

/**
 * @typedef {Object} Block
 * @property {number} x
 * @property {number} y
 * @property {"box" | "objective" | "wall" | "character"} type
 */

/**
 * @typedef {HTMLElement & Block} BlockElement
 */

const zIndexes = {
	character: 99,
	box: 10,
	wall: 5,
	objective: 1,
}

export default {
	x: 0,
	y: 0,
	type: "box",
	style:
		/** @param {BlockElement} host */
		({ type, x, y }) => ({
			backgroundImage: `url("${type}.png")`,
			transform: `translate(calc(${x} * var(--sprite-dimension)), calc(${y} * var(--sprite-dimension)))`,
			zIndex: zIndexes[type],
		}),
	render:
		/** @param {BlockElement} host */
		({ style }) =>
			html`<style>
					div {
						width: var(--sprite-dimension);
						height: var(--sprite-dimension);
						position: absolute;
						top: 0;
						left: 0;
						transition: transform 0.1s ease-in-out;
					}
				</style>
				<div style="${style}"></div>`,
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
	return block.type == "objective"
}

/**
 * @param {Block} block
 */
export function isBox(block) {
	return block.type == "box"
}
