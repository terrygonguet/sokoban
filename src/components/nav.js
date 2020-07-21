import { html, dispatch } from "hybrids"

/**
 * @typedef {Object} Nav
 * @property {string[]} levels
 * @property {string} value
 * @property {number} index
 */

/**
 * @typedef {HTMLElement & Nav} NavElement
 */

/**
 * @param {NavElement} host
 * @param {Event} e
 */
function onChange(host, e) {
	host.value = e.target.value
	dispatch(host, "change")
}

/**
 * @param {NavElement} host
 * @param {Event} e
 */
function next(host, e) {
	host.index++
	dispatch(host, "change")
}

/**
 * @param {NavElement} host
 * @param {Event} e
 */
function prev(host, e) {
	host.index--
	dispatch(host, "change")
}

export default {
	levels: ["1", "2"],
	value: "1",
	index: {
		get: ({ value, levels }) => levels.indexOf(value),
		set: (host, value) => (host.value = host.levels[value]),
	},
	render:
		/** @param {NavElement} host */
		({ levels, value, index }) =>
			html`<style>
					:host {
						width: 100%;
					}
					nav {
						padding: 1rem;
						width: 100%;
						background-image: url("wall.png");
						display: flex;
						justify-content: center;
					}
					select {
						padding: 0.5rem;
						border-radius: 0.25rem;
						border: none;
						-webkit-appearance: none;
						-moz-appearance: none;
						appearance: none;
						width: 5rem;
						background: #cbe2e3;
						font-weight: bold;
						text-align: center;
						margin: 0 0.5rem;
						cursor: pointer;
					}
					button {
						border-radius: 0.25rem;
						background: #cbe2e3;
						font-weight: bold;
						border: none;
						cursor: pointer;
					}
					button:disabled {
						background: #a6b2b3;
						cursor: not-allowed;
					}
				</style>
				<nav>
					<button disabled=${index == 0} onclick="${prev}">&lt;</button>
					<select onchange="${onChange}">
						${levels.map((l, i) => html`<option value="${l}" selected=${l == value}>${l}</option>`)}
					</select>
					<button disabled=${index == levels.length - 1} onclick="${next}">&gt;</button>
				</nav>`,
}
