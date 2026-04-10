"use client";
import type React from "react";
import { useMemo, useState } from "react";
import { Document, Page, pdfjs} from "react-pdf";
import { cn } from "../utils";
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

/** Letter height/width using the same mm proportions as PAGE_SIZES (279mm × 216mm). */
const DEFAULT_PAGE_ASPECT = 279 / 216;

function PdfPageSkeleton({
	width,
	height,
}: {
	width: string | number;
	height?: string | number;
}) {
	const wNum = typeof width === "number" ? width : null;
	const hNum =
		typeof height === "number" && Number.isFinite(height) ? height : null;
	const boxHeight =
		hNum ?? (wNum != null ? Math.round(wNum * DEFAULT_PAGE_ASPECT) : null);

	const style: React.CSSProperties = {};
	if (wNum != null) {
		style.width = wNum;
	} else {
		style.width = typeof width === "string" ? width : "100%";
	}
	if (boxHeight != null) {
		style.height = boxHeight;
	} else {
		style.aspectRatio = `216 / 279`;
	}

	return (
		<div
			aria-busy="true"
			aria-label="Loading PDF"
			className="mb-6 shrink-0 animate-pulse rounded-sm bg-gray-300/80 shadow-sm ring-1 ring-black/5"
			style={style}
		/>
	);
}

type PdfViewerProps = {
	pdfData: string; // base64 encoded PDF
	width?: string | number;
	height?: string | number;
	zoom?: number;
} & Omit<React.ComponentProps<"div">, "children">;

export const PdfViewer = ({
	pdfData,
	width = "100%",
	height,
	style,
	zoom: _zoom,
	className,
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
		<div
			className={cn("flex min-h-0 min-w-0 flex-1 flex-col", className)}
			style={style}
			{...props}
		>
			<div
				className="flex min-h-0 min-w-0 flex-1 flex-col items-center overflow-auto px-4 pb-12 pt-2"
				style={{
					width: typeof width === "string" ? width : "100%",
				}}
			>
				<div className="flex w-full flex-col items-center pt-10">
					{pdfFile && (
						<Document
							file={pdfFile}
							onLoadSuccess={onDocumentLoadSuccess}
							loading={<PdfPageSkeleton width={width} height={height} />}
							error={
								<div className="p-5 text-center text-red-500">
									Error loading PDF
								</div>
							}
							className="flex w-full flex-col items-center"
						>
							{numPages &&
								Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
									<Page
										pageNumber={pageNum}
										width={pageWidth}
										height={Number(height)}
										scale={1}
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
