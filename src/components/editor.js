import { html, property } from "hybrids"
import Block from "./block"

/**
 * @typedef {Object} Editor
 * @property {number} width
 * @property {number} height
 * @property {Object<string, [number, number][]>} layers
 * @property {string} selectedLayer
 */

/** @typedef {HTMLElement & Editor} EditorElement */

/**
 * @param {EditorElement} host
 * @param {MouseEvent} e
 */
function onClick(host, e) {
	const { layers, selectedLayer, width, height } = host
	const [target] = e.composedPath(),
		layer = layers[selectedLayer]
	const { x: tx, y: ty, width: tw } = target.getBoundingClientRect()
	const { clientX: ex, clientY: ey } = e
	const spriteWidth = tw / width
	const x = Math.floor((ex - tx) / spriteWidth),
		y = Math.floor((ey - ty) / spriteWidth)

	const blocksOnSamePlace = layer.filter(([bx, by]) => bx == x && by == y)
	if (blocksOnSamePlace.length) blocksOnSamePlace.forEach(bsp => layer.splice(layer.indexOf(bsp), 1))
	else {
		if (selectedLayer == "character" && layer.length) alert("Can't have more than one player character.")
		else layer.push([x, y])
	}
	localStorage.setItem("sk-editor", JSON.stringify({ width, height, layers }))
	host.layers = { ...layers }
}

/**
 * @param {EditorElement} host
 */
function clear(host) {
	if (confirm("Are you sure you want to clear all the blocks?")) {
		const { layers } = host
		Object.keys(layers).forEach(l => layers[l].splice(0, layers[l].length))
		localStorage.removeItem("sk-editor")
		host.layers = { ...layers }
	}
}

/**
 * @param {EditorElement} host
 */
function exportLevel(host) {
	const { width, height, layers } = host
	const data = {
		width,
		height,
		blocks: [],
		map: [],
	}
	for (const block in layers) {
		const layer = layers[block]
		const i = data.map.length
		data.map.push(block)
		data.blocks.push(...layer.map(([x, y]) => [x, y, i]))
	}
	const text = JSON.stringify(data)
	navigator.clipboard
		.writeText(btoa(text))
		.then(() => alert("Copied data to clipboard!"))
		.catch(() => alert("There was an error exporting the data, please try again."))
}

/**
 * @param {EditorElement} host
 */
function importLevel(host) {
	const str = prompt("Please paste level data here.\nWARNING: This will erase anything currently in the editor!")
	const data = JSON.parse(atob(str))
	host.width = data.width
	host.height = data.height
	data.map.forEach((block, i) => {
		const layer = host.layers[block]
		layer.splice(0, layer.length, ...data.blocks.filter(b => b[2] == i).map(([x, y]) => [x, y]))
	})
	const { layers, width, height } = host
	localStorage.setItem("sk-editor", JSON.stringify({ width, height, layers }))
	host.layers = { ...layers }
}

export default {
	width: 8,
	height: 8,
	layers: property(
		{
			wall: [],
			box: [],
			character: [],
			objective: [],
			floor: [],
		},
		host => {
			const data = JSON.parse(localStorage.getItem("sk-editor"))
			if (!data) return
			host.width = data.width
			host.height = data.height
			host.selectedLayer = "wall"
			host.layers = { ...data.layers }
		},
	),
	selectedLayer: "wall",
	style:
		/** @param {EditorElement} host */
		({ width, height }) => ({
			"--nb-columns": width,
			"--nb-rows": height,
		}),
	render:
		/** @param {EditorElement} host */
		({ width, height, layers, selectedLayer, style }) =>
			html`<style>
					#container {
						--sprite-dimension: 64px;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;
						overflow: hidden;
						width: 100vw;
						height: 100vh;
						background-color: #269;
						background-image: linear-gradient(white 2px, transparent 2px),
							linear-gradient(90deg, white 2px, transparent 2px),
							linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
							linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
						background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
						background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
						font-size: 0.85rem;
					}
					main {
						width: calc(var(--nb-columns) * var(--sprite-dimension));
						height: calc(var(--nb-rows) * var(--sprite-dimension));
						background: rgba(50, 50, 50, 0.7);
						border: 2px solid black;
						position: relative;
					}
					nav {
						padding: 1rem 0;
						width: 100%;
						background: lightblue;
						display: flex;
						justify-content: center;
						align-items: center;
						z-index: 100;
						position: absolute;
						top: 0;
						left: 0;
						border-bottom: 2px solid black;
					}
					nav div {
						margin: 0 1rem;
					}
					button,
					a {
						padding: 0.5rem;
						margin: 0 0.5rem;
						cursor: pointer;
						border-radius: 0.5rem;
						display: inline-flex;
						align-items: center;
						border: 1px solid green;
						text-decoration: none;
						color: black;
						background: white;
					}
					.blockpicker {
						background: gray;
						border: 1px solid transparent;
					}
					.selected {
						border: 1px solid green;
						background: white;
					}
					button img {
						width: calc(var(--sprite-dimension) / 1.5);
					}
					input {
						border: 1px solid transparent;
						padding: 0.5rem;
						margin: 0 0.5rem;
						border-radius: 0.5rem;
						align-items: center;
						width: 3rem;
						border: 1px solid green;
					}
					.layer {
						position: absolute;
						top: 0;
						left: 0;
						pointer-events: none;
						opacity: 0.5;
						transition: opacity 0.2s ease-in-out;
					}
					.selectedLayer {
						opacity: 1;
					}
				</style>
				<div id="container">
					<nav>
						<div>
							<input type="number" min="1" step="1" value="${width}" onchange="${html.set("width")}" />
							X
							<input type="number" min="1" step="1" value="${height}" onchange="${html.set("height")}" />
						</div>
						<div>
							${Object.keys(layers).map(
								l =>
									html`<button
										class=${{ selected: l == selectedLayer, blockpicker: true }}
										onclick=${h => (h.selectedLayer = l)}
									>
										<img src="/${l}.png" />
									</button>`,
							)}
						</div>
						<div>
							<button onclick="${clear}">Clear</button>
							<button onclick="${exportLevel}">Export</button>
							<button onclick="${importLevel}">Import</button>
							<a href="/" style="position: absolute; right: 3rem;">Game</a>
						</div>
					</nav>
					<main style="${style}" onclick="${onClick}">
						${Object.keys(layers).map(
							l =>
								html`<div class="${{ layer: true, selectedLayer: l == selectedLayer }}">
									${layers[l].map(([x, y]) =>
										html`<sk-block x="${x}" y="${y}" type="${l}"></sk-block>`.key(`${x} ${y} ${l}`),
									)}
								</div>`,
						)}
					</main>
				</div>`.define({ skBlock: Block }),
}
