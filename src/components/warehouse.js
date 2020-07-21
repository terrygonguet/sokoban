import { html } from "hybrids"
import Block from "./block"
import { onKeydown, onScroll, loadLevel } from "../game"

/**
 * @typedef {Object} Warehouse
 * @property {Block[]} blocks
 * @property {number} width
 * @property {number} height
 * @property {boolean} canMove
 * @property {string} level
 * @property {number} zoom
 */

/**
 * @typedef {HTMLElement & Warehouse} WarehouseElement
 */

/**
 * @typedef {import("./block").Block} Block
 */

export default {
	level: {
		observe: loadLevel,
		connect:
			/**
			 * @param {WarehouseElement} host
			 */
			function addListeners(host, key, invalidate) {
				host.level = "1"
				const cb_kd = onKeydown.bind(undefined, host)
				const cb_scroll = onScroll.bind(undefined, host)
				document.addEventListener("keydown", cb_kd)
				document.addEventListener("wheel", cb_scroll)
				return () => {
					document.removeEventListener("keydown", cb_kd)
					document.removeEventListener("wheel", cb_scroll)
				}
			},
	},
	canMove: true,
	width: 1,
	height: 1,
	zoom: 1,
	blocks: [],
	render:
		/** @param {WarehouseElement} host */
		({ blocks, width, height, zoom }) =>
			html`<style>
					#container {
						width: 100vw;
						height: 100vh;
						display: flex;
						justify-content: center;
						align-items: center;
						color: var(--color-text);
						image-rendering: pixelated;
						overflow: hidden;
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
						background: var(--warehouse-bg, transparent);
						position: relative;
						transform: scale(var(--zoom, 1));
					}
				</style>
				<div id="container" style="--zoom: ${zoom}">
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
