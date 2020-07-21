import { html, dispatch } from "hybrids"

/**
 * @typedef {Object} Popup
 * @property {boolean} hidden
 */

/**
 * @typedef {HTMLElement & Popup} PopupElement
 */

export default {
	render:
		/** @param {PopupElement} host */
		({}) =>
			html`<style>
					:host {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						transition: opacity 0.3s ease-in-out;
						z-index: 999;
					}
					:host[hidden] {
						opacity: 0;
					}
					.backdrop {
						width: 100%;
						height: 100%;
						background: #00000099;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					.container {
						background: white;
						padding: 1rem;
						border-radius: 0.5rem;
						width: 25%;
						min-height: 15%;
						height: 0;
					}
				</style>
				<div class="backdrop">
					<div class="container">
						<slot><slot>
					</div>
				</div>`,
}
