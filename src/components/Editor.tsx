import MonacoEditor, { type OnMount } from "@monaco-editor/react";
import type React from "react";
import { useEffect, useRef } from "react";
import type { EditorSettings } from "./SettingsModal";

interface EditorProps extends EditorSettings {
	value: string;
	onChange: (value: string | undefined) => void;
	theme: "light" | "dark";
}

const Editor: React.FC<EditorProps> = ({
	value,
	onChange,
	fontSize,
	lineNumbers,
	minimap,
	wordWrap,
	theme,
}) => {
	const monacoRef = useRef<any>(null);

	const handleEditorDidMount: OnMount = (_editor, monaco) => {
		monacoRef.current = monaco;

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

		monaco.editor.defineTheme("github-light", {
			base: "vs",
			inherit: true,
			rules: [
				{ token: "comment", foreground: "6a737d" },
				{ token: "keyword", foreground: "d73a49" },
				{ token: "string", foreground: "032f62" },
				{ token: "number", foreground: "005cc5" },
				{ token: "regexp", foreground: "032f62" },
				{ token: "type", foreground: "005cc5" },
				{ token: "class", foreground: "6f42c1" },
				{ token: "function", foreground: "6f42c1" },
				{ token: "variable", foreground: "005cc5" },
				{ token: "operator", foreground: "005cc5" },
			],
			colors: {
				"editor.background": "#ffffff",
				"editor.foreground": "#24292f",
				"editorCursor.foreground": "#24292f",
				"editor.lineHighlightBackground": "#f6f8fa",
				"editorLineNumber.foreground": "#1b1f234d",
				"editor.selectionBackground": "#0366d625",
				"editor.inactiveSelectionBackground": "#0366d625",
			},
		});

		monaco.editor.setTheme(theme === "dark" ? "github-dark" : "github-light");
	};

	useEffect(() => {
		if (monacoRef.current) {
			monacoRef.current.editor.setTheme(
				theme === "dark" ? "github-dark" : "github-light",
			);
		}
	}, [theme]);

	return (
		<div className="h-full w-full">
			<MonacoEditor
				height="100%"
				defaultLanguage="typescript"
				theme={theme === "dark" ? "github-dark" : "github-light"}
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
