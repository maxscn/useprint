"use server";
import { chromium } from "playwright";

// Map of standard page size names to Playwright format values
const PAGE_SIZE_FORMAT_MAP: Record<string, string> = {
    Letter: "Letter",
    Legal: "Legal",
    Tabloid: "Tabloid",
    A0: "A0",
    A1: "A1",
    A2: "A2",
    A3: "A3",
    A4: "A4",
    A5: "A5",
};

const PPI = 96; // Pixels per inch, commonly used for web and screen displays
const MM_PER_INCH = 25.4; // Millimeters to inches conversion factor
const MM_TO_PX = (mm: number) => Math.round((mm / MM_PER_INCH) * PPI);

const PAGE_SIZES = [
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
    {
        name: "A4 Landscape",
        dimensions: { width: MM_TO_PX(297), height: MM_TO_PX(210) },
    },
    { name: "A5", dimensions: { width: MM_TO_PX(148), height: MM_TO_PX(210) } },
    { name: "A5 Landscape", dimensions: { width: MM_TO_PX(210), height: MM_TO_PX(148) } },
] as const;
// Reuse browser instance across requests for better performance
let browserInstance: Awaited<ReturnType<typeof chromium.launch>> | null = null;

async function getBrowser() {
    if (!browserInstance) {
        browserInstance = await chromium.launch({
            headless: true,
        });
    }
    return browserInstance;
}

export async function generatePdfFromHtml(
    html: string,
    pageSize?: string,
): Promise<string> {
    try {
        console.log("Starting PDF generation...");
        const browser = await getBrowser();
        console.log("Browser obtained");
        const page = await browser.newPage();
        console.log("New page created");

        // Set content
        console.log("Setting HTML content...");
        await page.setContent(html, {
            waitUntil: "networkidle", // This might be the issue - try "domcontentloaded" instead
        });
        console.log("Content set");

        // Determine PDF options based on page size
        const pdfOptions: Parameters<typeof page.pdf>[0] = {
            printBackground: true,
            preferCSSPageSize: false,
        };

        if (pageSize) {
            // Import PAGE_SIZES dynamically to avoid circular dependencies
            const sizeConfig = PAGE_SIZES.find((p) => p.name === pageSize);

            if (sizeConfig) {
                // Check if it's a landscape orientation (width > height)
                const isLandscape =
                    sizeConfig.dimensions.width > sizeConfig.dimensions.height;

                // For standard sizes without landscape suffix, use format
                const baseSizeName = pageSize.replace(" Landscape", "");
                if (PAGE_SIZE_FORMAT_MAP[baseSizeName] && !isLandscape) {
                    pdfOptions.format = PAGE_SIZE_FORMAT_MAP[baseSizeName] as any;
                } else {
                    // For landscape or custom sizes, use width/height
                    // Convert pixels to inches (96 DPI)
                    const widthInches = sizeConfig.dimensions.width / 96;
                    const heightInches = sizeConfig.dimensions.height / 96;
                    pdfOptions.width = `${widthInches}in`;
                    pdfOptions.height = `${heightInches}in`;
                }
            } else {
                // Default to A4 if page size not found
                pdfOptions.format = "A4";
            }
        } else {
            // Default to A4 if no page size specified
            pdfOptions.format = "A4";
        }

        // Generate PDF
        console.log("Generating PDF...");
        const pdfBuffer = await page.pdf(pdfOptions);
        console.log("PDF generated");

        await page.close();

        // Convert to base64 string
        const base64Pdf = pdfBuffer.toString("base64");

        return base64Pdf;
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to generate PDF: ${errorMessage}`);
    }
}
