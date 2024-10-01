import { execa } from 'execa';
import { rm } from 'fs/promises';
import consola from 'consola';
import prompts from 'prompts';
import { buildOutput, projRoot } from '../utils';
import { generatePkgJson } from '../utils/pkg';
import { copyLicenseFile, copyReadmeFile } from '../utils/copyFile';
import { MODULE_PREFIX, PACKAGES } from '../constant';
import { resolve } from 'path';

export const buildModuleBundle = async (module: string) => {
  consola.start(`Building virtual-list-${module}...`);
  await execa(
    'pnpm',
    ['--filter', `${MODULE_PREFIX}-${module}`, 'run', 'start'],
    {
      stdio: 'pipe',
      cwd: projRoot,
    },
  );
  await generatePkgJson(module);
  await copyLicenseFile(module);
  await copyReadmeFile(module);
  consola.success(`Build virtual-list-${module} success!`);
};

export const buildBundles = async () => {
  const selectModule = await selectOptions();
  for (const module of selectModule) {
    await buildModuleBundle(module);
  }
  return selectModule;
};

export const cleanDist = async () => {
  await rm(buildOutput, { recursive: true, force: true });
};

export const selectOptions = async () => {
  const res = await prompts(
    {
      type: 'multiselect',
      name: 'module',
      message: 'Select Module',
      choices: PACKAGES.map((p) => ({
        title: `${MODULE_PREFIX}-${p}`,
        value: p,
      })),
      initial: 1,
    },
    { onCancel: () => process.exit(0) },
  );
  return res.module || [];
};

const releaseBundle = async (module: string) => {
  consola.start(`Release virtual-list-${module}...`);
  await execa('npm', ['publish'], {
    stdio: 'pipe',
    cwd: resolve(buildOutput, `${module}`),
  });
  consola.success(`Release virtual-list-${module} success!`);
};

export const releaseBundles = async () => {
  const selectModule = await buildBundles();
  for (const module of selectModule) {
    await releaseBundle(module);
  }
};
