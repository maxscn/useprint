import React from 'react';
import {
  Body,
  Document,
  Head,
  Page,
  Tailwind,
} from '@useprint/components';

interface ReleaseNotesProps {
  edition: string;
  highlights: string[];
}

export default function ReleaseNotes({
  edition = '2026.04',
  highlights = [
    'Improved page-aware layout primitives for longer printable documents.',
    'Chromium-based PDF generation guidance added to the docs.',
    'Faster local preview loop for document workspaces.',
  ],
}: ReleaseNotesProps) {
  return (
    <Document>
      <Tailwind>
        <Head />
        <Body backgroundColor="#ffffff">
          <Page className="bg-white px-8 py-10 text-slate-900">
            <h1 className="mb-8 text-[32px] font-semibold">
              Release notes {edition}
            </h1>
            <section className="rounded-2xl border border-slate-200 px-6 py-5">
              <ul className="m-0 list-disc pl-5">
                {highlights.map((highlight) => (
                  <li key={highlight} className="mb-2">
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
            <p className="mt-8 text-sm text-slate-600">
              Another seeded example meant for printable update summaries.
            </p>
          </Page>
        </Body>
      </Tailwind>
    </Document>
  );
}

ReleaseNotes.PreviewProps = {
  edition: '2026.04',
  highlights: [
    'Improved page-aware layout primitives for longer printable documents.',
    'Chromium-based PDF generation guidance added to the docs.',
    'Faster local preview loop for document workspaces.',
  ],
} as ReleaseNotesProps;
