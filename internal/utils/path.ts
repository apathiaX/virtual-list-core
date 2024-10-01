import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const BASE_DIRNAME = dirname(fileURLToPath(import.meta.url));

/**
 * current project root entry: virtual-list
 */
export const projRoot = resolve(BASE_DIRNAME, '..', '..');

/**
 * build files entry: virtual-list/dist
 */
export const buildOutput = resolve(projRoot, 'dist');

/**
 * build files entry: virtual-list/packages
 */
export const pkgRoot = resolve(projRoot, 'packages');
