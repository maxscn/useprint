import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Body, Document, Head, Page } from "@useprint/components";
import { renderToString } from "react-dom/server";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface MaterialUiInvoiceProps {
  pageSize?: "A4" | "Letter";
  invoiceNumber: string;
  issuedAt: string;
  dueAt: string;
  companyName: string;
  companyAddress: string;
  customerName: string;
  customerAddress: string;
  items: LineItem[];
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#176B87",
    },
    secondary: {
      main: "#C2410C",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: '"Inter", Arial, sans-serif',
    h1: {
      fontSize: 34,
      fontWeight: 700,
      letterSpacing: 0,
    },
    h2: {
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: 0,
    },
    h3: {
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    body2: {
      color: "#475569",
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: "#CBD5E1",
          padding: "10px 12px",
        },
        head: {
          backgroundColor: "#F1F5F9",
          color: "#0F172A",
          fontWeight: 700,
        },
      },
    },
  },
});

function createEmotionCache() {
  return createCache({ key: "mui" });
}

const InvoiceContent = ({
  invoiceNumber,
  issuedAt,
  dueAt,
  companyName,
  companyAddress,
  customerName,
  customerAddress,
  items,
}: Omit<MaterialUiInvoiceProps, "pageSize">) => {
  const subtotal = items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  );
  const tax = subtotal * 0.25;
  const total = subtotal + tax;

  return (
    <Page>
      <Box
        sx={{
          height: "100%",
          boxSizing: "border-box",
          p: 5,
          display: "flex",
          flexDirection: "column",
          color: "#0F172A",
          overflow: "hidden",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 6 }}
        >
          <Box>
            <Typography variant="h1">Invoice</Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, maxWidth: 360, lineHeight: 1.6 }}
            >
              Implementation and rendering services for Acme Corp's printable
              document rollout.
            </Typography>
          </Box>
          <Chip color="primary" label="Ready for PDF" />
        </Stack>

        <Stack direction="row" spacing={6} sx={{ mb: 5 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ color: "primary.main" }}>
              From
            </Typography>
            <Typography sx={{ mt: 1, fontWeight: 700 }}>
              {companyName}
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              {companyAddress}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ color: "primary.main" }}>
              Bill to
            </Typography>
            <Typography sx={{ mt: 1, fontWeight: 700 }}>
              {customerName}
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              {customerAddress}
            </Typography>
          </Box>
          <Box sx={{ width: 220 }}>
            <Typography variant="h3" sx={{ color: "primary.main" }}>
              Invoice details
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Invoice number
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>{invoiceNumber}</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Issued
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>{issuedAt}</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Due
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>{dueAt}</Typography>
          </Box>
        </Stack>

        <Table size="small" sx={{ mb: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Unit price</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.description}>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  {currency.format(item.unitPrice)}
                </TableCell>
                <TableCell align="right">
                  {currency.format(item.quantity * item.unitPrice)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box
          sx={{
            ml: "auto",
            width: 320,
            border: "1px solid #CBD5E1",
            borderRadius: 3,
            p: 3,
            backgroundColor: "#F8FAFC",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 1.5 }}
          >
            <Typography variant="body2">Subtotal</Typography>
            <Typography>{currency.format(subtotal)}</Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 1.5 }}
          >
            <Typography variant="body2">VAT 25%</Typography>
            <Typography>{currency.format(tax)}</Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h2">Total</Typography>
          <Typography variant="h1" sx={{ fontSize: 40 }}>
            {currency.format(total)}
          </Typography>
        </Box>
      </Box>
    </Page>
  );
};

const defaultInvoiceProps = {
  pageSize: "A4",
  invoiceNumber: "ACME-2042",
  issuedAt: "2026-04-10",
  dueAt: "2026-04-24",
  companyName: "UsePrint Studio",
  companyAddress:
    "500 Example Avenue\nSuite 200\nExample City, EX 12345\nbilling@example.test",
  customerName: "Acme Corp",
  customerAddress:
    "Attn: Jane Doe\n200 Sample Plaza\nDemo Town, EX 67890\naccounts@acme.example",
  items: [
    {
      description: "Document template implementation",
      quantity: 1,
      unitPrice: 1200,
    },
    {
      description: "Chromium PDF rendering pass",
      quantity: 2,
      unitPrice: 350,
    },
    { description: "Print styling review", quantity: 3, unitPrice: 180 },
  ],
} satisfies MaterialUiInvoiceProps;

export const MaterialUiInvoice = ({
  pageSize = defaultInvoiceProps.pageSize,
  invoiceNumber = defaultInvoiceProps.invoiceNumber,
  issuedAt = defaultInvoiceProps.issuedAt,
  dueAt = defaultInvoiceProps.dueAt,
  companyName = defaultInvoiceProps.companyName,
  companyAddress = defaultInvoiceProps.companyAddress,
  customerName = defaultInvoiceProps.customerName,
  customerAddress = defaultInvoiceProps.customerAddress,
  items = defaultInvoiceProps.items,
}: Partial<MaterialUiInvoiceProps>) => {
  const cache = createEmotionCache();
  const { extractCritical } = createEmotionServer(cache);

  const muiHtml = renderToString(
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <InvoiceContent
          invoiceNumber={invoiceNumber}
          issuedAt={issuedAt}
          dueAt={dueAt}
          companyName={companyName}
          companyAddress={companyAddress}
          customerName={customerName}
          customerAddress={customerAddress}
          items={items}
        />
      </ThemeProvider>
    </CacheProvider>,
  );
  const { html, css } = extractCritical(muiHtml);

  return (
    <Document pageSize={pageSize}>
      <Head>
        <style>
          {`
						@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");
					`}
        </style>
      </Head>
      <Body backgroundColor="white">
        <style
          data-label="mui"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Emotion SSR critical CSS
          dangerouslySetInnerHTML={{ __html: css }}
        />
        <div
          style={{
            backgroundColor: "#fff",
            minHeight: "100%",
            fontFamily: '"Inter", Arial, sans-serif',
          }}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Emotion SSR HTML
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Body>
    </Document>
  );
};

MaterialUiInvoice.PreviewProps = defaultInvoiceProps;

export default MaterialUiInvoice;
