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

		// Generate Mermaid Diagram
		try {
			// @ts-expect-error
			const sourceFile = ts.createSourceFile(
				"temp.ts",
				code,
				// @ts-expect-error
				ts.ScriptTarget.Latest,
				true,
			);
			let mermaid = "classDiagram\n";
			let hasDiagramContent = false;
			const relationships = [];

			const visit = (node) => {
				// @ts-expect-error
				if (ts.isClassDeclaration(node) && node.name) {
					hasDiagramContent = true;
					const className = node.name.text;
					mermaid += `class ${className} {\n`;

					// Inheritance and Implementation
					// @ts-expect-error
					if (node.heritageClauses) {
						// @ts-expect-error
						node.heritageClauses.forEach((clause) => {
							// @ts-expect-error
							const isExtends = clause.token === ts.SyntaxKind.ExtendsKeyword;
							// @ts-expect-error
							clause.types.forEach((typeNode) => {
								const targetName = typeNode.expression.getText(sourceFile);
								if (isExtends) {
									relationships.push(`${className} --|> ${targetName}`);
								} else {
									relationships.push(`${className} ..|> ${targetName}`);
								}
							});
						});
					}

					node.members.forEach((member) => {
						// @ts-expect-error
						if (ts.isPropertyDeclaration(member) && member.name) {
							// @ts-expect-error
							const type = member.type ? member.type.getText(sourceFile) : "any";
							mermaid += `    +${member.name.getText(sourceFile)} : ${type}\n`;

							// Association: Check if property type is a TypeReference
							// @ts-expect-error
							if (member.type && ts.isTypeReferenceNode(member.type)) {
								// @ts-expect-error
								const typeName = member.type.typeName.getText(sourceFile);
								// Basic primitive check to avoid cluttering diagram with string, number etc.
								const primitives = [
									"string",
									"number",
									"boolean",
									"any",
									"void",
									"null",
									"undefined",
									"object",
									"symbol",
									"bigint",
									"Date",
									"Array",
									"Promise",
								];
								if (!primitives.includes(typeName)) {
									relationships.push(`${className} --> ${typeName}`);
								}
							}
						}
						// @ts-expect-error
						if (ts.isMethodDeclaration(member) && member.name) {
							mermaid += `    +${member.name.getText(sourceFile)}()\n`;
						}
					});
					mermaid += "}\n";
				}
				// @ts-expect-error
				if (ts.isInterfaceDeclaration(node) && node.name) {
					hasDiagramContent = true;
					const interfaceName = node.name.text;
					mermaid += `class ${interfaceName} {\n    <<interface>>\n`;

					// Inheritance (Interfaces can extend interfaces)
					// @ts-expect-error
					if (node.heritageClauses) {
						// @ts-expect-error
						node.heritageClauses.forEach((clause) => {
							// @ts-expect-error
							if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
								// @ts-expect-error
								clause.types.forEach((typeNode) => {
									const targetName = typeNode.expression.getText(sourceFile);
									relationships.push(`${interfaceName} --|> ${targetName}`);
								});
							}
						});
					}

					node.members.forEach((member) => {
						// @ts-expect-error
						if (ts.isPropertySignature(member) && member.name) {
							// @ts-expect-error
							const type = member.type ? member.type.getText(sourceFile) : "any";
							mermaid += `    +${member.name.getText(sourceFile)} : ${type}\n`;

							// Association
							// @ts-expect-error
							if (member.type && ts.isTypeReferenceNode(member.type)) {
								// @ts-expect-error
								const typeName = member.type.typeName.getText(sourceFile);
								const primitives = [
									"string",
									"number",
									"boolean",
									"any",
									"void",
									"null",
									"undefined",
									"object",
									"symbol",
									"bigint",
									"Date",
									"Array",
									"Promise",
								];
								if (!primitives.includes(typeName)) {
									relationships.push(`${interfaceName} --> ${typeName}`);
								}
							}
						}
						// @ts-expect-error
						if (ts.isMethodSignature(member) && member.name) {
							mermaid += `    +${member.name.getText(sourceFile)}()\n`;
						}
					});
					mermaid += "}\n";
				}
				// @ts-expect-error
				ts.forEachChild(node, visit);
			};

			visit(sourceFile);

			if (hasDiagramContent) {
				if (relationships.length > 0) {
					mermaid += "\n" + relationships.join("\n") + "\n";
				}
				self.postMessage({ type: "mermaid", data: mermaid });
			} else {
				self.postMessage({ type: "mermaid", data: undefined });
			}
		} catch (diagramError) {
			// Ignore diagram generation errors silently or log as warning
			self.postMessage({
				type: "log",
				level: "warn",
				data: `Diagram generation warning: ${diagramError.message}`,
			});
		}

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
			log: captureLog("log"),
			error: captureLog("error"),
			warn: captureLog("warn"),
			info: captureLog("info"),
			table: captureLog("log"),
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
