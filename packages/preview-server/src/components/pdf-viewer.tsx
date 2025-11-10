"use client";
import * as pdfjsLib from "pdfjs-dist";
import type React from "react";
import { forwardRef, useEffect, useRef, useState } from "react";
import type { MeasuredIframeProps } from "./measured-iframe";

// Set up the worker for pdfjs-dist
if (typeof window !== "undefined") {
	// Use unpkg CDN which is more reliable than cdnjs for pdfjs-dist
	pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

type PdfViewerProps = {
	pdfData: string; // base64 encoded PDF
	width?: string | number;
	height?: string | number;
	style?: React.CSSProperties;
} & Omit<MeasuredIframeProps, "srcDoc" | "ref">;

export const PdfViewer = forwardRef<HTMLDivElement, PdfViewerProps>(
	({ pdfData, width = "100%", height = 600, style, ...props }, ref) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const [loading, setLoading] = useState(true);
		const [error, setError] = useState<string | null>(null);
		const canvasRefs = useRef<HTMLCanvasElement[]>([]);

		// Add logging to check if pdfData is received
		useEffect(() => {
			console.log("PdfViewer received pdfData:", {
				hasData: !!pdfData,
				dataLength: pdfData?.length || 0,
				firstChars: pdfData?.substring(0, 50) || "none",
			});
		}, [pdfData]);

		// Combine refs
		useEffect(() => {
			if (typeof ref === "function") {
				ref(containerRef.current);
			} else if (ref) {
				ref.current = containerRef.current;
			}
		}, [ref]);

		useEffect(() => {
			if (!pdfData) {
				console.log("PdfViewer: No pdfData, returning early");
				return;
			}

			console.log("PdfViewer: Starting PDF load process");

			const loadPdf = async () => {
				try {
					setLoading(true);
					setError(null);

					// Convert base64 to Uint8Array
					const binaryString = atob(pdfData);
					const bytes = new Uint8Array(binaryString.length);
					for (let i = 0; i < binaryString.length; i++) {
						bytes[i] = binaryString.charCodeAt(i);
					}

					// Load the PDF document
					console.log("loading PDF");
					const loadingTask = pdfjsLib.getDocument({ data: bytes });
					const pdf = await loadingTask.promise;
					console.log("PDF loaded", pdf.numPages, "pages");
					
					// Render all pages
					const pagePromises: Promise<void>[] = [];
					for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
						pagePromises.push(renderPage(pdf, pageNum));
					}
					await Promise.all(pagePromises);
					console.log("All pages rendered");

				} catch (err) {
					console.error("Error loading PDF:", err);
					setError(err instanceof Error ? err.message : "Failed to load PDF");
				} finally {
					setLoading(false);
				}
			};

			const renderPage = async (
				pdf: pdfjsLib.PDFDocumentProxy,
				pageNum: number,
			) => {
				const page = await pdf.getPage(pageNum);
				const viewport = page.getViewport({ scale: 1.5 });

				// Create or get canvas for this page
				let canvas = canvasRefs.current[pageNum - 1];
				if (!canvas) {
					canvas = document.createElement("canvas");
					canvasRefs.current[pageNum - 1] = canvas;
					canvas.className = "pdf-page-canvas";
					canvas.style.display = "block";
					canvas.style.margin = "0 auto 1em auto";
					
					// Append to container - it should be available since container is always rendered
					const container = containerRef.current;
					if (container) {
						container.appendChild(canvas);
					} else {
						console.warn(`Container ref not available when rendering page ${pageNum}, retrying...`);
						// Retry after a short delay if container isn't ready
						await new Promise(resolve => setTimeout(resolve, 100));
						const retryContainer = containerRef.current;
						if (retryContainer) {
							retryContainer.appendChild(canvas);
						} else {
							console.error(`Failed to append canvas for page ${pageNum} - container ref is null`);
							return;
						}
					}
				}

				const context = canvas.getContext("2d");
				if (!context) {
					console.error(`Could not get 2d context for page ${pageNum}`);
					return;
				}

				canvas.height = viewport.height;
				canvas.width = viewport.width;

				const renderContext = {
					canvasContext: context,
					viewport: viewport,
				};

				await page.render(renderContext).promise;
			};

			loadPdf();

			// Cleanup function
			return () => {
				// Cleanup canvases
				canvasRefs.current.forEach((canvas) => {
					if (canvas?.parentNode) {
						canvas.parentNode.removeChild(canvas);
					}
				});
				canvasRefs.current = [];
			};
		}, [pdfData]);

		if (error) {
			return (
				<div
					style={{
						width,
						padding: "20px",
						textAlign: "center",
						color: "red",
						...style,
					}}
				>
					Error loading PDF: {error ?? "Unknown error"}
				</div>
			);
		}

		return (
			<div
				ref={containerRef}
				style={{
					width,
					marginLeft: "auto",
					marginRight: "auto",
					...style,
				}}
				{...props}
			>
				{loading && (
					<div style={{ textAlign: "center", padding: "20px" }}>
						Loading PDF...
					</div>
				)}
			</div>
		);
	},
);

PdfViewer.displayName = "PdfViewer";

export default PdfViewer;
