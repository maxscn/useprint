import { Body, Document, Head, Page } from '@useprint/components';

interface InvoiceProps {
  invoiceNumber?: string;
  issuedAt?: string;
  clientName?: string;
  clientAddress?: string;
  lineItems?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

export default function Invoice({
  invoiceNumber = 'INV-1042',
  issuedAt = 'April 10, 2026',
  clientName = 'Ada Lovelace',
  clientAddress = '12 Analytical Engine Way, London',
  lineItems = [
    {
      description: 'Document design system setup',
      quantity: 1,
      unitPrice: 1200,
    },
    {
      description: 'Printable invoice template',
      quantity: 2,
      unitPrice: 240,
    },
  ],
}: InvoiceProps) {
  const total = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  return (
    <Document pageSize="A4">
      <Head>
        <title>{invoiceNumber}</title>
      </Head>
      <Body backgroundColor="#f4f7fb">
        <Page
          style={{
            backgroundColor: '#ffffff',
            color: '#172033',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Arial, sans-serif',
            gap: 40,
            padding: 56,
          }}
        >
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 32,
            }}
          >
            <div>
              <p
                style={{
                  color: '#5c6f82',
                  fontSize: 13,
                  letterSpacing: 0,
                  margin: 0,
                }}
              >
                Invoice
              </p>
              <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: '8px 0 0' }}>
                {invoiceNumber}
              </h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#5c6f82', fontSize: 13, margin: 0 }}>
                Issued
              </p>
              <p style={{ fontSize: 16, fontWeight: 700, margin: '8px 0 0' }}>
                {issuedAt}
              </p>
            </div>
          </header>

          <section
            style={{
              borderBottom: '1px solid #d8e0e8',
              borderTop: '1px solid #d8e0e8',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 32,
              padding: '24px 0',
            }}
          >
            <div>
              <p style={{ color: '#5c6f82', fontSize: 13, margin: 0 }}>
                Prepared for
              </p>
              <p style={{ fontSize: 18, fontWeight: 700, margin: '8px 0 0' }}>
                {clientName}
              </p>
              <p style={{ color: '#5c6f82', fontSize: 14, margin: '6px 0 0' }}>
                {clientAddress}
              </p>
            </div>
            <div style={{ maxWidth: 220, textAlign: 'right' }}>
              <p style={{ color: '#5c6f82', fontSize: 13, margin: 0 }}>From</p>
              <p style={{ fontSize: 18, fontWeight: 700, margin: '8px 0 0' }}>
                Useprint Studio
              </p>
              <p style={{ color: '#5c6f82', fontSize: 14, margin: '6px 0 0' }}>
                React documents, ready for print.
              </p>
            </div>
          </section>

          <table
            style={{
              borderCollapse: 'collapse',
              fontSize: 14,
              width: '100%',
            }}
          >
            <thead>
              <tr style={{ color: '#5c6f82', textAlign: 'left' }}>
                <th style={{ padding: '0 0 12px' }}>Description</th>
                <th style={{ padding: '0 0 12px', textAlign: 'right' }}>
                  Qty
                </th>
                <th style={{ padding: '0 0 12px', textAlign: 'right' }}>
                  Unit
                </th>
                <th style={{ padding: '0 0 12px', textAlign: 'right' }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item.description}>
                  <td style={{ borderTop: '1px solid #d8e0e8', padding: 16 }}>
                    {item.description}
                  </td>
                  <td
                    style={{
                      borderTop: '1px solid #d8e0e8',
                      padding: 16,
                      textAlign: 'right',
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      borderTop: '1px solid #d8e0e8',
                      padding: 16,
                      textAlign: 'right',
                    }}
                  >
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td
                    style={{
                      borderTop: '1px solid #d8e0e8',
                      fontWeight: 700,
                      padding: 16,
                      textAlign: 'right',
                    }}
                  >
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <footer
            style={{
              alignItems: 'flex-end',
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 'auto',
            }}
          >
            <p style={{ color: '#5c6f82', fontSize: 13, margin: 0 }}>
              Thank you for building with Useprint.
            </p>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#5c6f82', fontSize: 13, margin: 0 }}>
                Total due
              </p>
              <p style={{ fontSize: 30, fontWeight: 700, margin: '6px 0 0' }}>
                {formatCurrency(total)}
              </p>
            </div>
          </footer>
        </Page>
      </Body>
    </Document>
  );
}
