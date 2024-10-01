import { series } from 'gulp';
import { buildBundles, cleanDist, releaseBundles } from './src/bundle';

export const build = series(cleanDist, buildBundles);

export const release = series(cleanDist, releaseBundles);
