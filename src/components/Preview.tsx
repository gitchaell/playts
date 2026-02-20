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
	theme: "light" | "dark";
}

const Preview: React.FC<PreviewProps> = ({ logs, diagram, onClear, theme }) => {
	const mermaidRef = useRef<HTMLDivElement>(null);
	const logsEndRef = useRef<HTMLDivElement>(null);
	const [activeTab, setActiveTab] = useState<"console" | "diagram">("console");

	useEffect(() => {
		if (activeTab === "diagram" && diagram && mermaidRef.current) {
			mermaid.initialize({
				startOnLoad: false,
				theme: theme === "dark" ? "dark" : "default",
			});
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
	}, [diagram, activeTab, theme]);

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
				return <CheckCircle className="w-4 h-4 text-text-secondary shrink-0" />;
		}
	};

	const getLogStyles = (type: Log["type"]) => {
		switch (type) {
			case "error":
				return "bg-red-100 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-200";
			case "warn":
				return "bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-200";
			case "info":
				return "bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-200";
			case "log":
			default:
				return "bg-bg-secondary border-border-color text-text-primary";
		}
	};

	return (
		<div className="h-full w-full flex flex-col bg-bg-primary text-text-primary overflow-hidden md:border-l border-border-color">
			{/* Header with Tabs */}
			<div className="flex items-center justify-between px-4 bg-bg-secondary border-b border-border-color shrink-0 h-10">
				<div className="flex h-full space-x-4">
					<button
						type="button"
						onClick={() => setActiveTab("console")}
						className={clsx(
							"h-full text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2",
							activeTab === "console"
								? "border-accent-color text-text-header"
								: "border-transparent text-text-secondary hover:text-text-primary",
						)}
					>
						Console
						{logs.length > 0 && (
							<span className="bg-bg-primary text-text-primary border border-border-color rounded-full px-1.5 py-0.5 text-[10px]">
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
								? "border-accent-color text-text-header"
								: "border-transparent text-text-secondary hover:text-text-primary",
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
						className="text-xs text-text-secondary hover:text-text-primary transition-colors"
						onClick={onClear}
					>
						Clear
					</button>
				)}
			</div>

			{/* Content Area */}
			<div className="flex-1 overflow-auto bg-bg-primary relative">
				{activeTab === "console" && (
					<div className="p-4 font-mono text-xs space-y-2 absolute inset-0 overflow-auto">
						{logs.length === 0 && (
							<div className="text-text-secondary italic text-center mt-10">
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
							<div className="text-text-secondary italic text-center text-xs">
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
