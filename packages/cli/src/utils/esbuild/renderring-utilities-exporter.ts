import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Loader, PluginBuild, ResolveOptions } from 'esbuild';
import { escapeStringForRegex } from './escape-string-for-regex.js';

const WORKSPACE_DIR_NAMES = ['apps', 'packages', 'examples'];

const fileExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const getAncestorDirectories = (startingPath: string) => {
  const directories: string[] = [];
  let currentDirectory = path.dirname(startingPath);

  while (true) {
    directories.push(currentDirectory);
    const parentDirectory = path.dirname(currentDirectory);
    if (parentDirectory === currentDirectory) {
      break;
    }
    currentDirectory = parentDirectory;
  }

  return directories;
};

const toCssImportPath = (fromFilePath: string, targetFilePath: string) => {
  const relativePath = path
    .relative(path.dirname(fromFilePath), targetFilePath)
    .replaceAll('\\', '/');

  if (relativePath.startsWith('.')) {
    return relativePath;
  }

  return `./${relativePath}`;
};

const readJsonIfExists = async (filePath: string) => {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8')) as { version?: string };
  } catch {
    return undefined;
  }
};

const getTailwindV4CssEntry = async (startingPath: string) => {
  for (const baseDirectory of getAncestorDirectories(startingPath)) {
    const rootCandidate = path.join(baseDirectory, 'node_modules/tailwindcss/package.json');
    const rootCss = path.join(baseDirectory, 'node_modules/tailwindcss/index.css');
    const rootPackageJson = await readJsonIfExists(rootCandidate);
    if (rootPackageJson?.version?.startsWith('4.') && (await fileExists(rootCss))) {
      return rootCss;
    }

    for (const directoryName of WORKSPACE_DIR_NAMES) {
      const workspaceDir = path.join(baseDirectory, directoryName);
      let entries: string[] = [];
      try {
        entries = await fs.readdir(workspaceDir);
      } catch {
        continue;
      }

      for (const entry of entries) {
        const packageJsonPath = path.join(
          workspaceDir,
          entry,
          'node_modules/tailwindcss/package.json',
        );
        const cssEntryPath = path.join(
          workspaceDir,
          entry,
          'node_modules/tailwindcss/index.css',
        );
        const packageJson = await readJsonIfExists(packageJsonPath);
        if (packageJson?.version?.startsWith('4.') && (await fileExists(cssEntryPath))) {
          return cssEntryPath;
        }
      }
    }
  }

  throw new Error(
    'Could not find a Tailwind CSS v4 installation to compile imported globals.css files.',
  );
};

