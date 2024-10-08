import { defineConfig } from 'vitepress';

export const shared = defineConfig({
  title: 'virtual-list-core',
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  rewrites: {
    'en/:rest*': ':rest*',
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/apathiaX/virtual-list' },
    ],
  },
});
