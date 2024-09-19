import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginVue from "eslint-plugin-vue";
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  {
    languageOptions: { 
      globals: {
        ...globals.browser, 
        ...globals.node
      } 
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  {
    name: "virtual-list/react",
    files: ["packages/react/**/*.{jsx,tsx}"],
    ...pluginReact.configs.flat.recommended,
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/react-in-jsx-scope': 'off', // 禁用 "React must be in scope" 规则
    },
  },
  ...pluginVue.configs["flat/essential"].map(config => ({
    ...config,
    files: ["packages/vue/**/*.{vue}"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  })),
  ...pluginVue.configs["flat/vue2-essential"].map(config => ({
    ...config,
    files: ["packages/vue2/**/*.{vue}"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  }))
];