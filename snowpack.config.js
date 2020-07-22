module.exports = {
	devOptions: {
		port: 3000,
		open: "none",
	},
	installOptions: {
		sourceMaps: true,
	},
	compilerOptions: {
		paths: {
			"src/*": ["src/*"],
			"public/*": ["public/*"],
		},
	},
	scripts: {
		"mount:public": "mount public --to /",
		"mount:src": "mount src --to /",
		"mount:web_modules": "mount web_modules",
	},
	// plugins: [["@snowpack/plugin-webpack"]],
	install: ["hybrids"],
}
