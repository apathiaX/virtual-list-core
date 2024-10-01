import { copyFile } from 'fs/promises';
import { resolve } from 'path';
import { buildOutput, pkgRoot, projRoot } from './path';

/**
 * Copies the LICENSE file to the target build directory for a given module.
 *
 * @param {string} module - The name of the module to copy the LICENSE file for.
 */
export const copyLicenseFile = async (module: string) => {
  const licenseFilePath = resolve(projRoot, 'LICENSE');
  const targetPath = resolve(buildOutput, `${module}`, 'LICENSE');
  await copyFile(licenseFilePath, targetPath);
};

/**
 * Copies the README file to the target build directory for a given module.
 *
 * @param {string} module - The name of the module to copy the README file for.
 */
export const copyReadmeFile = async (module: string) => {
  const readmeFilePath = resolve(pkgRoot, module, 'README.md');
  const targetPath = resolve(buildOutput, module, 'README.md');
  await copyFile(readmeFilePath, targetPath);
};
