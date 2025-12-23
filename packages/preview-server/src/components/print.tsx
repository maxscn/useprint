import { PageSize } from "@useprint/shared";
import type * as React from "react";
import { toast } from "sonner";

export const Print = ({ pdfData, options }: { pdfData?: string; options?: { pageSize?: PageSize["name"], landscape?: boolean } }) => {
	const onFormSubmit = async (e: React.FormEvent) => {
		if (typeof window === "undefined") {
			return;
		}
		e.preventDefault();
		if (!pdfData) {
			toast.error("No PDF data available to print!");
			return;
		}

		try {
			// Convert base64 to blob
			const binaryString = atob(pdfData);
			const bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}
			const blob = new Blob([bytes], { type: "application/pdf" });
			const url = URL.createObjectURL(blob);

			// Open PDF in new window and trigger print
			const printWindow = window.open(url, "_blank");
			if (printWindow) {
				printWindow.onload = () => {
					printWindow.print();
					// Clean up the URL after a delay to allow printing
					setTimeout(() => {
						URL.revokeObjectURL(url);
					}, 1000);
				};
			} else {
				toast.error("Please allow popups to print the PDF");
				URL.revokeObjectURL(url);
			}
		} catch (error) {
			console.error("Error printing PDF:", error);
			toast.error("Failed to print PDF");
		}
	};

	return (
		<button
			className="box-border flex h-5 w-20 items-center justify-center self-center rounded-lg border border-slate-6 bg-slate-2 px-4 py-4 text-center font-sans text-sm text-slate-11 outline-none transition duration-300 ease-in-out hover:border-slate-10 hover:text-slate-12"
			type="submit"
			onClick={onFormSubmit}
		>
			Print
		</button>
	);
};
