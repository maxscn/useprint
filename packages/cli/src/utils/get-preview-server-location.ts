import path from 'node:path';
import url from 'node:url';
import { createJiti } from 'jiti';
import { addDevDependency } from 'nypm';
import prompts from 'prompts';
import { packageJson } from './packageJson.js';

const ensurePreviewServerInstalled = async (
  message: string,
): Promise<never> => {
  const response = await prompts({
    type: 'confirm',
    name: 'installPreviewServer',
    message,
    initial: true,
  });
  if (response.installPreviewServer) {
    console.log('Installing "@useprint/preview"');
    await addDevDependency(
      `@useprint/preview@${packageJson.version}`,
    );
    process.exit(0);
  } else {
    process.exit(0);
  }
};

export const getPreviewServerLocation = async () => {
  const usersProject = createJiti(process.cwd());
  let previewServerLocation!: string;
  try {
    previewServerLocation = path.dirname(
      url.fileURLToPath(usersProject.esmResolve('@useprint/preview')),
    );
  } catch (_exception) {
    await ensurePreviewServerInstalled(
      'To run the preview server, the package "@useprint/preview" must be installed. Would you like to install it?',
    );
  }
  const { version } = await usersProject.import<{
    version: string;
  }>('@useprint/preview');
  if (version !== packageJson.version) {
    await ensurePreviewServerInstalled(
      `To run the preview server, the version of "@useprint/preview" must match the version of "useprint" (${packageJson.version}). Would you like to install it?`,
    );
  }

  return previewServerLocation;
};
