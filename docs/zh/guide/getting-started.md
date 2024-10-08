# 安装

::: code-group

```sh [npm]
$ npm add virtual-list-core
```

```sh [pnpm]
$ pnpm add virtual-list-core
```

```sh [yarn]
$ yarn add virtual-list-core
```

```sh [bun]
$ bun add virtual-list-core
```

:::

# 虚拟列表组件结构

`virtual-list-core` 采用虚拟滚动条的方式，在使用的时候需要按照特定的结构进行布局

::: details 结构示意图
<img src="/structure.png"/>
:::

``` html
<div class="virtual-list__client">
  <div class="list-body__container">
    <div class="`virtual-list__sticky-header"></div>
    <div class="virtual-list-body">
      <div class="virtual-list-header"></div>
      <div class="list-body__content"></div>
      <div class="virtual-list-footer"></div>
    </div>
    <div class="virtual-list__sticky-footer"></div>
  </div>
  <div class="virtual-list-scrollbar"></div>
</div>
```

# 简单使用

通过传入对应的配置项，即可新建一个虚拟列表类，同时会返回虚拟列表实例，可以获取列表的状态和对应的方法[API](./state.md)。可以在 `VirtualListEvent.UPDATE_RENDER_RANGE` 事件中获取需要渲染的元素的区间，再去渲染对应的元素。

``` ts
import { BaseVirtualList } from 'virtual-list-core'

const virtualListIns = new BaseVirtualList(
  {
    clientEl,
    bodyEl,
    list,
    itemKey,
    // ......
  },
  {
    [VirtualListEvent.UPDATE_RENDER_RANGE]: onRenderRangeUpdate,
    [VirtualListEvent.UPDATE_VIRTUAL_SIZE]: onVirtualSizeUpdate,
    [VirtualListEvent.UPDATE_VIEW_RANGE]: onViewRangeUpdate,
    [VirtualListEvent.UPDATE_ITEM_SIZE]: onItemSizeUpdate,
    [VirtualListEvent.UPDATE_TRANSFORM_DISTANCE]: onTransformDistanceUpdate,
    [VirtualListEvent.SCROLL]: onScroll,
    [VirtualListEvent.SCROLL_TO_TOP]: onScrollToTop,
    [VirtualListEvent.SCROLL_TO_BOTTOM]: onScrollToBottom,
    [VirtualListEvent.RENDER_LIST_CHANGE]: onRenderChange,
  },
);

const onRenderChange = (
  renderRange: { renderBegin: number; renderEnd: number },
  renderList: T[],
) => {
  renderNode(renderList, renderRange);
};
```