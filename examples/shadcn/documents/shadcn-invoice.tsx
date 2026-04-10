import {
	Body,
	Document,
	Head,
	Page,
	Unbreakable,
	usePageSize,
} from "@useprint/components";
import type { PAGE_SIZES } from "@useprint/shared";
import "../src/styles/globals.css";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../components/ui/table";

interface ShadcnInvoiceProps {
	// pageSize is automatically provided by the server-side rendering
	// when a page size is selected in the preview UI
	pageSize?: (typeof PAGE_SIZES)[number]["name"];
	isLandscape?: boolean;
}

const lineItems = [
	{
		item: "Document template system",
		detail: "Reusable invoice, statement, and report pages",
		qty: 1,
		rate: 2400,
	},
	{
		item: "Chromium PDF rendering",
		detail: "Server-side render() output and preview parity",
		qty: 1,
		rate: 1800,
	},
	{
		item: "Print QA pass",
		detail: "Page breaks, margins, and component states",
		qty: 2,
		rate: 450,
	},
];

const subtotal = lineItems.reduce((total, item) => total + item.qty * item.rate, 0);
const tax = subtotal * 0.25;
const total = subtotal + tax;

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

const PageSizeDemo = () => {
	const pageSize = usePageSize();

	return (
		<Badge variant="secondary" className="mt-2">
			{pageSize?.name || "Default"} · {pageSize?.dimensions.width || "unknown"}px
			× {pageSize?.dimensions.height || "unknown"}px
		</Badge>
	);
};

export const ShadcnInvoice = ({ pageSize, isLandscape }: ShadcnInvoiceProps) => (
	<Document pageSize={pageSize} isLandscape={isLandscape}>
		<Head>
			<style>
				{`
					@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
				`}
			</style>
		</Head>
		<Body>
			<Page className="bg-background p-8 font-sans">
					<div className="flex items-start justify-between">
						<div>
							<Badge>Paid</Badge>
							<h1 className="mt-4 text-4xl font-semibold">Invoice</h1>
							<p className="mt-2 text-sm text-muted-foreground">
								Printable document package for April delivery.
							</p>
							<PageSizeDemo />
						</div>
						<Card className="w-64">
							<CardHeader>
								<CardDescription>Balance due</CardDescription>
								<CardTitle>{currency.format(total)}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Invoice ACME-2042
								</p>
								<p className="mt-1 text-sm text-muted-foreground">
									Due April 30, 2026
								</p>
							</CardContent>
						</Card>
					</div>

					<div className="mt-8 grid grid-cols-2 gap-4">
						<Card>
							<CardHeader>
								<CardDescription>From</CardDescription>
								<CardTitle>UsePrint Studio</CardTitle>
							</CardHeader>
							<CardContent className="text-sm text-muted-foreground">
								<p>500 Example Avenue</p>
								<p>Suite 200</p>
								<p>Example City, EX 12345</p>
								<p>billing@example.test</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardDescription>Bill to</CardDescription>
								<CardTitle>Acme Corp</CardTitle>
							</CardHeader>
							<CardContent className="text-sm text-muted-foreground">
								<p>Attn: Jane Doe</p>
								<p>200 Sample Plaza</p>
								<p>Demo Town, EX 67890</p>
								<p>accounts@acme.example</p>
							</CardContent>
						</Card>
					</div>

					<Card className="mt-6">
						<CardHeader>
							<CardTitle>Services</CardTitle>
							<CardDescription>
								Completed work for the approved document rollout.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead className="text-right">Qty</TableHead>
										<TableHead className="text-right">Rate</TableHead>
										<TableHead className="text-right">Amount</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{lineItems.map((lineItem) => (
										<TableRow key={lineItem.item}>
											<TableCell>
												<p className="font-medium">{lineItem.item}</p>
												<p className="text-sm text-muted-foreground">
													{lineItem.detail}
												</p>
											</TableCell>
											<TableCell className="text-right">{lineItem.qty}</TableCell>
											<TableCell className="text-right">
												{currency.format(lineItem.rate)}
											</TableCell>
											<TableCell className="text-right font-medium">
												{currency.format(lineItem.qty * lineItem.rate)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>

					<div className="mt-6 flex items-start justify-between gap-6">
						<Button asChild>
							<a href="https://useprint.dev" style={{ pointerEvents: "auto" }}>
								View invoice
							</a>
						</Button>
						<Card className="w-64">
							<CardContent className="pt-6">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Subtotal</span>
									<span>{currency.format(subtotal)}</span>
								</div>
								<div className="mt-3 flex justify-between text-sm">
									<span className="text-muted-foreground">VAT 25%</span>
									<span>{currency.format(tax)}</span>
								</div>
								<div className="mt-4 border-t border-border pt-4 flex justify-between text-lg font-semibold">
									<span>Total</span>
									<span>{currency.format(total)}</span>
								</div>
							</CardContent>
						</Card>
					</div>
			</Page>

			<Page className="bg-background p-8 font-sans">
				<Unbreakable>
					<Card>
						<CardHeader>
							<CardTitle>Notes</CardTitle>
							<CardDescription>
								Payment terms and delivery details.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 text-sm text-muted-foreground">
							<p>
								Payment is due within 14 days. Please include invoice
								{" "}ACME-2042 with the bank transfer.
							</p>
							<p>
								All source files and exports are included in the project
								handoff.
							</p>
						</CardContent>
					</Card>
				</Unbreakable>
			</Page>
		</Body>
	</Document>
);

ShadcnInvoice.PreviewProps = {} as ShadcnInvoiceProps;

export default ShadcnInvoice;
