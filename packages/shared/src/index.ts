export interface ViewDimensions {
	width: number;
	height: number;
}

export interface PageSize {
	name: string;
	dimensions: ViewDimensions;
}

export const PPI = 96;
export const MM_PER_INCH = 25.4;
export const MM_TO_PX = (mm: number) => Math.round((mm / MM_PER_INCH) * PPI);

export const PAGE_SIZES = [
	{
		name: "Letter",
		dimensions: { width: MM_TO_PX(216), height: MM_TO_PX(279) },
	},
	{
		name: "Legal",
		dimensions: { width: MM_TO_PX(216), height: MM_TO_PX(356) },
	},
	{
		name: "Tabloid",
		dimensions: { width: MM_TO_PX(279), height: MM_TO_PX(432) },
	},
	{ name: "A0", dimensions: { width: MM_TO_PX(841), height: MM_TO_PX(1189) } },
	{ name: "A1", dimensions: { width: MM_TO_PX(594), height: MM_TO_PX(841) } },
	{ name: "A2", dimensions: { width: MM_TO_PX(420), height: MM_TO_PX(594) } },
	{ name: "A3", dimensions: { width: MM_TO_PX(297), height: MM_TO_PX(420) } },
	{ name: "A4", dimensions: { width: MM_TO_PX(210), height: MM_TO_PX(297) } },
	{ name: "A5", dimensions: { width: MM_TO_PX(148), height: MM_TO_PX(210) } },
] as const;
