import MonacoEditor, { type OnMount } from "@monaco-editor/react";
import type React from "react";
import { useEffect, useRef, useCallback, useMemo } from "react";
import type { EditorSettings } from "./SettingsModal";

interface EditorProps extends EditorSettings {
	value: string;
	onChange: (value: string | undefined) => void;
	theme: string;
}

const THEMES: Record<string, any> = {
	dracula: {
		base: "vs-dark",
		inherit: true,
		rules: [
			{ token: "comment", foreground: "6272a4" },
			{ token: "keyword", foreground: "ff79c6" },
			{ token: "string", foreground: "f1fa8c" },
			{ token: "number", foreground: "bd93f9" },
			{ token: "regexp", foreground: "f1fa8c" },
			{ token: "type", foreground: "8be9fd" },
			{ token: "class", foreground: "50fa7b" },
			{ token: "function", foreground: "50fa7b" },
			{ token: "variable", foreground: "f8f8f2" },
			{ token: "operator", foreground: "ff79c6" },
		],
		colors: {
			"editor.background": "#282a36",
			"editor.foreground": "#f8f8f2",
			"editorCursor.foreground": "#f8f8f2",
			"editor.lineHighlightBackground": "#44475a",
			"editorLineNumber.foreground": "#6272a4",
			"editor.selectionBackground": "#44475a",
			"editor.inactiveSelectionBackground": "#44475a80",
		},
	},
	monokai: {
		base: "vs-dark",
		inherit: true,
		rules: [
			{ token: "comment", foreground: "75715e" },
			{ token: "keyword", foreground: "f92672" },
			{ token: "string", foreground: "e6db74" },
			{ token: "number", foreground: "ae81ff" },
			{ token: "regexp", foreground: "e6db74" },
			{ token: "type", foreground: "66d9ef" },
			{ token: "class", foreground: "a6e22e" },
			{ token: "function", foreground: "a6e22e" },
			{ token: "variable", foreground: "f8f8f2" },
			{ token: "operator", foreground: "f92672" },
		],
		colors: {
			"editor.background": "#272822",
			"editor.foreground": "#f8f8f2",
			"editorCursor.foreground": "#f8f8f2",
			"editor.lineHighlightBackground": "#3e3d32",
			"editorLineNumber.foreground": "#75715e",
			"editor.selectionBackground": "#49483e",
			"editor.inactiveSelectionBackground": "#49483e80",
		},
	},
	nord: {
		base: "vs-dark",
		inherit: true,
		rules: [
			{ token: "comment", foreground: "616e88" },
			{ token: "keyword", foreground: "81a1c1" },
			{ token: "string", foreground: "a3be8c" },
			{ token: "number", foreground: "b48ead" },
			{ token: "regexp", foreground: "a3be8c" },
			{ token: "type", foreground: "8fbcbb" },
			{ token: "class", foreground: "8fbcbb" },
			{ token: "function", foreground: "88c0d0" },
			{ token: "variable", foreground: "d8dee9" },
			{ token: "operator", foreground: "81a1c1" },
		],
		colors: {
			"editor.background": "#2e3440",
			"editor.foreground": "#d8dee9",
			"editorCursor.foreground": "#d8dee9",
			"editor.lineHighlightBackground": "#3b4252",
			"editorLineNumber.foreground": "#4c566a",
			"editor.selectionBackground": "#434c5e",
			"editor.inactiveSelectionBackground": "#434c5e80",
		},
	},
	"solarized-dark": {
		base: "vs-dark",
		inherit: true,
		rules: [
			{ token: "comment", foreground: "586e75" },
			{ token: "keyword", foreground: "859900" },
			{ token: "string", foreground: "2aa198" },
			{ token: "number", foreground: "d33682" },
			{ token: "regexp", foreground: "2aa198" },
			{ token: "type", foreground: "b58900" },
			{ token: "class", foreground: "b58900" },
			{ token: "function", foreground: "268bd2" },
			{ token: "variable", foreground: "839496" },
			{ token: "operator", foreground: "859900" },
		],
		colors: {
			"editor.background": "#002b36",
			"editor.foreground": "#839496",
			"editorCursor.foreground": "#839496",
			"editor.lineHighlightBackground": "#073642",
			"editorLineNumber.foreground": "#586e75",
			"editor.selectionBackground": "#073642",
			"editor.inactiveSelectionBackground": "#07364280",
		},
	},
	"solarized-light": {
		base: "vs",
		inherit: true,
		rules: [
			{ token: "comment", foreground: "93a1a1" },
			{ token: "keyword", foreground: "859900" },
			{ token: "string", foreground: "2aa198" },
			{ token: "number", foreground: "d33682" },
			{ token: "regexp", foreground: "2aa198" },
			{ token: "type", foreground: "b58900" },
			{ token: "class", foreground: "b58900" },
			{ token: "function", foreground: "268bd2" },
			{ token: "variable", foreground: "657b83" },
			{ token: "operator", foreground: "859900" },
		],
		colors: {
			"editor.background": "#fdf6e3",
			"editor.foreground": "#657b83",
			"editorCursor.foreground": "#657b83",
			"editor.lineHighlightBackground": "#eee8d5",
			"editorLineNumber.foreground": "#93a1a1",
			"editor.selectionBackground": "#eee8d5",
			"editor.inactiveSelectionBackground": "#eee8d580",
		},
	},
};

const Editor: React.FC<EditorProps> = ({
	value,
	onChange,
	fontSize,
	lineNumbers,
	minimap,
	wordWrap,
	theme,
	fontFamily,
	useTabs = false,
	tabWidth = 2,
	renderWhitespace = false,
}) => {
	const monacoRef = useRef<any>(null);

	const getThemeName = useCallback((t: string) => {
		if (t === "light") return "github-light";
		if (t === "dark") return "github-dark";
		return t;
	}, []);

	const handleEditorDidMount = useCallback<OnMount>((_editor, monaco) => {
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

		// Register extra themes
		Object.entries(THEMES).forEach(([name, data]) => {
			monaco.editor.defineTheme(name, data);
		});

		monaco.editor.setTheme(getThemeName(theme));
	}, [theme, getThemeName]);

	useEffect(() => {
		if (monacoRef.current) {
			monacoRef.current.editor.setTheme(getThemeName(theme));
		}
	}, [theme, getThemeName]);

	const options = useMemo(
		() => ({
			minimap: { enabled: minimap },
			fontSize: fontSize,
			lineNumbers: (lineNumbers ? "on" : "off") as "on" | "off",
			wordWrap: (wordWrap ? "on" : "off") as "on" | "off",
			scrollBeyondLastLine: false,
			automaticLayout: true,
			fontFamily:
				fontFamily || "'JetBrains Mono', 'Fira Code', Consolas, monospace",
			renderWhitespace: (renderWhitespace ? "all" : "none") as "all" | "none",
			insertSpaces: !useTabs,
			tabSize: tabWidth,
		}),
		[
			minimap,
			fontSize,
			lineNumbers,
			wordWrap,
			fontFamily,
			renderWhitespace,
			useTabs,
			tabWidth,
		],
	);

	return (
		<div className="h-full w-full">
			<MonacoEditor
				height="100%"
				defaultLanguage="typescript"
				theme={getThemeName(theme)}
				value={value}
				onChange={onChange}
				onMount={handleEditorDidMount}
				options={options}
			/>
		</div>
	);
};

export default Editor;
