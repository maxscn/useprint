import type { Metadata } from 'next';
import './globals.css';
import { DocumentsProvider } from '../contexts/documents';
import { getDocumentsDirectoryMetadata } from '../utils/get-documents-directory-metadata';
import { documentsDirectoryAbsolutePath } from './env';
import { sfMono } from './fonts';

export const metadata: Metadata = {
  title: 'UsePrint',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export const dynamic = 'force-dynamic';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const documentsDirectoryMetadata = await getDocumentsDirectoryMetadata(
    documentsDirectoryAbsolutePath,
  );
  if (typeof documentsDirectoryMetadata === 'undefined') {
    throw new Error(
      `Could not find the documents directory specified under ${documentsDirectoryAbsolutePath}!`,
    );
  }

  return (
    <html className={`${sfMono.variable} font-sans`} lang="en">
      <body className="print:bg-white relative h-dvh bg-black text-slate-11 leading-loose selection:bg-cyan-5 selection:text-cyan-12">
        <div className="bg-gradient-to-t from-slate-3 flex min-h-dvh flex-col overflow-hidden">
          <DocumentsProvider
            initialDocumentsDirectoryMetadata={documentsDirectoryMetadata}
          >
            {children}
          </DocumentsProvider>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
