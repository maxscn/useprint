"use client";
import type React from "react";
import { createContext, useContext, useEffect } from "react";
import { PAGE_SIZES } from "@useprint/shared";

interface GlobalPageSizeContextValue {
	pageSize: string;
	isLandscape?: boolean;
}

const GlobalPageSizeContext = createContext<GlobalPageSizeContextValue>({ pageSize: "A4" });

export const useGlobalPageSize = () => {
	return useContext(GlobalPageSizeContext);
};

interface DocumentProps {
	children: React.ReactNode;
	pageSize?: (typeof PAGE_SIZES)[number]["name"]; // Optional page size prop
	isLandscape?: boolean;
}

export const Document: React.FC<DocumentProps> = ({
	children,
	pageSize = "A4", // Default page size
	isLandscape,
}) => {
	const dimensions = PAGE_SIZES.find((p) => p.name === pageSize);
	return (
		<GlobalPageSizeContext.Provider value={{ pageSize, isLandscape }}>
			<html style={{ margin: 0, padding: 0 }} lang="en">
				<style>
					{`
          html {
            background-color: rgb(229 231 235);
          }
          @media print {
            background-color: white;
          }
            div[title="end of content"] {
              display: none !important;
            }
            `}
				</style>
				{children}
			</html>
		</GlobalPageSizeContext.Provider>
	);
};
