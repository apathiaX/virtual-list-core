import { series } from 'gulp';
import { buildDistFiles } from 'internal-utils';
import vue2 from '@vitejs/plugin-vue2';

const plugins = [vue2()];
const build = async () => {
  await buildDistFiles('vue2', { plugins } as any);
};

export default series(build);
