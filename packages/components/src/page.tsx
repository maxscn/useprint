import type React from "react";
import { useGlobalPageSize } from "./document";
import { PAGE_SIZES, type PageSize as PageSizeType } from "./page.js";
import { Unbreakable } from "./unbreakable";

interface PageProps {
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	size?: PageSizeType["name"];
}

export const usePageSize = (): PageSizeType | undefined => {
	const globalPageSize = useGlobalPageSize();
	const effectiveSize = globalPageSize || "A4";
	const currentPreset = PAGE_SIZES.find((p) => p.name === effectiveSize);
	return currentPreset;
};

export const Page: React.FC<PageProps> = ({
	children,
	className = "",
	style = {},
	size,
	...props
}) => {
	const currentPreset = usePageSize();

	const pageStyle: React.CSSProperties = {
		...currentPreset?.dimensions,
		...style,
	};

	return (
		<Unbreakable
			className={`skrift-page ${className}`}
			style={pageStyle}
			data-unbreakable="true"
			{...props}
		>
			{children}
		</Unbreakable>
	);
};
