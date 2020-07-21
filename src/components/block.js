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

const bgPositions = {
	character: [0, -128],
	box: [0, -64],
	"box-ok": [-64, 0],
	wall: [-64, -64],
	objective: [0, 0],
	floor: [-64, -128],
}

export default {
	x: 0,
	y: 0,
	type: "box",
	style:
		/** @param {BlockElement} host */
		({ type, x, y }) => ({
			backgroundPosition: bgPositions[type].map(n => `${n}px`).join(" "),
			transform: `translate(calc(${x} * var(--sprite-dimension)), calc(${y} * var(--sprite-dimension)))`,
			zIndex: zIndexes[type],
		}),
	render:
		/** @param {BlockElement} host */
		({ style }) =>
			html`<style>
					div {
						background-image: url("spritesheet.png"),
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
