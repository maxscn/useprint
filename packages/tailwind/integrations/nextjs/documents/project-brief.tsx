import React from 'react';
import { Tailwind } from '@useprint/tailwind';

interface ProjectBriefDocumentProps {
  title?: string;
  owner?: string;
  summary?: string;
  milestones?: string[];
}

export const ProjectBriefDocument = ({
  title = 'Spring catalog refresh',
  owner = 'Operations design team',
  summary = 'A concise printable brief used to align design, production, and approval before PDF export.',
  milestones = [
    'Finalize product list and pricing',
    'Review typography and page breaks',
    'Approve export-ready PDF',
  ],
}: ProjectBriefDocumentProps) => {
  return (
    <html lang="en">
      <Tailwind>
        <head />
        <body className="bg-stone-100">
          <div className="bg-white px-8 py-10 font-sans text-stone-900">
            <p className="m-0 text-xs uppercase tracking-[0.3em] text-stone-500">
              Project brief
            </p>
            <h1 className="mb-3 mt-3 text-[32px] font-semibold">{title}</h1>
            <p className="m-0 text-stone-600">Owner: {owner}</p>
            <p className="mt-6 text-[15px] leading-7">{summary}</p>
            <section className="mt-8 rounded-xl border border-stone-200 bg-stone-50 p-5">
              <p className="m-0 text-sm font-semibold">Milestones</p>
              <ul className="mb-0 mt-4 pl-5">
                {milestones?.map((milestone) => (
                  <li key={milestone} className="mb-2">
                    {milestone}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </body>
      </Tailwind>
    </html>
  );
};

ProjectBriefDocument.PreviewProps = {
  title: 'Spring catalog refresh',
  owner: 'Operations design team',
  summary:
    'A concise printable brief used to align design, production, and approval before PDF export.',
  milestones: [
    'Finalize product list and pricing',
    'Review typography and page breaks',
    'Approve export-ready PDF',
  ],
} as ProjectBriefDocumentProps;
