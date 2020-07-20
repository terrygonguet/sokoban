import { define, html } from "hybrids"

const Test = {
	render: ({ test }) => html`<p>This is a ${test ?? "lol"}</p>`,
}

define("test-comp", Test)
