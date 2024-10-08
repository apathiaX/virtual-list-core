import { defineConfig } from 'vitepress';

export const shared = defineConfig({
  title: 'virtual-list-core',
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  base: '/virtual-list-core/',

  rewrites: {
    'en/:rest*': ':rest*',
  },

  themeConfig: {
    // logo: { src: '/logo.svg', width: 24, height: 24 },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/apathiaX/virtual-list-core' },
    ],
  },
});
