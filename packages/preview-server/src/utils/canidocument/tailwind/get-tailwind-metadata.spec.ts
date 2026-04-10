import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from '@babel/parser';
import { getTailwindMetadata } from './get-tailwind-metadata';

describe('getTailwindMetadata()', () => {
  test('with the project-proposal seed document', async () => {
    const documentPath = path.resolve(
      __dirname,
      '../../../../../../packages/preview-server/scripts/utils/default-seed/contracts/project-proposal.tsx',
    );
    const reactCode = await fs.readFile(documentPath, 'utf8');
    const ast = parse(reactCode, {
      strictMode: false,
      errorRecovery: true,
      sourceType: 'unambiguous',
      plugins: ['jsx', 'typescript', 'decorators'],
    });

    const tailwindMetadata = getTailwindMetadata(ast, reactCode, documentPath);

    expect(tailwindMetadata).toBeDefined();
    // console.log(tailwindMetadata);
  });
});
