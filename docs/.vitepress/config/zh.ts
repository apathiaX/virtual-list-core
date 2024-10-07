import { DefaultTheme, defineConfig } from 'vitepress';

export const zh = defineConfig({
  lang: 'zh-Hans',
  description:
    '这是一个高性能虚拟滚动组件，使用 TypeScript 编写，能够高效渲染海量数据，提升性能并确保可扩展性。',
  themeConfig: {
    nav: [
      {
        text: '指南',
        link: '/zh/guide/feature',
        activeMatch: '/zh/guide/',
      },
      { text: 'Vue', link: '/en/vue' },
      { text: 'Vue2', link: '/en/vue2' },
      { text: 'React', link: '/en/react' },
    ],

    sidebar: {
      '/zh/guide/': { base: '/zh/guide/', items: sidebarGuide() },
    },
    footer: {
      message: '基于 MIT 许可发布',
      copyright: `版权所有 © 2024-${new Date().getFullYear()} ApathiaX`,
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    outline: {
      label: '页面导航',
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },
});

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      collapsed: false,
      items: [
        { text: '特性', link: 'feature' },
        { text: '快速开始', link: 'getting-started' },
      ],
    },
    {
      text: 'API',
      collapsed: false,
      items: [
        { text: '配置选项', link: 'options' },
        { text: '属性方法', link: 'methods' },
      ],
    },
  ];
}
