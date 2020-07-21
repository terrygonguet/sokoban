import { html } from "hybrids"

/**
 * @typedef {Object} Block
 * @property {number} x
 * @property {number} y
 * @property {"box" | "box-ok" | "objective" | "wall" | "character" | "floor"} type
 */

/**
 * @typedef {HTMLElement & Block} BlockElement
 */

const zIndexes = {
	character: 99,
	box: 10,
	"box-ok": 10,
	wall: 5,
	objective: 1,
	floor: 0,
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
						animation: appear 0.1s linear;
					}
					@keyframes appear {
						from {
							opacity: 0;
						}
						to {
							opacity: 1;
						}
					}
				</style>
				<div style="${style}"></div>`,
}
