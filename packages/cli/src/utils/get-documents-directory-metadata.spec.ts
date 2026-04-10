import path from 'node:path';
import { getDocumentsDirectoryMetadata } from './get-documents-directory-metadata.js';

test('getDocumentsDirectoryMetadata on demo documents', async () => {
  const documentsDirectoryPath = path.resolve(
    __dirname,
    '../../../preview-server/scripts/utils/default-seed',
  );
  expect(await getDocumentsDirectoryMetadata(documentsDirectoryPath)).toEqual({
    absolutePath: documentsDirectoryPath,
    directoryName: 'default-seed',
    relativePath: '',
    documentFilenames: [],
    subDirectories: [
      {
        absolutePath: `${documentsDirectoryPath}/auth`,
        directoryName: 'auth',
        relativePath: 'auth',
        documentFilenames: [],
        subDirectories: [],
      },
      {
        absolutePath: `${documentsDirectoryPath}/communications`,
        directoryName: 'communications',
        relativePath: 'communications',
        documentFilenames: [],
        subDirectories: [],
      },
      {
        absolutePath: `${documentsDirectoryPath}/contracts`,
        directoryName: 'contracts',
        relativePath: 'contracts',
        documentFilenames: ['project-proposal'],
        subDirectories: [],
      },
      {
        absolutePath: `${documentsDirectoryPath}/finance`,
        directoryName: 'finance',
        relativePath: 'finance',
        documentFilenames: ['payment-summary'],
        subDirectories: [],
      },
      {
        absolutePath: `${documentsDirectoryPath}/marketing`,
        directoryName: 'marketing',
        relativePath: 'marketing',
        documentFilenames: [],
        subDirectories: [],
      },
      {
        absolutePath: `${documentsDirectoryPath}/reports`,
        directoryName: 'reports',
        relativePath: 'reports',
        documentFilenames: ['incident-report'],
        subDirectories: [],
      },
      {
        absolutePath: `${documentsDirectoryPath}/updates`,
        directoryName: 'updates',
        relativePath: 'updates',
        documentFilenames: ['release-notes'],
        subDirectories: [],
      },
    ],
  });
});
