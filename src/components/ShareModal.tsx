import { Check, Copy, X } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface ShareModalProps {
	isOpen: boolean;
	onClose: () => void;
	url: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url }) => {
	const [copied, setCopied] = useState(false);

	if (!isOpen) return null;

	const handleCopy = () => {
		navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="bg-bg-secondary border border-border-color rounded-lg shadow-xl w-[500px] overflow-hidden">
				<div className="flex items-center justify-between px-4 py-3 border-b border-border-color">
					<h2 className="text-sm font-bold text-text-header">Share Playground</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-text-secondary hover:text-text-primary transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
				<div className="p-4 space-y-4">
					<p className="text-sm text-text-primary">
						Anyone with this link can view your playground.
					</p>
					<div className="flex items-center space-x-2">
						<input
							type="text"
							readOnly
							value={url}
							className="flex-1 bg-bg-primary border border-border-color text-text-primary text-sm rounded-md px-3 py-2 focus:outline-none focus:border-accent-color font-mono"
						/>
						<button
							type="button"
							onClick={handleCopy}
							className={`px-3 py-2 rounded-md text-white transition-colors flex items-center space-x-1 ${
								copied
									? "bg-green-600 hover:bg-green-700"
									: "bg-blue-600 hover:bg-blue-700"
							}`}
						>
							{copied ? (
								<>
									<Check className="w-4 h-4" />
									<span className="text-xs font-medium">Copied</span>
								</>
							) : (
								<>
									<Copy className="w-4 h-4" />
									<span className="text-xs font-medium">Copy</span>
								</>
							)}
						</button>
					</div>
				</div>
				<div className="px-4 py-3 bg-bg-primary border-t border-border-color flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="px-3 py-1.5 bg-bg-secondary hover:bg-bg-primary text-text-secondary hover:text-text-primary border border-border-color rounded text-xs font-medium transition-colors"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default ShareModal;
