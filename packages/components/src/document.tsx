"use client";
import type React from "react";
import { createContext, useContext, useEffect } from "react";
import { PAGE_SIZES } from "./page.js";

const GlobalPageSizeContext = createContext<string | undefined>("A4");

export const useGlobalPageSize = () => {
	return useContext(GlobalPageSizeContext);
};

interface DocumentProps {
	children: React.ReactNode;
	pageSize?: (typeof PAGE_SIZES)[number]["name"]; // Optional page size prop
}

export const Document: React.FC<DocumentProps> = ({
	children,
	pageSize = "A4", // Default page size
}) => {
	const dimensions = PAGE_SIZES.find((p) => p.name === pageSize);
	return (
		<GlobalPageSizeContext.Provider value={pageSize}>
			<html style={{ margin: 0, padding: 0 }} lang="en">
				<style>
					{`
          html {
            background-color: rgb(229 231 235);
          }
          @media print {
            background-color: white;
          }
          @page {
              size: ${dimensions?.name};
              margin: 0;
            }

            table[data-split-from] thead,
            table[data-split-from] thead :is(th, tr) {
              visibility: unset !important;
              margin-top: unset !important;
              margin-bottom: unset !important;
              padding-top: unset !important;
              padding-bottom: unset !important;
              border-top: unset !important;
              border-bottom: unset !important;
              line-height: unset !important;
              opacity: unset !important;
            }
            `}
				</style>
				{children}
			</html>
		</GlobalPageSizeContext.Provider>
	);
};
