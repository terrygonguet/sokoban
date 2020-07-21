import { html } from "hybrids"
import Block from "./block"
import Nav from "./nav"
import Popup from "./popup"
import { onKeydown, loadLevel, reset } from "../game"
import { clamp } from "../tools"

/**
 * @typedef {Object} Warehouse
 * @property {Block[]} blocks
 * @property {number} width
 * @property {number} height
 * @property {boolean} canMove
 * @property {string} level
 * @property {number} zoom
 * @property {string[]} levels
 * @property {string} popupMessage
 * @property {boolean} showPopup
 */

/**
 * @typedef {HTMLElement & Warehouse} WarehouseElement
 */

/**
 * @typedef {import("./block").Block} Block
 */

/**
 * @param {WarehouseElement} host
 * @param {WheelEvent} e
 */
function onScroll(host, e) {
	host.zoom = clamp(host.zoom - Math.sign(e.deltaY) * 0.1, 0.5, 2)
}

export default {
	level: {
		observe: loadLevel,
		connect:
			/**
			 * @param {WarehouseElement} host
			 */
			function addListeners(host) {
				host.level = host.levels[0]
				const onlvlloaded = () => (host.showPopup = false)
				const cb_kd = onKeydown.bind(undefined, host)
				const cb_scroll = onScroll.bind(undefined, host)
				document.addEventListener("keydown", cb_kd)
				document.addEventListener("wheel", cb_scroll)
				host.addEventListener("levelloaded", onlvlloaded)
				return () => {
					document.removeEventListener("keydown", cb_kd)
					document.removeEventListener("wheel", cb_scroll)
					host.removeEventListener("levelloaded", onlvlloaded)
				}
			},
	},
	canMove: true,
	width: 1,
	height: 1,
	zoom: 1,
	blocks: [],
	levels: ["1", "2", "3"],
	popupMessage: "Loading...",
	showPopup: true,
	render:
		/** @param {WarehouseElement} host */
		({ blocks, width, height, zoom, level, levels, popupMessage, showPopup }) =>
			html`<style>
					#container {
						width: 100vw;
						height: 100vh;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;
						overflow: hidden;
						background: linear-gradient(45deg, #444444 45px, transparent 45px) 64px 64px,
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
						--sprite-dimension: 64px;
						margin: auto;
						display: grid;
						grid-template-columns: repeat(${width}, var(--sprite-dimension));
						grid-template-rows: repeat(${height}, var(--sprite-dimension));
						background: var(--warehouse-bg, transparent);
						position: relative;
						transform: scale(var(--zoom, 1));
					}

					.popup {
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 0;
					}
				</style>
				<div id="container" style="--zoom: ${zoom}">
					<sk-nav
						value="${level}"
						levels="${levels}"
						onchange="${html.set("level")}"
						onreset="${reset}"
					></sk-nav>
					<sk-popup hidden=${!showPopup}>
						<p class="popup">${popupMessage}</p>
					</sk-popup>
					<main>
						${blocks.map(({ x, y, type, id }) =>
							html`<sk-block x="${x}" y="${y}" type="${type}"></sk-block>`
								.define({ skBlock: Block })
								.key(id),
						)}
					</main>
				</div>`.define({ skNav: Nav, skPopup: Popup }),
}
