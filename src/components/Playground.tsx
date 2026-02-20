import { Code, Link, Play, Trash } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { compress, decompress } from "../utils/sharing";
import Editor from "./Editor";
import Preview, { type Log } from "./Preview";

const DEFAULT_CODE = `// Welcome to PlayTS!
// A simple TypeScript playground.

console.log("Hello, PlayTS!");

const add = (a: number, b: number) => a + b;
console.log("1 + 2 =", add(1, 2));

// You can use standard console methods
console.warn("This is a warning");
console.error("This is an error");
`;

const Playground: React.FC = () => {
	const [code, setCode] = useLocalStorage<string>("playts-code", DEFAULT_CODE);
	const [logs, setLogs] = useState<Log[]>([]);
	const [diagram, setDiagram] = useState<string | undefined>();
	const workerRef = useRef<Worker | null>(null);

	useEffect(() => {
		// Check URL hash for shared code
		const hash = window.location.hash.slice(1);
		if (hash) {
			const decoded = decompress(hash);
			if (decoded) {
				setCode(decoded);
			}
		}
	}, [setCode]);

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

	const handleRun = useCallback(() => {
		setLogs([]);
		setDiagram(undefined);
		if (workerRef.current) {
			workerRef.current.postMessage({ code });
		}
	}, [code]);

	const handleShare = useCallback(() => {
		const hash = compress(code);
		window.location.hash = hash;
		navigator.clipboard.writeText(window.location.href);
		// Could add a toast notification here
		alert("URL copied to clipboard!");
	}, [code]);

	const handleClear = useCallback(() => {
		setLogs([]);
		setDiagram(undefined);
	}, []);

	return (
		<div className="h-screen w-screen flex flex-col bg-[#0d1117] text-gray-300 font-sans overflow-hidden">
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
						onClick={handleRun}
						className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-medium transition-colors border border-green-800 shadow-sm"
					>
						<Play className="w-3 h-3" />
						<span>Run</span>
					</button>
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
						onClick={handleClear}
						className="flex items-center space-x-1 px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-200 rounded-md text-xs font-medium transition-colors border border-red-900/50 shadow-sm"
					>
						<Trash className="w-3 h-3" />
						<span>Clear Output</span>
					</button>
				</div>
			</header>
			<div className="flex-1 flex overflow-hidden">
				<div className="w-1/2 h-full border-r border-gray-800 bg-[#0d1117]">
					<Editor value={code} onChange={(val) => setCode(val || "")} />
				</div>
				<div className="w-1/2 h-full bg-[#0d1117] overflow-hidden">
					<Preview logs={logs} diagram={diagram} />
				</div>
			</div>
		</div>
	);
};

export default Playground;
