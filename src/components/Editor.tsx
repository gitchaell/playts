import MonacoEditor, { type OnMount } from "@monaco-editor/react";
import type React from "react";

interface EditorProps {
	value: string;
	onChange: (value: string | undefined) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
	const handleEditorDidMount: OnMount = (_editor, monaco) => {
		monaco.editor.defineTheme("github-dark", {
			base: "vs-dark",
			inherit: true,
			rules: [],
			colors: {
				"editor.background": "#0d1117",
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
					minimap: { enabled: false },
					fontSize: 14,
					scrollBeyondLastLine: false,
					automaticLayout: true,
				}}
			/>
		</div>
	);
};

export default Editor;
