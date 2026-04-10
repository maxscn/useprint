import React from 'react';
import {
  Body,
  Document,
  Head,
  Page,
  Tailwind,
} from '@useprint/components';

interface IncidentReportProps {
  title: string;
  happenedAt: string;
  summary: string;
  details: string;
}

export default function IncidentReport({
  title = 'Print pipeline incident report',
  happenedAt = '2026-04-10 09:42 UTC',
  summary = 'A sample operational report showing how longer-form technical content can be laid out as a printable document.',
  details = 'Renderer: chromium\nEnvironment: staging\nImpact: delayed export generation for 12 minutes\nResolution: restarted worker and retried queued jobs',
}: IncidentReportProps) {
  return (
    <Document>
      <Tailwind>
        <Head />
        <Body backgroundColor="#020617">
          <Page className="bg-slate-950 px-8 py-10 text-slate-50">
            <h1 className="mb-3 text-[32px] font-semibold">{title}</h1>
            <p className="text-slate-400">Recorded {happenedAt}</p>
            <p>{summary}</p>
            <pre className="overflow-hidden rounded-2xl bg-slate-900 p-5 text-sm leading-6 text-slate-200">
              <code>{details}</code>
            </pre>
          </Page>
        </Body>
      </Tailwind>
    </Document>
  );
}

IncidentReport.PreviewProps = {
  title: 'Print pipeline incident report',
  happenedAt: '2026-04-10 09:42 UTC',
  summary:
    'A sample operational report showing how longer-form technical content can be laid out as a printable document.',
  details:
    'Renderer: chromium\nEnvironment: staging\nImpact: delayed export generation for 12 minutes\nResolution: restarted worker and retried queued jobs',
} as IncidentReportProps;
