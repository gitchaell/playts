import { File, FilePlus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";

interface SidebarProps {
	files: Record<string, string>;
	activeFile: string;
	onSelectFile: (filename: string) => void;
	onAddFile: () => void;
	onDeleteFile: (filename: string) => void;
	isCollapsed: boolean;
	onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
	files,
	activeFile,
	onSelectFile,
	onAddFile,
	onDeleteFile,
	isCollapsed,
	onToggle,
}) => {
	return (
		<div
			className={`
        bg-bg-primary border-r border-border-color flex flex-col shrink-0 transition-all duration-300 relative h-full w-full
      `}
		>
			<div className={`p-4 border-b border-border-color flex items-center bg-bg-secondary h-12 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
				{!isCollapsed && (
					<span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
						Files
					</span>
				)}
				{!isCollapsed && (
					<button
						type="button"
						onClick={onAddFile}
						className="p-1 hover:bg-bg-primary rounded text-text-secondary hover:text-text-primary transition-colors"
						title="New File"
					>
						<FilePlus className="w-4 h-4" />
					</button>
				)}
				{isCollapsed && (
					<button
						type="button"
						onClick={onAddFile}
						className="p-1 hover:bg-bg-primary rounded text-text-secondary hover:text-text-primary transition-colors"
						title="New File"
					>
						<FilePlus className="w-4 h-4" />
					</button>
				)}
			</div>

			<div className="flex-1 overflow-y-auto">
				{Object.keys(files).map((filename) => (
					<div
						key={filename}
						onClick={() => onSelectFile(filename)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								onSelectFile(filename);
							}
						}}
						className={`
              group flex items-center px-4 py-2 text-sm cursor-pointer select-none transition-colors
              ${
								activeFile === filename
									? "bg-bg-secondary text-text-primary border-l-2 border-accent-color"
									: "text-text-secondary hover:bg-bg-secondary hover:text-text-primary border-l-2 border-transparent"
							}
							${isCollapsed ? "justify-center px-2" : "justify-between"}
            `}
						title={isCollapsed ? filename : undefined}
					>
						<div className="flex items-center gap-2 overflow-hidden">
							<File className="w-4 h-4 shrink-0" />
							{!isCollapsed && <span className="truncate">{filename}</span>}
						</div>
						{!isCollapsed && filename !== "main.ts" && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onDeleteFile(filename);
								}}
								className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-900/30 text-text-secondary hover:text-red-400 rounded transition-all"
								title="Delete File"
							>
								<Trash2 className="w-3 h-3" />
							</button>
						)}
					</div>
				))}
			</div>

			{/* Collapse Button (Desktop only) */}
			<button
				type="button"
				onClick={onToggle}
				className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-bg-secondary border border-border-color rounded-full p-0.5 text-text-secondary hover:text-text-primary hidden md:flex items-center justify-center z-10 shadow-sm w-6 h-6 cursor-pointer"
				title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
			>
				{isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
			</button>
		</div>
	);
};

export default Sidebar;
