import { Code, Link, Settings } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { compress, decompress } from "../utils/sharing";
import Editor from "./Editor";
import Preview, { type Log } from "./Preview";
import Sidebar from "./Sidebar";
import SettingsModal, { type EditorSettings } from "./SettingsModal";
import ShareModal from "./ShareModal";

const DEFAULT_CODE = `// Welcome to PlayTS!
// A simple TypeScript playground.

console.log("Hello, PlayTS!");

const add = (a: number, b: number) => a + b;
console.log("1 + 2 =", add(1, 2));

// You can use standard console methods
console.warn("This is a warning");
console.error("This is an error");
`;

interface Files {
	[filename: string]: string;
}

const Playground: React.FC = () => {
	// State for files
	const [files, setFiles] = useLocalStorage<Files>("playts-files", {
		"main.ts": DEFAULT_CODE,
	});
	const [activeFile, setActiveFile] = useState<string>("main.ts");

	// State for logs and diagrams
	const [logs, setLogs] = useState<Log[]>([]);
	const [diagram, setDiagram] = useState<string | undefined>();

	// Modals state
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isShareOpen, setIsShareOpen] = useState(false);
	const [shareUrl, setShareUrl] = useState("");

	// Editor settings
	const [editorSettings, setEditorSettings] = useLocalStorage<EditorSettings>(
		"playts-settings",
		{
			fontSize: 14,
			lineNumbers: true,
			minimap: false,
			wordWrap: false,
		},
	);

	const workerRef = useRef<Worker | null>(null);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Load shared code from URL
	useEffect(() => {
		const hash = window.location.hash.slice(1);
		if (hash) {
			const decoded = decompress(hash);
			if (decoded) {
				// Backward compatibility: check if decoded is a string (old format) or JSON object (new format)
				try {
					const parsed = JSON.parse(decoded);
					if (typeof parsed === 'object' && parsed !== null) {
						setFiles(parsed);
						setActiveFile(Object.keys(parsed)[0] || "main.ts");
					} else {
						// Fallback for old simple string format
						setFiles({ "main.ts": decoded });
					}
				} catch {
					// Fallback for old simple string format
					setFiles({ "main.ts": decoded });
				}
			}
		}
	}, [setFiles]);

	// Initialize worker
	useEffect(() => {
		workerRef.current = new Worker("/worker.js");
		workerRef.current.onmessage = (e) => {
			const { type, data, level } = e.data;
			if (type === "log") {
				setLogs((prev) => [...prev, { type: level || "log", data }]);
			} else if (type === "mermaid") {
				setDiagram(data);
			} else if (type === "error") {
				setLogs((prev) => [...prev, { type: "error", data }]);
			}
		};

		return () => {
			workerRef.current?.terminate();
		};
	}, []);

	// Run code function
	const runCode = useCallback((codeToRun: string) => {
		setLogs([]);
		setDiagram(undefined);
		if (workerRef.current) {
			workerRef.current.postMessage({ code: codeToRun });
		}
	}, []);

	// Auto-run when active file content changes
	useEffect(() => {
		const currentCode = files[activeFile];
		if (currentCode === undefined) return;

		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(() => {
			runCode(currentCode);
		}, 1000);

		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [files, activeFile, runCode]);

	const handleCodeChange = (newCode: string | undefined) => {
		setFiles((prev) => ({
			...prev,
			[activeFile]: newCode || "",
		}));
	};

	const handleShare = () => {
		const hash = compress(JSON.stringify(files));
		const url = `${window.location.origin}${window.location.pathname}#${hash}`;
		setShareUrl(url);
		setIsShareOpen(true);
	};

	const handleAddFile = () => {
		const filename = prompt("Enter file name (e.g., utils.ts):");
		if (filename && !files[filename]) {
			setFiles((prev) => ({ ...prev, [filename]: "" }));
			setActiveFile(filename);
		} else if (filename) {
			alert("File already exists!");
		}
	};

	const handleDeleteFile = (filename: string) => {
		if (Object.keys(files).length <= 1) {
			alert("Cannot delete the last file.");
			return;
		}
		if (confirm(`Are you sure you want to delete ${filename}?`)) {
			const newFiles = { ...files };
			delete newFiles[filename];
			setFiles(newFiles);
			if (activeFile === filename) {
				setActiveFile(Object.keys(newFiles)[0]);
			}
		}
	};

	return (
		<div className="h-screen w-screen flex flex-col bg-[#0d1117] text-gray-300 font-sans overflow-hidden">
			{/* Header */}
			<header className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-[#161b22] shrink-0">
				<div className="flex items-center space-x-2">
					<Code className="w-5 h-5 text-blue-500" />
					<h1 className="font-bold text-sm tracking-wide text-gray-100">
						PlayTS
					</h1>
				</div>
				<div className="flex items-center space-x-2">
					<button
						type="button"
						onClick={handleShare}
						className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs font-medium transition-colors border border-gray-600 shadow-sm"
					>
						<Link className="w-3 h-3" />
						<span>Share</span>
					</button>
					<button
						type="button"
						onClick={() => setIsSettingsOpen(true)}
						className="p-1.5 text-gray-400 hover:text-white transition-colors"
						title="Settings"
					>
						<Settings className="w-5 h-5" />
					</button>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex-1 flex flex-col md:flex-row overflow-hidden">
				{/* Sidebar */}
				<Sidebar
					files={files}
					activeFile={activeFile}
					onSelectFile={setActiveFile}
					onAddFile={handleAddFile}
					onDeleteFile={handleDeleteFile}
				/>

				{/* Editor & Preview Container */}
				<div className="flex-1 flex flex-col md:flex-row overflow-hidden">
					{/* Editor */}
					<div className="flex-1 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-gray-800 bg-[#0d1117]">
						<Editor
							value={files[activeFile] || ""}
							onChange={handleCodeChange}
							{...editorSettings}
						/>
					</div>

					{/* Preview */}
					<div className="flex-1 h-1/2 md:h-full bg-[#0d1117] overflow-hidden">
						<Preview
							logs={logs}
							diagram={diagram}
							onClear={() => {
								setLogs([]);
								setDiagram(undefined);
							}}
						/>
					</div>
				</div>
			</div>

			{/* Modals */}
			<SettingsModal
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				settings={editorSettings}
				onSettingsChange={setEditorSettings}
			/>
			<ShareModal
				isOpen={isShareOpen}
				onClose={() => setIsShareOpen(false)}
				url={shareUrl}
			/>
		</div>
	);
};

export default Playground;
