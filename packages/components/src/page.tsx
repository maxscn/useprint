import type React from "react";
import { useGlobalPageSize } from "./document";
import { Unbreakable } from "./unbreakable";
import { PAGE_SIZES, type PageSize } from "@useprint/shared";



interface PageProps {
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	size?: PageSize["name"];
}

export const usePageSize = (): PageSize | undefined => {
	const globalPageSize = useGlobalPageSize();
	const effectiveSize = globalPageSize.pageSize || "A4";
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
	const globalPageSize = useGlobalPageSize();
	const currentPreset = usePageSize();

	const effectiveDimensions = globalPageSize.isLandscape && currentPreset
		? { width: currentPreset.dimensions.height, height: currentPreset.dimensions.width }
		: currentPreset?.dimensions;

	const pageStyle: React.CSSProperties = {
		...effectiveDimensions,
		...style,
	};

	return (
		<Unbreakable
			className={`useprint-page ${className}`}
			style={pageStyle}
			data-unbreakable="true"
			{...props}
		>
			{children}
		</Unbreakable>
	);
};
