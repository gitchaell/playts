import { File, FilePlus, Trash2 } from "lucide-react";
import type React from "react";

interface SidebarProps {
	files: Record<string, string>;
	activeFile: string;
	onSelectFile: (filename: string) => void;
	onAddFile: () => void;
	onDeleteFile: (filename: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
	files,
	activeFile,
	onSelectFile,
	onAddFile,
	onDeleteFile,
}) => {
	return (
		<div className="w-full md:w-64 bg-[#0d1117] border-b md:border-b-0 md:border-r border-gray-800 flex flex-col shrink-0 h-48 md:h-auto">
			<div className="p-4 border-b border-gray-800 flex items-center justify-between bg-[#161b22]">
				<span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
					Files
				</span>
				<button
					type="button"
					onClick={onAddFile}
					className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
					title="New File"
				>
					<FilePlus className="w-4 h-4" />
				</button>
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
              group flex items-center justify-between px-4 py-2 text-sm cursor-pointer select-none transition-colors
              ${
								activeFile === filename
									? "bg-[#1f2428] text-white border-l-2 border-orange-400"
									: "text-gray-400 hover:bg-[#161b22] hover:text-gray-300 border-l-2 border-transparent"
							}
            `}
					>
						<div className="flex items-center gap-2 overflow-hidden">
							<File className="w-4 h-4 shrink-0" />
							<span className="truncate">{filename}</span>
						</div>
						{filename !== "main.ts" && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onDeleteFile(filename);
								}}
								className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-900/30 text-gray-500 hover:text-red-400 rounded transition-all"
								title="Delete File"
							>
								<Trash2 className="w-3 h-3" />
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default Sidebar;
