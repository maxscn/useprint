import React from 'react';
import {
  Body,
  Document,
  Head,
  Page,
  Tailwind,
} from '@useprint/components';

interface PaymentSummaryProps {
  customerName: string;
  amount: string;
  dueDate: string;
  reference: string;
}

export default function PaymentSummary({
  customerName = 'Acme Industries',
  amount = '$12,480.00',
  dueDate = 'April 30, 2026',
  reference = 'INV-2048',
}: PaymentSummaryProps) {
  return (
    <Document>
      <Tailwind>
        <Head />
        <Body backgroundColor="#f5f5f4">
          <Page className="bg-white px-8 py-10 text-stone-900">
            <h1 className="mb-8 text-[32px] font-semibold">Payment summary</h1>
            <p>Customer: {customerName}</p>
            <p>Reference: {reference}</p>
            <section className="my-8 rounded-2xl border border-stone-200 bg-stone-50 px-6 py-5">
              <p className="m-0 text-sm uppercase tracking-[0.2em] text-stone-500">
                Amount due
              </p>
              <p className="m-0 mt-2 text-[30px] font-semibold">{amount}</p>
              <p className="m-0 mt-2 text-stone-600">Due {dueDate}</p>
            </section>
            <p className="text-sm text-stone-600">
              This is a simple seeded example for previewing financial document
              layouts during development.
            </p>
          </Page>
        </Body>
      </Tailwind>
    </Document>
  );
}

PaymentSummary.PreviewProps = {
  customerName: 'Acme Industries',
  amount: '$12,480.00',
  dueDate: 'April 30, 2026',
  reference: 'INV-2048',
} as PaymentSummaryProps;
