import clsx from "clsx";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import mermaid from "mermaid";
import type React from "react";
import { useEffect, useRef } from "react";

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

	useEffect(() => {
		if (diagram && mermaidRef.current) {
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
		} else if (!diagram && mermaidRef.current) {
			mermaidRef.current.innerHTML = "";
		}
	}, [diagram]);

    // Auto-scroll to bottom of logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

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
			<div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-800 shrink-0">
				<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
					Console
				</span>
				<button
					type="button"
					className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
					onClick={onClear}
				>
					Clear
				</button>
			</div>
			<div className="flex-1 p-4 overflow-auto font-mono text-xs space-y-2">
				{logs.length === 0 && !diagram && (
					<div className="text-gray-600 italic text-center mt-10">No output</div>
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
			{diagram && (
				<div className="h-1/2 border-t border-gray-800 bg-[#0d1117] flex flex-col">
					<div className="px-4 py-2 bg-[#161b22] border-b border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-wider">
						Mermaid Diagram
					</div>
					<div className="flex-1 p-4 overflow-auto flex justify-center items-center">
						<div ref={mermaidRef}></div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Preview;
