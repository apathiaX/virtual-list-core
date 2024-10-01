import { series } from 'gulp';
import { buildDistFiles, buildOutput } from 'internal-utils';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';

const plugins = [
  react(),
  dts({
    outDir: resolve(buildOutput, 'react/dist/types'),
  }),
];
const build = async () => {
  await buildDistFiles('react', { plugins });
};

export default series(build);
