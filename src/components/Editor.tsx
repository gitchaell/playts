import MonacoEditor, { type OnMount } from "@monaco-editor/react";
import type React from "react";
import type { EditorSettings } from "./SettingsModal";

interface EditorProps extends EditorSettings {
	value: string;
	onChange: (value: string | undefined) => void;
}

const Editor: React.FC<EditorProps> = ({
	value,
	onChange,
	fontSize,
	lineNumbers,
	minimap,
	wordWrap,
}) => {
	const handleEditorDidMount: OnMount = (_editor, monaco) => {
		monaco.editor.defineTheme("github-dark", {
			base: "vs-dark",
			inherit: true,
			rules: [
				{ token: "comment", foreground: "8b949e" },
				{ token: "keyword", foreground: "ff7b72" },
				{ token: "string", foreground: "a5d6ff" },
				{ token: "number", foreground: "79c0ff" },
				{ token: "regexp", foreground: "a5d6ff" },
				{ token: "type", foreground: "79c0ff" },
				{ token: "class", foreground: "f0883e" },
				{ token: "function", foreground: "d2a8ff" },
				{ token: "variable", foreground: "79c0ff" },
				{ token: "operator", foreground: "79c0ff" },
			],
			colors: {
				"editor.background": "#0d1117",
				"editor.foreground": "#c9d1d9",
				"editorCursor.foreground": "#c9d1d9",
				"editor.lineHighlightBackground": "#6e76811a",
				"editorLineNumber.foreground": "#6e7681",
				"editor.selectionBackground": "#58a6ff33",
				"editor.inactiveSelectionBackground": "#58a6ff33",
			},
		});
		monaco.editor.setTheme("github-dark");
	};

	return (
		<div className="h-full w-full">
			<MonacoEditor
				height="100%"
				defaultLanguage="typescript"
				theme="github-dark"
				value={value}
				onChange={onChange}
				onMount={handleEditorDidMount}
				options={{
					minimap: { enabled: minimap },
					fontSize: fontSize,
					lineNumbers: lineNumbers ? "on" : "off",
					wordWrap: wordWrap ? "on" : "off",
					scrollBeyondLastLine: false,
					automaticLayout: true,
					fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
				}}
			/>
		</div>
	);
};

export default Editor;
