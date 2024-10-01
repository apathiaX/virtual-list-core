import { resolve } from 'path';
import { build, type UserConfig } from 'vite';
import { buildOutput, pkgRoot } from './path';

const getConfig = (
  module: string,
  options: Partial<UserConfig>,
): UserConfig => {
  return {
    plugins: options.plugins || [],
    build: {
      lib: {
        entry: resolve(pkgRoot, `${module}/src/index.ts`),
        name: `virtual-list-${module}`,
      },
      rollupOptions: {
        external: ['vue', 'react'],
        output: [
          {
            format: 'es',
            entryFileNames: '[name].[hash].mjs',
            dir: resolve(buildOutput, module, 'dist/esm'),
            globals: {
              vue: 'Vue',
            },
          },
          {
            format: 'cjs',
            entryFileNames: '[name].[hash].js',
            dir: resolve(buildOutput, module, 'dist/cjs'),
            globals: {
              vue: 'Vue',
            },
          },
        ],
      },
      emptyOutDir: false,
    },
  };
};

export const buildDistFiles = async (module: string, config: UserConfig) => {
  try {
    await build(getConfig(module, config));
  } catch (e) {
    console.log('xzc', e);
  }
};
