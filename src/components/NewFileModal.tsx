import { X } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface NewFileModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreate: (filename: string) => void;
}

const NewFileModal: React.FC<NewFileModalProps> = ({
	isOpen,
	onClose,
	onCreate,
}) => {
	const [filename, setFilename] = useState("");

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (filename.trim()) {
			onCreate(filename.trim());
			setFilename("");
			onClose();
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="bg-bg-secondary border border-border-color rounded-lg shadow-xl w-80 overflow-hidden">
				<div className="flex items-center justify-between px-4 py-3 border-b border-border-color">
					<h2 className="text-sm font-bold text-text-header">New File</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-text-secondary hover:text-text-primary transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
				<form onSubmit={handleSubmit} className="p-4 space-y-4">
					<div>
						<label htmlFor="filename" className="block text-xs font-medium text-text-secondary mb-1">
							File Name
						</label>
						<input
							id="filename"
							type="text"
							value={filename}
							onChange={(e) => setFilename(e.target.value)}
							placeholder="e.g., utils.ts"
							className="w-full bg-bg-primary border border-border-color text-text-primary text-sm rounded-md px-3 py-2 focus:outline-none focus:border-accent-color transition-colors"
							autoFocus
						/>
					</div>
					<div className="flex justify-end space-x-2">
						<button
							type="button"
							onClick={onClose}
							className="px-3 py-1.5 bg-bg-primary hover:bg-bg-secondary text-text-secondary border border-border-color rounded text-xs font-medium transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
						>
							Create
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default NewFileModal;
