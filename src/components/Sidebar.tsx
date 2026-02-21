import { File, FilePlus, Trash2, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

interface SidebarProps {
	files: Record<string, string>;
	activeFile: string;
	onSelectFile: (filename: string) => void;
	onAddFile: () => void;
	onDeleteFile: (filename: string) => void;
	onRenameFile: (oldName: string, newName: string) => void;
	isCollapsed: boolean;
	onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
	files,
	activeFile,
	onSelectFile,
	onAddFile,
	onDeleteFile,
	onRenameFile,
	isCollapsed,
	onToggle,
}) => {
	const [renamingFile, setRenamingFile] = useState<string | null>(null);
	const [renameValue, setRenameValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (renamingFile && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [renamingFile]);

	const handleStartRename = (filename: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setRenamingFile(filename);
		setRenameValue(filename);
	};

	const handleConfirmRename = () => {
		if (renamingFile) {
			if (renameValue.trim() && renameValue !== renamingFile) {
				onRenameFile(renamingFile, renameValue.trim());
			}
			setRenamingFile(null);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleConfirmRename();
		} else if (e.key === "Escape") {
			setRenamingFile(null);
		}
		e.stopPropagation();
	};

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
						onClick={() => !renamingFile && onSelectFile(filename)}
						onKeyDown={(e) => {
							if (!renamingFile && (e.key === 'Enter' || e.key === ' ')) {
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
						{renamingFile === filename ? (
							<div className="flex items-center gap-2 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
								<File className="w-4 h-4 shrink-0" />
								<input
									ref={inputRef}
									type="text"
									value={renameValue}
									onChange={(e) => setRenameValue(e.target.value)}
									onBlur={handleConfirmRename}
									onKeyDown={handleKeyDown}
									className="bg-bg-primary text-text-primary text-xs px-1 py-0.5 rounded border border-accent-color outline-none w-full"
								/>
							</div>
						) : (
							<>
								<div className="flex items-center gap-2 overflow-hidden">
									<File className="w-4 h-4 shrink-0" />
									{!isCollapsed && <span className="truncate">{filename}</span>}
								</div>
								{!isCollapsed && filename !== "main.ts" && (
									<div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
										<button
											type="button"
											onClick={(e) => handleStartRename(filename, e)}
											className="p-1 hover:bg-bg-primary text-text-secondary hover:text-text-primary rounded mr-1"
											title="Rename File"
										>
											<Pencil className="w-3 h-3" />
										</button>
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												onDeleteFile(filename);
											}}
											className="p-1 hover:bg-red-900/30 text-text-secondary hover:text-red-400 rounded"
											title="Delete File"
										>
											<Trash2 className="w-3 h-3" />
										</button>
									</div>
								)}
							</>
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
