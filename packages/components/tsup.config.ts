import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: ['./src/index.ts', "./src/page.ts"],
    outDir: './dist',
    format: ['cjs', 'esm'],
  }
]);
