import { X } from "lucide-react";
import type React from "react";

export interface EditorSettings {
	fontSize: number;
	lineNumbers: boolean;
	minimap: boolean;
	wordWrap: boolean;
}

interface SettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
	settings: EditorSettings;
	onSettingsChange: (settings: EditorSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
	isOpen,
	onClose,
	settings,
	onSettingsChange,
}) => {
	if (!isOpen) return null;

	const handleChange = <K extends keyof EditorSettings>(
		key: K,
		value: EditorSettings[K],
	) => {
		onSettingsChange({ ...settings, [key]: value });
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="bg-[#161b22] border border-gray-700 rounded-lg shadow-xl w-96 overflow-hidden">
				<div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
					<h2 className="text-sm font-bold text-gray-100">Editor Settings</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-400 hover:text-white transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
				<div className="p-4 space-y-4">
					<div className="flex items-center justify-between">
						<label htmlFor="fontSize" className="text-sm text-gray-300">
							Font Size
						</label>
						<div className="flex items-center space-x-2">
							<input
								type="range"
								id="fontSize"
								min="10"
								max="24"
								value={settings.fontSize}
								onChange={(e) =>
									handleChange("fontSize", Number.parseInt(e.target.value))
								}
								className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
							/>
							<span className="text-xs text-gray-400 w-6 text-right">
								{settings.fontSize}px
							</span>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<label className="text-sm text-gray-300">Line Numbers</label>
						<button
							type="button"
							onClick={() => handleChange("lineNumbers", !settings.lineNumbers)}
							className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${
								settings.lineNumbers ? "bg-blue-600" : "bg-gray-700"
							}`}
						>
							<div
								className={`w-3 h-3 bg-white rounded-full transition-transform ${
									settings.lineNumbers ? "translate-x-5" : ""
								}`}
							/>
						</button>
					</div>

					<div className="flex items-center justify-between">
						<label className="text-sm text-gray-300">Minimap</label>
						<button
							type="button"
							onClick={() => handleChange("minimap", !settings.minimap)}
							className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${
								settings.minimap ? "bg-blue-600" : "bg-gray-700"
							}`}
						>
							<div
								className={`w-3 h-3 bg-white rounded-full transition-transform ${
									settings.minimap ? "translate-x-5" : ""
								}`}
							/>
						</button>
					</div>

					<div className="flex items-center justify-between">
						<label className="text-sm text-gray-300">Word Wrap</label>
						<button
							type="button"
							onClick={() => handleChange("wordWrap", !settings.wordWrap)}
							className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${
								settings.wordWrap ? "bg-blue-600" : "bg-gray-700"
							}`}
						>
							<div
								className={`w-3 h-3 bg-white rounded-full transition-transform ${
									settings.wordWrap ? "translate-x-5" : ""
								}`}
							/>
						</button>
					</div>
				</div>
				<div className="px-4 py-3 bg-[#0d1117] border-t border-gray-700 flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs font-medium transition-colors"
					>
						Done
					</button>
				</div>
			</div>
		</div>
	);
};

export default SettingsModal;
