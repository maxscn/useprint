import path from 'node:path';
import type { render } from '@useprint/components';
import { type BuildFailure, build, type OutputFile } from 'esbuild';
import type React from 'react';
import type { RawSourceMap } from 'source-map-js';
import { z } from 'zod';
import {
  compileDocumentCssImports,
  renderingUtilitiesExporter,
} from './esbuild/renderring-utilities-exporter';
import { improveErrorWithSourceMap } from './improve-error-with-sourcemap';
import { isErr } from './result';
import { runBundledCode } from './run-bundled-code';
import type { DocumentTemplate as DocumentComponent } from './types/document-template';
import type { ErrorObject } from './types/error-object';

const DocumentComponentModule = z.object({
  default: z.any(),
  render: z.function(),
  reactDocumentCreateReactElement: z.function(),
  useprintDocumentStylePaths: z.array(z.string()).optional(),
});

const injectStylesIntoHtml = (html: string, styles: string[]) => {
  if (styles.length === 0) {
    return html;
  }

  const styleMarkup = styles
    .map((css) => `<style data-useprint-document>${css.replaceAll('</style', '<\\/style')}</style>`)
    .join('');

  if (html.includes('</head>')) {
    return html.replace('</head>', `${styleMarkup}</head>`);
  }

  if (html.includes('<html')) {
    return html.replace(/<html([^>]*)>/, `<html$1><head>${styleMarkup}</head>`);
  }

  return `${styleMarkup}${html}`;
};

export const getDocumentComponent = async (
  documentPath: string,
): Promise<
  | {
      documentComponent: DocumentComponent;

      createElement: typeof React.createElement;

      render: typeof render;

      sourceMapToOriginalFile: RawSourceMap;
    }
  | { error: ErrorObject }
> => {
  let outputFiles: OutputFile[];
  try {
    const buildData = await build({
      bundle: true,
      entryPoints: [documentPath],
      plugins: [renderingUtilitiesExporter([documentPath])],
      platform: 'node',
      write: false,

      format: 'cjs',
      jsx: 'automatic',
      logLevel: 'silent',
      // allows for using jsx on a .js file
      loader: {
        '.js': 'jsx',
      },
      outdir: 'stdout', // just a stub for esbuild, it won't actually write to this folder
      sourcemap: 'external',
    });
    outputFiles = buildData.outputFiles;
  } catch (exception) {
    const buildFailure = exception as BuildFailure;
    return {
      error: {
        message: buildFailure.message,
        stack: buildFailure.stack,
        name: buildFailure.name,
        cause: buildFailure.cause,
      },
    };
  }
  const sourceMapFile = outputFiles.find((file) => file.path.endsWith('.map'));
  const bundledDocumentFile = outputFiles.find(
    (file) => !file.path.endsWith('.map'),
  );

  if (!sourceMapFile || !bundledDocumentFile) {
    return {
      error: {
        message: `Could not build the document component at ${documentPath}: esbuild did not return both bundled code and a sourcemap.`,
        name: 'BuildFailure',
        stack: undefined,
      },
    };
  }

  const builtDocumentCode = bundledDocumentFile.text;

  const sourceMapToDocument = JSON.parse(sourceMapFile.text) as RawSourceMap;
  // because it will have a path like <tsconfigLocation>/stdout/document.js.map
  sourceMapToDocument.sourceRoot = path.resolve(sourceMapFile.path, '../..');
  sourceMapToDocument.sources = (sourceMapToDocument.sources ?? []).map(
    (source) => path.resolve(sourceMapFile.path, '..', source),
  );

  (
    globalThis as typeof globalThis & {
      __useprint_document_css_files?: string[];
    }
  ).__useprint_document_css_files = [];

  const runningResult = runBundledCode(builtDocumentCode, documentPath);

  if (isErr(runningResult)) {
    const { error } = runningResult;
    if (error instanceof Error) {
      error.stack &&= error.stack.split('at Script.runInContext (node:vm')[0];

      return {
        error: improveErrorWithSourceMap(error, documentPath, sourceMapToDocument),
      };
    }

    throw error;
  }

  const parseResult = DocumentComponentModule.safeParse(runningResult.value);

  if (parseResult.error) {
    return {
      error: improveErrorWithSourceMap(
        new Error(
          `The document component at ${documentPath} does not contain the expected exports`,
          {
            cause: parseResult.error,
          },
        ),
        documentPath,
        sourceMapToDocument,
      ),
    };
  }

  if (typeof parseResult.data.default !== 'function') {
    return {
      error: improveErrorWithSourceMap(
        new Error(
          `The document component at ${documentPath} does not contain a default exported function`,
          {
            cause: parseResult.error,
          },
        ),
        documentPath,
        sourceMapToDocument,
      ),
    };
  }

  const { data: componentModule } = parseResult;

  return {
    documentComponent: componentModule.default as DocumentComponent,
    render: (async (...args: Parameters<typeof render>) => {
      const html = await (
        componentModule.render as typeof render
      )(...args);
      const documentStyles = await compileDocumentCssImports(
        componentModule.useprintDocumentStylePaths ?? [],
        html,
      );
      return injectStylesIntoHtml(
        html,
        documentStyles,
      );
    }) as typeof render,
    createElement:
      componentModule.reactDocumentCreateReactElement as typeof React.createElement,

    sourceMapToOriginalFile: sourceMapToDocument,
  };
};
