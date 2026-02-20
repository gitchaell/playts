import clsx from "clsx";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import mermaid from "mermaid";
import type React from "react";
import { useEffect, useRef, useState } from "react";

export interface Log {
	type: "log" | "error" | "warn" | "info";
	data: string;
}

interface PreviewProps {
	logs: Log[];
	diagram?: string;
	onClear?: () => void;
}

const Preview: React.FC<PreviewProps> = ({ logs, diagram, onClear }) => {
	const mermaidRef = useRef<HTMLDivElement>(null);
	const logsEndRef = useRef<HTMLDivElement>(null);
	const [activeTab, setActiveTab] = useState<"console" | "diagram">("console");

	// Auto-switch to diagram tab if a new diagram arrives and we are not explicitly viewing logs?
	// Or maybe just show an indicator. For now, let's keep it manual to avoid annoyance.
	// But if there is a diagram, we might want to highlight the tab.

	useEffect(() => {
		if (activeTab === "diagram" && diagram && mermaidRef.current) {
			mermaid.initialize({ startOnLoad: false, theme: "dark" });
			const id = `mermaid-${Date.now()}`;
			mermaid
				.render(id, diagram)
				.then(({ svg }) => {
					if (mermaidRef.current) {
						mermaidRef.current.innerHTML = svg;
					}
				})
				.catch((e) => {
					if (mermaidRef.current) {
						mermaidRef.current.innerHTML = `<div class="text-red-500 text-xs">${e.message}</div>`;
					}
				});
		} else if (activeTab === "diagram" && !diagram && mermaidRef.current) {
			mermaidRef.current.innerHTML = "";
		}
	}, [diagram, activeTab]);

	// Auto-scroll to bottom of logs
	useEffect(() => {
		if (activeTab === "console") {
			logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [logs, activeTab]);

	const getLogIcon = (type: Log["type"]) => {
		switch (type) {
			case "error":
				return <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
			case "warn":
				return <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />;
			case "info":
				return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
			case "log":
			default:
				return <CheckCircle className="w-4 h-4 text-gray-400 shrink-0" />;
		}
	};

	const getLogStyles = (type: Log["type"]) => {
		switch (type) {
			case "error":
				return "bg-red-900/20 border-red-900/50 text-red-200";
			case "warn":
				return "bg-yellow-900/20 border-yellow-900/50 text-yellow-200";
			case "info":
				return "bg-blue-900/20 border-blue-900/50 text-blue-200";
			case "log":
			default:
				return "bg-gray-800/40 border-gray-700/50 text-gray-300";
		}
	};

	return (
		<div className="h-full w-full flex flex-col bg-[#0d1117] text-gray-300 overflow-hidden md:border-l border-gray-800">
			{/* Header with Tabs */}
			<div className="flex items-center justify-between px-4 bg-[#161b22] border-b border-gray-800 shrink-0 h-10">
				<div className="flex h-full space-x-4">
					<button
						type="button"
						onClick={() => setActiveTab("console")}
						className={clsx(
							"h-full text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2",
							activeTab === "console"
								? "border-orange-400 text-gray-100"
								: "border-transparent text-gray-500 hover:text-gray-300",
						)}
					>
						Console
						{logs.length > 0 && (
							<span className="bg-gray-700 text-gray-300 rounded-full px-1.5 py-0.5 text-[10px]">
								{logs.length}
							</span>
						)}
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("diagram")}
						className={clsx(
							"h-full text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2",
							activeTab === "diagram"
								? "border-orange-400 text-gray-100"
								: "border-transparent text-gray-500 hover:text-gray-300",
						)}
					>
						Diagram
						{diagram && (
							<span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
						)}
					</button>
				</div>

				{activeTab === "console" && (
					<button
						type="button"
						className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
						onClick={onClear}
					>
						Clear
					</button>
				)}
			</div>

			{/* Content Area */}
			<div className="flex-1 overflow-auto bg-[#0d1117] relative">
				{activeTab === "console" && (
					<div className="p-4 font-mono text-xs space-y-2 absolute inset-0 overflow-auto">
						{logs.length === 0 && (
							<div className="text-gray-600 italic text-center mt-10">
								No output
							</div>
						)}
						{logs.map((log, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: Logs are append-only
								key={i}
								className={clsx(
									"flex items-start space-x-2 p-2 rounded border",
									getLogStyles(log.type),
								)}
							>
								<div className="mt-0.5">{getLogIcon(log.type)}</div>
								<div className="whitespace-pre-wrap break-all leading-relaxed">
									{log.data}
								</div>
							</div>
						))}
						<div ref={logsEndRef} />
					</div>
				)}

				{activeTab === "diagram" && (
					<div className="h-full w-full flex flex-col items-center justify-center p-4 overflow-auto">
						{!diagram ? (
							<div className="text-gray-600 italic text-center text-xs">
								No diagram generated.
								<br />
								Define a class or interface to see a visualization.
							</div>
						) : (
							<div ref={mermaidRef} className="w-full h-full flex justify-center" />
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Preview;
