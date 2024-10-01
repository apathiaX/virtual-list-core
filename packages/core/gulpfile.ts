import { series } from 'gulp';
import { buildDistFiles, buildOutput } from 'internal-utils';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

const plugins = [
  dts({
    outDir: resolve(buildOutput, 'core/dist/types'),
  }),
];
const build = async () => {
  await buildDistFiles('core', { plugins });
};

export default series(build);
