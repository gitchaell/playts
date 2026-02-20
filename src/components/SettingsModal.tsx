import { X } from "lucide-react";
import type React from "react";

export interface EditorSettings {
	fontSize: number;
	lineNumbers: boolean;
	minimap: boolean;
	wordWrap: boolean;
	editorTheme: "auto" | "light" | "dark" | "dracula" | "monokai" | "nord" | "solarized-dark" | "solarized-light";
	fontFamily: string;
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
			<div className="bg-bg-secondary border border-border-color rounded-lg shadow-xl w-96 overflow-hidden">
				<div className="flex items-center justify-between px-4 py-3 border-b border-border-color">
					<h2 className="text-sm font-bold text-text-header">Editor Settings</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-text-secondary hover:text-text-primary transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
				<div className="p-4 space-y-4">
					<div className="flex items-center justify-between">
						<label htmlFor="editorTheme" className="text-sm text-text-primary">
							Editor Theme
						</label>
						<select
							id="editorTheme"
							value={settings.editorTheme || "auto"}
							onChange={(e) =>
								handleChange(
									"editorTheme",
									e.target.value as EditorSettings["editorTheme"],
								)
							}
							className="bg-bg-primary text-text-primary text-sm border border-border-color rounded px-2 py-1 outline-none focus:border-accent-color"
						>
							<option value="auto">Auto (System)</option>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
							<option value="dracula">Dracula</option>
							<option value="monokai">Monokai</option>
							<option value="nord">Nord</option>
							<option value="solarized-dark">Solarized Dark</option>
							<option value="solarized-light">Solarized Light</option>
						</select>
					</div>

					<div className="flex items-center justify-between">
						<label htmlFor="fontFamily" className="text-sm text-text-primary">
							Font Family
						</label>
						<select
							id="fontFamily"
							value={settings.fontFamily || "'JetBrains Mono', monospace"}
							onChange={(e) => handleChange("fontFamily", e.target.value)}
							className="bg-bg-primary text-text-primary text-sm border border-border-color rounded px-2 py-1 outline-none focus:border-accent-color w-40"
						>
							<option value="'JetBrains Mono', monospace">JetBrains Mono</option>
							<option value="'Fira Code', monospace">Fira Code</option>
							<option value="'Source Code Pro', monospace">Source Code Pro</option>
							<option value="'Roboto Mono', monospace">Roboto Mono</option>
							<option value="'Ubuntu Mono', monospace">Ubuntu Mono</option>
							<option value="Consolas, monospace">Consolas</option>
							<option value="'Courier New', monospace">Courier New</option>
						</select>
					</div>

					<div className="flex items-center justify-between">
						<label htmlFor="fontSize" className="text-sm text-text-primary">
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
								className="w-24 h-2 bg-bg-primary rounded-lg appearance-none cursor-pointer"
							/>
							<span className="text-xs text-text-secondary w-6 text-right">
								{settings.fontSize}px
							</span>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<label className="text-sm text-text-primary">Line Numbers</label>
						<button
							type="button"
							onClick={() => handleChange("lineNumbers", !settings.lineNumbers)}
							className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${
								settings.lineNumbers ? "bg-blue-600" : "bg-bg-primary border border-border-color"
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
						<label className="text-sm text-text-primary">Minimap</label>
						<button
							type="button"
							onClick={() => handleChange("minimap", !settings.minimap)}
							className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${
								settings.minimap ? "bg-blue-600" : "bg-bg-primary border border-border-color"
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
						<label className="text-sm text-text-primary">Word Wrap</label>
						<button
							type="button"
							onClick={() => handleChange("wordWrap", !settings.wordWrap)}
							className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${
								settings.wordWrap ? "bg-blue-600" : "bg-bg-primary border border-border-color"
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
				<div className="px-4 py-3 bg-bg-primary border-t border-border-color flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="px-3 py-1.5 bg-bg-secondary hover:bg-bg-primary text-text-secondary hover:text-text-primary border border-border-color rounded text-xs font-medium transition-colors"
					>
						Done
					</button>
				</div>
			</div>
		</div>
	);
};

export default SettingsModal;
