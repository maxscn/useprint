import path from 'node:path';
import { getDocumentsDirectoryMetadata } from './get-documents-directory-metadata';

describe('JavaScript Document Detection', () => {
  const testingDir = path.resolve(__dirname, 'testing');
  let documentsMetadata: Awaited<
    ReturnType<typeof getDocumentsDirectoryMetadata>
  >;

  beforeAll(async () => {
    documentsMetadata = await getDocumentsDirectoryMetadata(testingDir, true);
  });

  it('should detect JavaScript files with ES6 export default syntax', () => {
    expect(documentsMetadata).toBeDefined();
    expect(documentsMetadata?.documentFilenames).toContain(
      'js-document-export-default.js',
    );
  });

  it('should detect JavaScript files with CommonJS module.exports', () => {
    expect(documentsMetadata).toBeDefined();
    expect(documentsMetadata?.documentFilenames).toContain('js-document-test.js');
  });

  it('should detect MDX-style JavaScript files with named exports', () => {
    expect(documentsMetadata).toBeDefined();
    expect(documentsMetadata?.documentFilenames).toContain('mdx-document-test.js');
  });
});
