import React from 'react';
import {
  Body,
  Document,
  Head,
  Page,
  Tailwind,
} from '@useprint/components';

interface ProjectProposalProps {
  clientName: string;
  projectName: string;
  summary: string;
  reviewLink: string;
}

export default function ProjectProposal({
  clientName = 'Northwind Studio',
  projectName = 'Summer product launch',
  summary = 'A concise scope, timeline, and delivery plan for a multi-page printable proposal.',
  reviewLink = 'https://useprint.dev/docs/getting-started/your-first-document',
}: ProjectProposalProps) {
  return (
    <Document>
      <Tailwind>
        <Head />
        <Body backgroundColor="#09090b">
          <Page className="bg-zinc-950 px-10 py-12 text-zinc-50">
            <p className="m-0 text-xs uppercase tracking-[0.3em] text-zinc-500">
              Proposal ready
            </p>
            <h1 className="mb-8 mt-3 text-center text-[34px] font-semibold">
              Project proposal
            </h1>
            <p>Hello {clientName},</p>
            <p>
              We prepared a printable proposal for <strong>{projectName}</strong>.
              Use this version for review, approval, or export to PDF.
            </p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
              {summary}
            </div>
            <div className="my-8 text-center">
              <a
                href={reviewLink}
                className="inline-block rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-950 no-underline"
              >
                Open proposal
              </a>
            </div>
            <p className="text-sm text-zinc-400">
              Tip: this document is designed to preview well in the browser and
              render cleanly through Chromium-based PDF generation.
            </p>
          </Page>
        </Body>
      </Tailwind>
    </Document>
  );
}

ProjectProposal.PreviewProps = {
  clientName: 'Northwind Studio',
  projectName: 'Summer product launch',
  summary:
    'A concise scope, timeline, and delivery plan for a multi-page printable proposal.',
  reviewLink: 'https://useprint.dev/docs/getting-started/your-first-document',
} as ProjectProposalProps;
