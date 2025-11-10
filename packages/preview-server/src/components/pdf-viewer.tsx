"use client";
import type React from "react";
import { useMemo, useState } from "react";
import { Document, Page, pdfjs} from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
// Set up the worker for react-pdf (which uses pdfjs-dist under the hood)
// Use the worker from cdnjs.cloudflare.com matching the installed pdfjs-dist version
// Using .js extension instead of .mjs for better compatibility
// if (pdfjs) {
// 	pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// }

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

type PdfViewerProps = {
	pdfData: string; // base64 encoded PDF
	width?: string | number;
	height?: string | number;
	style?: React.CSSProperties;
	zoom?: number;
};

export const PdfViewer = ({
	pdfData,
	width = "100%",
	height,
	style,
	zoom: initialZoom,
	...props
}: PdfViewerProps) => {
	const [numPages, setNumPages] = useState<number | null>(null);

	// Convert base64 to data URI for react-pdf
	const pdfFile = useMemo(() => {
		if (!pdfData) return null;
		return `data:application/pdf;base64,${pdfData}`;
	}, [pdfData]);

	const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
		setNumPages(numPages);
	};

	const pageWidth = typeof width === "number" ? width : undefined;

	return (
		<div className="flex flex-col h-full min-w-full" style={style} {...props}>
			<div
				className="flex-1 overflow-auto flex flex-col items-center px-4 min-w-full"
				style={{
					width: typeof width === "string" ? width : "100%",
				}}
			>
				<div className="flex flex-col w-full items-center min-h-full justify-center py-12">
					{pdfFile && (
						<Document

							file={pdfFile}
							onLoadSuccess={onDocumentLoadSuccess}
							loading={<div className="text-center p-5">Loading PDF...</div>}
							error={
								<div className="p-5 text-center text-red-500">
									Error loading PDF
								</div>
							}
							className="flex flex-col items-center w-full max-h-full"
						>
							{numPages &&
								Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
										<Page
											pageNumber={pageNum}
											width={pageWidth}
											height={Number(height)}
											scale={1}
											// scale={scale}
											renderTextLayer
											renderAnnotationLayer
											className="mb-6"
											key={pageNum}
										/>
								))}
						</Document>
					)}
				</div>
			</div>
		</div>
	);
};

export default PdfViewer;
