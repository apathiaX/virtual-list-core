import { createRequire } from 'module';
import { join, resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { pkgRoot, projRoot } from './path';
import { BASE_PACKAGE_CONFIG } from '../constant';

const _require = createRequire(import.meta.url);

const getPackageManifest = (pkgPath: string) => {
  return _require(pkgPath);
};

/**
 * Retrieves the dependencies and peer dependencies of a package from its manifest.
 *
 * @param {string} pkgPath - The path to the package.
 * @return {{ dependencies: string[], peerDependencies: string[], dependenciesMap: Record<string, string> }} An object containing the package's dependencies and peer dependencies.
 */
export const getPackageDependencies = (pkgPath: string) => {
  const manifest = getPackageManifest(pkgPath);
  const { dependencies = {}, peerDependencies = {} } = manifest;

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
    dependenciesMap: {
      ...dependencies,
      ...peerDependencies,
    },
  };
};

/**
 * Retrieves the version of a package from its manifest.
 *
 * @param {string} pkgPath - The path to the package.
 * @return {string} The version of the package.
 */
export const getPackageVersion = (pkgPath: string) => {
  const manifest = getPackageManifest(pkgPath);
  return manifest.version;
};

/**
 * Generates the dependencies and peer dependencies for a given package path, excluding workspace dependencies.
 *
 * @param {string} packagePath - The path to the package.
 * @return {{ dependencies: string[], peerDependencies: string[] }} An object containing the filtered dependencies and peer dependencies.
 */
export const generateDependencies = (packagePath: string) => {
  const { dependencies, peerDependencies, dependenciesMap } =
    getPackageDependencies(packagePath);

  const filterDependencies = dependencies.filter(
    (dep) => dependenciesMap[dep].indexOf('workspace:') === -1,
  );
  const filterPeerDependencies = peerDependencies.filter(
    (dep) => dependenciesMap[dep].indexOf('workspace:') === -1,
  );

  return {
    dependencies: filterDependencies,
    peerDependencies: filterPeerDependencies,
  };
};

/**
 * Returns the path to the package.json or package.build.json file from the given array of paths.
 *
 * @param {string[]} path - An array of paths to search for the package.json or package.build.json file.
 * @param {boolean} [isBuild=false] - Whether to search for package.build.json instead of package.json.
 * @return {string|undefined} The path to the package.json or package.build.json file, or undefined if not found.
 */
export const getPackageJsonPath = (path: string[], isBuild = false) => {
  return path.filter(
    (p) => p.indexOf(isBuild ? 'package.build.json' : 'package.json') > -1,
  )?.[0];
};

export const getPackageName = (packagePath: string) => {
  return getPackageManifest(packagePath).name;
};

/**
 * Generates a package.json file for a given module by merging the existing package.json with the base package configuration.
 *
 * @param {string} module - The name of the module for which to generate the package.json file.
 * @return {Promise<void>} A promise that resolves when the package.json file has been generated.
 */
export const generatePkgJson = async (module: string) => {
  const moduleRootPath = resolve(pkgRoot, `${module}`);
  const pkgOutputPath = resolve(projRoot, 'dist', module, 'package.json');
  const rawPkgJsonFile = await readFile(
    join(moduleRootPath, 'package.json'),
    'utf-8',
  );
  const prePkgJsonObj = JSON.parse(rawPkgJsonFile);
  const outputJsonObj = {
    ...prePkgJsonObj,
    ...BASE_PACKAGE_CONFIG,
    devDependencies: {},
  };
  await writeFile(
    pkgOutputPath,
    JSON.stringify(outputJsonObj, null, 2),
    'utf-8',
  );
};
