/**
 * @vitest-environment node
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import { installDependencies, runScript } from 'nypm';

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const initDocRoot = path.resolve(import.meta.dirname, '../');
const describeInitDocE2E =
  process.env.RUN_INIT_DOC_E2E === '1' ? describe : describe.skip;

const runCommand = (
  command: string,
  args: string[],
  options: {
    cwd: string;
    env?: NodeJS.ProcessEnv;
  },
) => {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env,
    stdio: 'pipe',
  });

  const stdout = result.stdout?.toString() ?? '';
  const stderr = result.stderr?.toString() ?? '';

  return {
    code: result.status,
    stderr,
    stdout,
  };
};

const getPackedTarballPath = (packStdout: string, cwd: string) => {
  const tarballName = packStdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1);

  if (!tarballName) {
    throw new Error(`Could not determine tarball path from output:\n${packStdout}`);
  }

  return path.join(cwd, tarballName);
};

const waitForServer = async (url: string, timeoutMs: number) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
    } catch (_error) {
      // Server is still booting.
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(`Timed out waiting for ${url}`);
};

describeInitDocE2E('automatic setup', () => {
  const starterPath = path.resolve(import.meta.dirname, '../.test');
  test.sequential('creation', async () => {
    if (existsSync(starterPath)) {
      await fs.rm(starterPath, { recursive: true });
    }

    const initDocProcess = spawnSync(
      process.execPath,
      [path.resolve(import.meta.dirname, './index.js'), '.test'],
      {
        cwd: initDocRoot,
        stdio: 'pipe',
      },
    );
    if (initDocProcess.stderr) {
      console.log(initDocProcess.stderr.toString());
    }
    expect(initDocProcess.status, 'starter creation should return 0').toBe(
      0,
    );
  });

  test.sequential('install', { timeout: 40_000 }, async () => {
    await installDependencies({
      cwd: starterPath,
      packageManager: 'npm',
    });
  });

  test.sequential('export', async () => {
    await runScript('export', {
      cwd: starterPath,
      packageManager: 'npm',
    });
  });

  test.sequential('type checking', { timeout: 10_000 }, async () => {
    const typecheckingProcess = spawnSync('npx tsc', {
      cwd: starterPath,
      shell: true,
      stdio: 'pipe',
    });
    if (typecheckingProcess.stderr) {
      console.log(typecheckingProcess.stderr.toString());
    }
    if (typecheckingProcess.stdout) {
      console.log(typecheckingProcess.stdout.toString());
    }
    expect(
      typecheckingProcess.status,
      'type checking should return status code 0',
    ).toBe(0);
  });
});

describeInitDocE2E('automatic setup with local packed packages', () => {
  const starterPath = path.resolve(import.meta.dirname, '../.test-local');
  const packagePaths = {
    cli: path.resolve(repoRoot, 'packages/cli'),
    components: path.resolve(repoRoot, 'packages/components'),
    preview: path.resolve(repoRoot, 'packages/preview-server'),
  };

  test.sequential(
    'bun starter boots from local tarballs',
    { timeout: 180_000 },
    async () => {
      if (existsSync(starterPath)) {
        await fs.rm(starterPath, { recursive: true, force: true });
      }

      const packed = {
        cli: runCommand('npm', ['pack'], {
          cwd: packagePaths.cli,
        }),
        components: runCommand('npm', ['pack'], {
          cwd: packagePaths.components,
        }),
        preview: runCommand('npm', ['pack'], {
          cwd: packagePaths.preview,
        }),
      };

      expect(packed.cli.code, packed.cli.stderr).toBe(0);
      expect(packed.components.code, packed.components.stderr).toBe(0);
      expect(packed.preview.code, packed.preview.stderr).toBe(0);

      const tarballs = {
        cli: getPackedTarballPath(packed.cli.stdout, packagePaths.cli),
        components: getPackedTarballPath(
          packed.components.stdout,
          packagePaths.components,
        ),
        preview: getPackedTarballPath(packed.preview.stdout, packagePaths.preview),
      };

      const initDocProcess = runCommand(
        process.execPath,
        [path.resolve(import.meta.dirname, './index.js'), '.test-local'],
        {
          cwd: initDocRoot,
        },
      );

      expect(initDocProcess.code, initDocProcess.stderr).toBe(0);

      const starterPackageJsonPath = path.join(starterPath, 'package.json');
      const starterPackageJson = JSON.parse(
        await fs.readFile(starterPackageJsonPath, 'utf8'),
      ) as {
        dependencies: Record<string, string>;
        devDependencies: Record<string, string>;
      };

      starterPackageJson.dependencies['@useprint/components'] =
        `file:${tarballs.components}`;
      starterPackageJson.devDependencies['@useprint/cli'] = `file:${tarballs.cli}`;
      starterPackageJson.devDependencies['@useprint/preview'] =
        `file:${tarballs.preview}`;

      await fs.writeFile(
        starterPackageJsonPath,
        JSON.stringify(starterPackageJson, null, 2),
      );

      const installProcess = runCommand('bun', ['install'], {
        cwd: starterPath,
      });

      expect(installProcess.code, installProcess.stderr).toBe(0);

      const server = spawn('bun', ['run', 'dev'], {
        cwd: starterPath,
        env: {
          ...process.env,
          CI: '1',
        },
        stdio: 'pipe',
      });

      let output = '';
      const appendOutput = (chunk: string | Buffer) => {
        output += chunk.toString();
      };

      server.stdout.on('data', appendOutput);
      server.stderr.on('data', appendOutput);

      try {
        const response = await waitForServer(
          'http://localhost:3000/preview/invoice',
          60_000,
        );

        expect(response.status).toBe(200);
        expect(output).not.toContain('Preview Server had an error');
      } finally {
        server.kill('SIGINT');
        await new Promise((resolve) => {
          server.once('exit', resolve);
          setTimeout(resolve, 5_000);
        });

        await Promise.all([
          fs.rm(tarballs.cli, { force: true }),
          fs.rm(tarballs.components, { force: true }),
          fs.rm(tarballs.preview, { force: true }),
          fs.rm(starterPath, { recursive: true, force: true }),
        ]);
      }
    },
  );
});
