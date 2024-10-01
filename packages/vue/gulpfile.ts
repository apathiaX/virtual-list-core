import { series } from 'gulp';
import { buildDistFiles } from 'internal-utils';
import vue from '@vitejs/plugin-vue';

const plugins = [vue()];
export const build = async () => {
  await buildDistFiles('vue', { plugins });
};

export default series(build);
