import clsx from "clsx";
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
}

const Preview: React.FC<PreviewProps> = ({ logs, diagram }) => {
	const mermaidRef = useRef<HTMLDivElement>(null);

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

	return (
		<div className="h-full w-full flex flex-col bg-[#0d1117] text-gray-300 overflow-hidden border-l border-gray-800">
			<div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-800">
				<span className="text-xs font-bold text-gray-400 uppercase">
					Console
				</span>
				<button
					type="button"
					className="text-xs text-gray-500 hover:text-gray-300"
					onClick={() => {}} // Clear logs?
				>
					Clear
				</button>
			</div>
			<div className="flex-1 p-4 overflow-auto font-mono text-xs">
				{logs.length === 0 && !diagram && (
					<div className="text-gray-600 italic">No output</div>
				)}
				{logs.map((log, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: Logs are append-only and simple
						key={i}
						className={clsx(
							"whitespace-pre-wrap break-all mb-1 border-b border-gray-800/50 pb-1",
							{
								"text-red-400": log.type === "error",
								"text-yellow-400": log.type === "warn",
								"text-blue-400": log.type === "info",
								"text-gray-300": log.type === "log",
							},
						)}
					>
						{log.data}
					</div>
				))}
			</div>
			{diagram && (
				<div className="h-1/2 border-t border-gray-800 bg-[#0d1117] flex flex-col">
					<div className="px-4 py-2 bg-[#161b22] border-b border-gray-800 text-xs font-bold text-gray-400 uppercase">
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
