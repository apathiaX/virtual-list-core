module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'refactor', 'wip', 'chore', 'docs', 'style', 'test']],
    'scope-enum': [
      1,
      'always',
      [
        'core',
        'react',
        'vue',
        'vue2',
      ],
    ],
    'header-max-length': [0]
  },
};
