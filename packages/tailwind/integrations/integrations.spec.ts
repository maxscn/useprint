import { spawnSync } from 'node:child_process';
import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const repoRoot = path.resolve(__dirname, '../../..');
const packageLocation = path.resolve(__dirname, '../');
const renderLocation = path.resolve(repoRoot, 'packages/render');
const npmCacheLocation = path.join(repoRoot, '.tmp/npm-cache');
const distEntryPath = path.join(packageLocation, 'dist/index.js');
const distTypesPath = path.join(packageLocation, 'dist/index.d.ts');
const renderDistEntryPath = path.join(renderLocation, 'dist/index.js');
const renderDistTypesPath = path.join(renderLocation, 'dist/index.d.ts');
const describeTailwindIntegrations =
  process.env.RUN_TAILWIND_INTEGRATIONS === '1' ? describe : describe.skip;

const runCommand = (
  command: string,
  args: string[],
  cwd: string = packageLocation,
) => {
  const executionResult = spawnSync(command, args, {
    cwd,
    env: {
      ...process.env,
      ...(command === 'npm'
        ? {
            npm_config_cache: npmCacheLocation,
          }
        : {}),
    },
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (executionResult.status !== 0) {
    process.stdout.write(executionResult.stdout ?? '');
    process.stderr.write(executionResult.stderr ?? '');
  }

  expect(
    executionResult.status,
    `Expected command "${command} ${args.join(' ')}" to work properly but it returned a non-zero exit code`,
  ).toBe(0);

  return executionResult.stdout ?? '';
};

const ensureBuiltPackage = async () => {
  const timeoutMs = 30_000;
  const pollIntervalMs = 500;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (existsSync(distEntryPath) && existsSync(distTypesPath)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  runCommand('npm', ['run', 'build'], packageLocation);
};

const ensureBuiltRenderPackage = async () => {
  const timeoutMs = 30_000;
  const pollIntervalMs = 500;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (existsSync(renderDistEntryPath) && existsSync(renderDistTypesPath)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  runCommand('npm', ['run', 'build'], renderLocation);
};

describeTailwindIntegrations('integrations', () => {
  let tempRoot = '';

  const prepareFixture = async (fixtureName: 'nextjs' | 'vite') => {
    const sourcePath = path.resolve(__dirname, fixtureName);
    const targetPath = path.join(tempRoot, fixtureName);

    await fs.cp(sourcePath, targetPath, { recursive: true });
    await fs.rm(path.join(targetPath, 'bun.lock'), { force: true });

    const packageJsonPath = path.join(targetPath, 'package.json');
    const packageJson = JSON.parse(
      await fs.readFile(packageJsonPath, 'utf8'),
    ) as {
      dependencies: Record<string, string>;
      devDependencies?: Record<string, string>;
      scripts?: Record<string, string>;
    };

    delete packageJson.dependencies['@useprint/components'];
    packageJson.dependencies['@useprint/render'] = `file:${renderLocation}`;
    packageJson.dependencies['@useprint/tailwind'] = `file:${packageLocation}`;

    if (packageJson.scripts?.preinstall) {
      delete packageJson.scripts.preinstall;
    }

    if (packageJson.devDependencies?.yalc) {
      delete packageJson.devDependencies.yalc;
    }

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    return targetPath;
  };

  beforeAll(
    async () => {
      const temporaryWorkspaceRoot = path.join(repoRoot, '.tmp');
      await fs.mkdir(temporaryWorkspaceRoot, { recursive: true });
      tempRoot = await fs.mkdtemp(
        path.join(temporaryWorkspaceRoot, 'useprint-tailwind-'),
      );

      await ensureBuiltRenderPackage();
      await ensureBuiltPackage();
    },
    120_000,
  );

  afterAll(async () => {
    if (tempRoot) {
      await fs.rm(tempRoot, { recursive: true, force: true });
    }
  });

  test(
    "Tailwind works on the Next App's build process",
    { timeout: 65_000 },
    async () => {
      const nextAppLocation = await prepareFixture('nextjs');
      runCommand('npm', ['install'], nextAppLocation);
      runCommand('npm', ['run', 'build'], nextAppLocation);
    },
  );

  test(
    "Tailwind works on the Vite App's build process",
    { timeout: 15_000 },
    async () => {
      const viteAppLocation = await prepareFixture('vite');
      runCommand('npm', ['install'], viteAppLocation);
      runCommand('npm', ['run', 'build'], viteAppLocation);
    },
  );
});
