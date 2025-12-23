"use server";
import { chromium } from "playwright";
import { PAGE_SIZES } from "@useprint/shared";

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
    isLandscape?: boolean,
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
            landscape: isLandscape,
        };

        if (pageSize) {
            pdfOptions.format = PAGE_SIZE_FORMAT_MAP[pageSize];

        } else {
            pdfOptions.format = "A4";
        }

        // Generate PDF
        console.log("Generating PDF...", pdfOptions);
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
