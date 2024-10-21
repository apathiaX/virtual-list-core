export const PKG_NAME = 'dist';

export const MODULE_PREFIX = 'virtual-list-core';

export const PACKAGES = ['core', 'vue', 'react', 'vue2'] as const;

export const OUTPUT_MODULES = ['esm', 'cjs'] as const;

export const BASE_PACKAGE_CONFIG = {
  main: 'dist/cjs/index.js',
  module: 'dist/esm/index.mjs',
  types: 'dist/types/index.d.ts',
  typesVersions: {
    '>=4.0': {
      '*': ['dist/types/*'],
    },
  },
  devDependencies: {},
  exports: {
    '.': {
      types: './dist/types/index.d.ts',
      require: './dist/cjs/index.js',
      import: './dist/esm/index.mjs',
    },
    './package.json': './package.json',
  },
};
