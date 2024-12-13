import React from 'react';
import { Dialog, DialogOverlay, DialogContent, DialogClose } from '@radix-ui/react-dialog';

interface ErrorDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	message: string;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ isOpen, onOpenChange, message }) => {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
			<DialogContent className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto mt-4 md:mt-0">
				<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
					<h2 className="text-2xl font-semibold text-gray-900">Payment Failed</h2>
					<p className="mt-2 text-gray-600">{message}</p>
					<button
						type="button"
						onClick={() => onOpenChange(false)}
						className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						Close
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ErrorDialog;