const getTwAnimateCssEntry = async (startingPath: string) => {
  for (const baseDirectory of getAncestorDirectories(startingPath)) {
    const candidate = path.join(baseDirectory, 'node_modules/tw-animate-css/dist/tw-animate.css');
    if (await fileExists(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    'Could not find tw-animate-css to compile imported globals.css files.',
  );
};

type PostcssProcessor = {
  process: (css: string, options: { from: string }) => Promise<{ css: string }>;
};

type CssCompiler = {
  postcss: (plugins: unknown[]) => PostcssProcessor;
  tailwindPostcss: (options: { base: string }) => unknown;
};

let cssCompilerPromise: Promise<CssCompiler> | undefined;

const getCssCompiler = async () => {
  cssCompilerPromise ??= (async () => {
    const dynamicImport = new Function(
      'specifier',
      'return import(specifier)',
    ) as <T>(specifier: string) => Promise<T>;

    const [postcssModule, tailwindPostcssModule] = await Promise.all([
      dynamicImport<typeof import('postcss')>('postcss'),
      dynamicImport('@tailwindcss/postcss'),
    ]);

    const postcss =
      (postcssModule as unknown as {
        default?: (plugins: unknown[]) => PostcssProcessor;
      }).default ??
      (postcssModule as unknown as (plugins: unknown[]) => PostcssProcessor);
    const tailwindPostcss =
      (tailwindPostcssModule as {
        default?: (options: { base: string }) => unknown;
      }).default ??
      (tailwindPostcssModule as (options: { base: string }) => unknown);

    return { postcss, tailwindPostcss };
  })();

  return cssCompilerPromise;
};

const decodeHtmlEntities = (value: string) =>
  value
    .replaceAll('&quot;', '"')
    .replaceAll('&#34;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');

const extractHtmlClassNames = (html: string) => {
  const classNames = new Set<string>();
  const classAttributePattern = /\sclass=(["'])(.*?)\1/gs;

  for (const match of html.matchAll(classAttributePattern)) {
    const rawValue = match[2];
    if (!rawValue) {
      continue;
    }

    const decodedValue = decodeHtmlEntities(rawValue);

    for (const className of decodedValue.split(/\s+/)) {
      if (className) {
        classNames.add(className);
      }
    }
  }

  return Array.from(classNames);
};

const compileCssImport = async (filePath: string, classNames: string[]) => {
  const { postcss, tailwindPostcss } = await getCssCompiler();
  let css = await fs.readFile(filePath, 'utf8');

  if (/@import\s+["']tailwindcss["'];/g.test(css)) {
    const tailwindCssEntry = await getTailwindV4CssEntry(filePath);
    css = css.replace(
      /@import\s+["']tailwindcss["'];/g,
      `@import "${toCssImportPath(filePath, tailwindCssEntry)}";`,
    );
  }

  if (/@import\s+["']tw-animate-css["'];/g.test(css)) {
    const twAnimateCssEntry = await getTwAnimateCssEntry(filePath);
    css = css.replace(
      /@import\s+["']tw-animate-css["'];/g,
      `@import "${toCssImportPath(filePath, twAnimateCssEntry)}";`,
    );
  }

  if (classNames.length > 0) {
    css = `${css}\n${classNames
      .map((className) => `@source inline(${JSON.stringify(className)});`)
      .join('\n')}\n`;
  }

  const result = await postcss([
    tailwindPostcss({
      base: path.dirname(filePath),
    }),
  ]).process(css, { from: filePath });

  return result.css;
};

export const compileDocumentCssImports = async (
  filePaths: string[],
  html: string,
) => {
  const uniquePaths = Array.from(new Set(filePaths));
  const classNames = extractHtmlClassNames(html);

  return Promise.all(
    uniquePaths.map((filePath) => compileCssImport(filePath, classNames)),
  );
};

/**
 * Made to export the `render` function out of the user's document template
 * so that issues like https://github.com/maxscn/useprint/issues/649 don't
 * happen.
 *
 * This also exports the `createElement` from the user's React version as well
 * to avoid mismatches.
 *
 * This avoids multiple versions of React being involved, i.e., the version
 * in the CLI vs. the version the user has on their documents.
 */
export const renderingUtilitiesExporter = (documentTemplates: string[]) => ({
  name: 'rendering-utilities-exporter',
  setup: (b: PluginBuild) => {
    b.onResolve({ filter: /\.css$/ }, (args) => ({
      path: path.isAbsolute(args.path)
        ? args.path
        : path.resolve(args.resolveDir, args.path),
      namespace: 'useprint-css',
    }));

    b.onLoad(
      {
        filter: new RegExp(
          documentTemplates
            .map((documentPath) => escapeStringForRegex(documentPath))
            .join('|'),
        ),
      },
      async ({ path: pathToFile }) => {
        return {
          contents: `${await fs.readFile(pathToFile, 'utf8')};
          export { render } from 'useprint-module-that-will-export-render'
          export { createElement as reactDocumentCreateReactElement } from 'react';
          export const useprintDocumentStylePaths = Array.from(
            new Set(globalThis.__useprint_document_css_files ?? [])
          );
        `,
          loader: path.extname(pathToFile).slice(1) as Loader,
        };
      },
    );

    b.onLoad(
      { filter: /\.css$/, namespace: 'useprint-css' },
      async ({ path: pathToCssFile }) => {
        return {
          contents: `
const cssFilePath = ${JSON.stringify(pathToCssFile)};
globalThis.__useprint_document_css_files ??= [];
if (!globalThis.__useprint_document_css_files.includes(cssFilePath)) {
  globalThis.__useprint_document_css_files.push(cssFilePath);
}
export default cssFilePath;
        `,
          loader: 'js',
        };
      },
    );

    b.onResolve(
      { filter: /^useprint-module-that-will-export-render$/ },
      async (args) => {
        const options: ResolveOptions = {
          kind: 'import-statement',
          importer: args.importer,
          resolveDir: args.resolveDir,
          namespace: args.namespace,
        };
        let result = await b.resolve('@useprint/render', options);
        if (result.errors.length === 0) {
          return result;
        }

        // If @useprint/render does not exist, resolve to @useprint/components
        result = await b.resolve('@useprint/components', options);
        if (result.errors.length > 0 && result.errors[0]) {
          result.errors[0].text =
            "Failed trying to import `render` from either `@useprint/render` or `@useprint/components` to be able to render your document template.\n Maybe you don't have either of them installed?";
        }
        return result;
      },
    );
  },
});
