import { defineConfig } from 'tsup';

// Build page.ts first, then the main bundle
export default defineConfig([
  {
    dts: {
      resolve: true,
    },
    entry: {
      page: './src/page.ts',
    },
    outDir: './dist',
    format: ['cjs', 'esm'],
    outExtension({ format }) {
      return {
        js: format === 'cjs' ? '.js' : '.mjs',
      };
    },
  },
  {
    dts: false, // Disable DTS for main build to avoid conflicts
    entry: ['./src/index.ts'],
    outDir: './dist',
    format: ['cjs', 'esm'],
  },
]);
