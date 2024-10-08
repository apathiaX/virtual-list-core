import { DefaultTheme, defineConfig } from 'vitepress';

export const en = defineConfig({
  lang: 'en-US',
  description:
    'This high-performance virtual component, written in TypeScript, utilizes virtual scrolling to efficiently render millions of data entries, offering exceptional performance optimization and scalability.',
  themeConfig: {
    nav: [
      {
        text: 'Guide',
        link: '/guide/feature',
        activeMatch: '/guide/',
      },
      { text: 'Vue', link: '/vue' },
      { text: 'Vue2', link: '/vue2' },
      { text: 'React', link: '/react' },
    ],

    sidebar: {
      '/guide/': { base: '/guide/', items: sidebarGuide() },
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2024-${new Date().getFullYear()} ApathiaX`,
    },
  },
});

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'Feature', link: 'feature' },
        { text: 'Quick Start', link: 'getting-started' },
      ],
    },
    {
      text: 'API',
      collapsed: false,
      items: [
        { text: 'State', link: 'state' },
        { text: 'Options', link: 'options' },
        { text: 'Events', link: 'events' },
      ],
    },
  ];
}
