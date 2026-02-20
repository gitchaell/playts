importScripts("./typescript.min.js");

self.onmessage = (e) => {
	const { code } = e.data;

	try {
		// Transpile TypeScript to JavaScript
		// @ts-expect-error
		const jsCode = ts.transpile(code, {
			// @ts-expect-error
			target: ts.ScriptTarget.ES2020,
			// @ts-expect-error
			module: ts.ModuleKind.None,
		});

		// Capture logs
		const captureLog =
			(level) =>
			(...args) => {
				const message = args
					.map((arg) => {
						try {
							return typeof arg === "object"
								? JSON.stringify(arg)
								: String(arg);
						} catch (_e) {
							return String(arg);
						}
					})
					.join(" ");
				self.postMessage({ type: "log", level, data: message });
			};

		const customConsole = {
			log: captureLog("info"),
			error: captureLog("error"),
			warn: captureLog("warn"),
			info: captureLog("info"),
		};

		// Execute the code
		try {
			// We use a function constructor to run the code
			// We pass 'console' as an argument to shadow the global console
			const run = new Function("console", jsCode);
			run(customConsole);
		} catch (runtimeError) {
			self.postMessage({ type: "error", data: runtimeError.toString() });
		}
	} catch (compileError) {
		self.postMessage({
			type: "error",
			data: `Compilation Error: ${compileError.toString()}`,
		});
	}
};
