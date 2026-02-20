import { Code, Settings, Sun, Moon, Share2, Folder, X } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { compress, decompress } from "../utils/sharing";
import Editor from "./Editor";
import Preview, { type Log } from "./Preview";
import Sidebar from "./Sidebar";
import SettingsModal, { type EditorSettings } from "./SettingsModal";
import ShareModal from "./ShareModal";
import NewFileModal from "./NewFileModal";

const DEFAULT_CODE = `// Welcome to PlayTS!
// A simple TypeScript playground.

console.log("Hello, PlayTS!");

// Interfaces
interface User {
  id: number;
  name: string;
  role: "admin" | "user";
}

// Classes
class UserManager {
  private users: User[] = [];

  addUser(user: User) {
    this.users.push(user);
    console.log(\`User \${user.name} added.\`);
  }

  getUsers(): User[] {
    return this.users;
  }
}

// Usage
const manager = new UserManager();
manager.addUser({ id: 1, name: "Alice", role: "admin" });
manager.addUser({ id: 2, name: "Bob", role: "user" });

console.table(manager.getUsers());

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
	const [files, setFiles] = useLocalStorage<Files>("playts-files-v2", {
		"main.ts": DEFAULT_CODE,
	});
	const [activeFile, setActiveFile] = useState<string>("main.ts");

	// State for logs and diagrams
	const [logs, setLogs] = useState<Log[]>([]);
	const [diagram, setDiagram] = useState<string | undefined>();

	// Modals state
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isShareOpen, setIsShareOpen] = useState(false);
	const [isNewFileOpen, setIsNewFileOpen] = useState(false);
	const [isFilesOpen, setIsFilesOpen] = useState(false);
	const [shareUrl, setShareUrl] = useState("");

	// Theme state
	const [theme, setTheme] = useLocalStorage<"light" | "dark">("playts-theme", "dark");

	// Layout state
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage<boolean>("playts-layout-sidebar-collapsed", false);
	const [sidebarWidth, setSidebarWidth] = useLocalStorage<number>("playts-layout-sidebar-width", 250);
	const [editorRatio, setEditorRatio] = useLocalStorage<number>("playts-layout-editor-ratio", 0.5);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Editor settings
	const [editorSettings, setEditorSettings] = useLocalStorage<EditorSettings>(
		"playts-settings",
		{
			fontSize: 14,
			lineNumbers: true,
			minimap: false,
			wordWrap: false,
			editorTheme: "auto",
			fontFamily: "'JetBrains Mono', monospace",
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
				try {
					const parsed = JSON.parse(decoded);
					if (typeof parsed === 'object' && parsed !== null) {
						setFiles(parsed);
						setActiveFile(Object.keys(parsed)[0] || "main.ts");
					} else {
						setFiles({ "main.ts": decoded });
					}
				} catch {
					setFiles({ "main.ts": decoded });
				}
			}
		}
	}, [setFiles]);

	// Apply theme
	useEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

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

	const handleCreateFile = (filename: string) => {
		if (!files[filename]) {
			setFiles((prev) => ({ ...prev, [filename]: "" }));
			setActiveFile(filename);
		} else {
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

	const toggleTheme = () => {
		setTheme(prev => prev === "dark" ? "light" : "dark");
	};

	// Drag Handlers
	const handleSidebarResize = (e: React.MouseEvent) => {
		if (isMobile) return;
		e.preventDefault();
		const startX = e.clientX;
		const startWidth = sidebarWidth;

		const handleMouseMove = (moveEvent: MouseEvent) => {
			const newWidth = Math.max(150, Math.min(400, startWidth + (moveEvent.clientX - startX)));
			setSidebarWidth(newWidth);
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleEditorResize = (e: React.MouseEvent) => {
		e.preventDefault();
		const container = e.currentTarget.parentElement;
		if (!container) return;

		const containerRect = container.getBoundingClientRect();
		const isHorizontal = !isMobile;

		const handleMouseMove = (moveEvent: MouseEvent) => {
			let newRatio: number;
			if (isHorizontal) {
				const relativeX = moveEvent.clientX - containerRect.left;
				newRatio = relativeX / containerRect.width;
			} else {
				const relativeY = moveEvent.clientY - containerRect.top;
				newRatio = relativeY / containerRect.height;
			}
			setEditorRatio(Math.max(0.2, Math.min(0.8, newRatio)));
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};


	return (
		<div className="h-dvh w-screen flex flex-col bg-bg-primary text-text-primary font-sans overflow-hidden transition-colors duration-200">
			{/* Header */}
			<header className="h-12 border-b border-border-color flex items-center justify-between px-4 bg-bg-secondary shrink-0 z-20">
				<div className="flex items-center space-x-2">
					{isMobile && (
						<button
							type="button"
							onClick={() => setIsFilesOpen(!isFilesOpen)}
							className="p-1.5 -ml-2 mr-1 text-text-secondary hover:text-text-primary transition-colors"
							title="Toggle Files"
						>
							{isFilesOpen ? <X className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
						</button>
					)}
					<Code className="w-5 h-5 text-accent-color" />
					<h1 className="font-bold text-sm tracking-wide text-text-header">
						PlayTS
					</h1>
				</div>
				<div className="flex items-center space-x-2">
					<button
						type="button"
						onClick={toggleTheme}
						className="p-1.5 text-text-secondary hover:text-text-primary transition-colors"
						title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
					>
						{theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
					</button>
					<div className="h-4 w-px bg-border-color mx-2" />
					<button
						type="button"
						onClick={handleShare}
						className="flex items-center space-x-1 px-3 py-1.5 bg-bg-primary hover:bg-bg-secondary text-text-primary rounded-md text-xs font-medium transition-colors border border-border-color shadow-sm"
					>
						<Share2 className="w-3 h-3" />
						<span className="hidden sm:inline">Share</span>
					</button>
					<button
						type="button"
						onClick={() => setIsSettingsOpen(true)}
						className="p-1.5 text-text-secondary hover:text-text-primary transition-colors"
						title="Settings"
					>
						<Settings className="w-5 h-5" />
					</button>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
				{/* Sidebar (Desktop) */}
				{!isMobile && (
					<>
						<div
							className="flex flex-col shrink-0 h-full transition-[width] duration-0 ease-linear"
							style={{ width: isSidebarCollapsed ? 'auto' : sidebarWidth }}
						>
							<Sidebar
								files={files}
								activeFile={activeFile}
								onSelectFile={setActiveFile}
								onAddFile={() => setIsNewFileOpen(true)}
								onDeleteFile={handleDeleteFile}
								isCollapsed={isSidebarCollapsed}
								onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
							/>
						</div>
						{!isSidebarCollapsed && (
							<div
								className="w-1 hover:bg-accent-color cursor-col-resize z-10 hover:w-1.5 transition-all bg-transparent -ml-0.5"
								onMouseDown={handleSidebarResize}
							/>
						)}
					</>
				)}

				{/* Editor & Preview Container */}
				<div className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-w-0">
					{/* Editor */}
					<div
						className="flex-col overflow-hidden bg-bg-primary h-1/2 md:h-full"
						style={{ flex: editorRatio }}
					>
						<Editor
							value={files[activeFile] || ""}
							onChange={handleCodeChange}
							theme={
								editorSettings.editorTheme !== "auto"
									? editorSettings.editorTheme
									: theme
							}
							{...editorSettings}
						/>
					</div>

					{/* Resizer */}
					<div
						className="h-1 md:h-auto md:w-1 bg-border-color hover:bg-accent-color cursor-row-resize md:cursor-col-resize z-10 transition-colors flex items-center justify-center shrink-0"
						onMouseDown={handleEditorResize}
					/>

					{/* Preview */}
					<div
						className="flex-col overflow-hidden bg-bg-primary min-w-0 h-1/2 md:h-full"
						style={{ flex: 1 - editorRatio }}
					>
						<Preview
							logs={logs}
							diagram={diagram}
							onClear={() => {
								setLogs([]);
								setDiagram(undefined);
							}}
							theme={theme}
						/>
					</div>
				</div>
			</div>

			{/* Mobile Sidebar Overlay */}
			{isMobile && isFilesOpen && (
				<div
					className="absolute inset-0 z-30 bg-black/50 backdrop-blur-sm"
					onClick={() => setIsFilesOpen(false)}
					onKeyDown={(e) => e.key === 'Escape' && setIsFilesOpen(false)}
				>
					<div
						className="h-full w-64 shadow-xl flex flex-col"
						onClick={(e) => e.stopPropagation()}
					>
						<Sidebar
							files={files}
							activeFile={activeFile}
							onSelectFile={(file) => {
								setActiveFile(file);
								setIsFilesOpen(false);
							}}
							onAddFile={() => setIsNewFileOpen(true)}
							onDeleteFile={handleDeleteFile}
							isCollapsed={false}
							onToggle={() => {}}
						/>
					</div>
				</div>
			)}

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
			<NewFileModal
				isOpen={isNewFileOpen}
				onClose={() => setIsNewFileOpen(false)}
				onCreate={handleCreateFile}
			/>
		</div>
	);
};

export default Playground;
