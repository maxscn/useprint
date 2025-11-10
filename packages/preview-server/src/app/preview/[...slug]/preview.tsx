"use client";

import { PAGE_SIZES, type PageSize } from "@skrift/components/page";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use, useState } from "react";
import { flushSync } from "react-dom";
import { Toaster } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { Topbar } from "../../../components";
import { CodeContainer } from "../../../components/code-container";
import { PdfViewer } from "../../../components/pdf-viewer";
import { Print } from "../../../components/print";

import { useToolbarState } from "../../../components/toolbar";
import { Tooltip } from "../../../components/tooltip";
import { ActiveViewToggleGroup } from "../../../components/topbar/active-view-toggle-group";
import { ViewSizeControls } from "../../../components/topbar/view-size-controls";
import { PreviewContext } from "../../../contexts/preview";
import { useClampedState } from "../../../hooks/use-clamped-state";
import { cn } from "../../../utils";
import PrintPreview from "./print-preview";
import { RenderingError } from "./rendering-error";

interface PreviewProps extends React.ComponentProps<"div"> {
	documentTitle: string;
	pageSize: (typeof PAGE_SIZES)[number]["name"];
}

const Preview = ({
	documentTitle,
	pageSize,
	className,
	...props
}: PreviewProps) => {
	const {
		renderingResult,
		renderedDocumentMetadata,
		pageSize: storedPageSize,
	} = use(PreviewContext)!;
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const activeView = searchParams.get("view") ?? "preview";
	const activeLang = searchParams.get("lang") ?? "jsx";

	const handleViewChange = (view: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("view", view);
		router.push(`${pathname}?${params.toString()}${location.hash}`);
	};

	const handleLangChange = (lang: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("view", "source");
		params.set("lang", lang);
		const isSameLang = searchParams.get("lang") === lang;
		router.push(
			`${pathname}?${params.toString()}${isSameLang ? location.hash : ""}`,
		);
	};

	const hasRenderingMetadata = typeof renderedDocumentMetadata !== "undefined";
	const hasErrors = "error" in renderingResult;

	const [maxWidth, setMaxWidth] = useState(Number.POSITIVE_INFINITY);
	const [maxHeight, setMaxHeight] = useState(Number.POSITIVE_INFINITY);
	const minWidth = 100;
	const minHeight = 100;
	const storedWidth = searchParams.get("width");
	const storedHeight = searchParams.get("height");
	const [width, setWidth] = useClampedState(
		storedWidth ? Number.parseInt(storedWidth) : 600,
		minWidth,
		maxWidth,
	);
	const [height, setHeight] = useClampedState(
		storedHeight ? Number.parseInt(storedHeight) : 1024,
		minHeight,
		maxHeight,
	);
	const backupPreset = PAGE_SIZES.find((p) => p.name === "A4")!;
	const [currentPreset, setCurrentPreset] = useState<PageSize>(
		storedPageSize
			? PAGE_SIZES.find((p) => p.name === storedPageSize) || backupPreset
			: backupPreset,
	);

	const handleSaveViewSize = useDebouncedCallback(() => {
		const params = new URLSearchParams(searchParams);
		params.set("width", width.toString());
		params.set("height", height.toString());
		if (currentPreset) {
			params.set("pageSize", currentPreset.name);
		} else {
			params.delete("pageSize");
		}
		router.push(`${pathname}?${params.toString()}${location.hash}`);
	}, 300);

	const { toggled: toolbarToggled } = useToolbarState();
	return (
		<>
			<PrintPreview documentTitle={documentTitle} />

			<Topbar documentTitle={documentTitle} className="print:hidden">
				<ViewSizeControls
					setViewHeight={(height) => {
						setHeight(height);
						flushSync(() => {
							handleSaveViewSize();
						});
					}}
					setViewWidth={(width) => {
						setWidth(width);
						flushSync(() => {
							handleSaveViewSize();
						});
					}}
					viewHeight={height}
					viewWidth={width}
					onPresetChange={(preset) => {
						setCurrentPreset(preset);
						flushSync(() => {
							handleSaveViewSize();
						});
					}}
				/>
				<ActiveViewToggleGroup
					activeView={activeView}
					setActiveView={handleViewChange}
				/>
				{hasRenderingMetadata && renderedDocumentMetadata?.pdfData ? (
					<div className="flex justify-end">
						<Print pdfData={renderedDocumentMetadata.pdfData} />
					</div>
				) : null}
			</Topbar>
			<div
				{...props}
				className={cn(
					"h-[calc(100%-3.5rem-2.375rem)] will-change-[height] flex transition-[height] duration-300",
					activeView === "preview" && "bg-gray-200",
					activeView === "preview" &&
						renderedDocumentMetadata?.pdfData &&
						"p-0",
					activeView !== "preview" && "p-4 overflow-auto",
					toolbarToggled && "h-[calc(100%-3.5rem-13rem)]",
					className,
				)}
				ref={(element) => {
					const observer = new ResizeObserver((entry) => {
						const [elementEntry] = entry;
						if (elementEntry) {
							//  setMaxWidth(elementEntry.contentRect.width);
							//  setMaxHeight(elementEntry.contentRect.height);
						}
					});

					if (element) {
						observer.observe(element);
					}

					return () => {
						observer.disconnect();
					};
				}}
			>
				{hasErrors ? <RenderingError error={renderingResult.error} /> : null}

				{hasRenderingMetadata ? (
					<>
						{activeView === "preview" &&
							renderedDocumentMetadata.pdfData &&
							PdfViewer && (
								<PdfViewer
									pdfData={renderedDocumentMetadata.pdfData}
									width={currentPreset.dimensions.width}
									height={currentPreset.dimensions.height}
									key={pageSize + documentTitle}
								/>
							)}
						{activeView === "preview" && !renderedDocumentMetadata.pdfData && (
							<div className="flex items-center justify-center h-full">
								<div className="text-center">
									<p>PDF is being generated...</p>
								</div>
							</div>
						)}

						{activeView === "source" && (
							<div className="h-full w-full">
								<div className="m-auto h-full flex max-w-3xl p-6">
									<Tooltip.Provider>
										<CodeContainer
											activeLang={activeLang}
											markups={[
												{
													language: "jsx",
													content: renderedDocumentMetadata.reactMarkup,
												},
												{
													language: "markup",
													content: renderedDocumentMetadata.markup,
												},
												{
													language: "markdown",
													content: renderedDocumentMetadata.plainText,
												},
											]}
											setActiveLang={handleLangChange}
										/>
									</Tooltip.Provider>
								</div>
							</div>
						)}
					</>
				) : null}

				<Toaster />
			</div>
		</>
	);
};

export default Preview;
