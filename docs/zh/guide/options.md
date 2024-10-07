# 配置选项

## 属性

::: details IVirtualListOptions
``` ts
interface IVirtualListOptions<T> {
  clientEl?: HTMLElement;
  bodyEl?: HTMLElement;

  list: T[];
  itemKey: string;
  horizontal?: boolean;
  minSize?: number;
  fixed?: boolean;
  buffer?: number;
  bufferTop?: number;
  bufferBottom?: number;
  renderControl?: (
    begin: number,
    end: number,
  ) => { begin: number; end: number };
}
```
:::

### `clientEl?: HTMLElement`

- **类型:** `HTMLElement | undefined`
- **说明:**  
  _(可选)_ 用作虚拟列表视口或容器的 HTML 元素。该元素定义用户与列表条目交互的可见区域。如果未指定，默认元素可能是列表的父级元素。

### `bodyEl?: HTMLElement`

- **类型:** `HTMLElement | undefined`
- **说明:**  
  _(可选)_ 包含实际列表条目的 HTML 元素。此元素持有渲染的内容，而 `clientEl` 则定义了列表的可见区域。

### `list: T[]`

- **类型:** `T[]`
- **说明:**  
  将要在虚拟列表中渲染的数据条目数组，类型为 `T`。这是主要的数据集，每个条目对应于一个列表项。

### `itemKey: string`

- **类型:** `string`
- **说明:**  
  唯一标识 `list` 中每个条目的字符串键。此键有助于高效追踪条目，尤其是在列表更新或过滤时，避免不必要的重新渲染。

### `horizontal?: boolean`

- **类型:** `boolean | undefined`
- **说明:**  
  _(可选)_ 一个布尔值，决定列表是否水平滚动（`true`），或垂直滚动（默认为`false`）。当需要横向滚动行为时可以使用此选项。

### `minSize?: number`

- **类型:** `number | undefined`
- **说明:**  
  _(可选)_ 每个列表项的最小尺寸（单位：像素）。此值有助于虚拟滚动器计算可见视口内可以容纳的条目数量，从而优化渲染过程。

### `fixed?: boolean`

- **类型:** `boolean | undefined`
- **说明:**  
  _(可选)_ 如果为 `true`，表示列表中的每个条目具有固定大小。固定大小的条目允许虚拟滚动器进行精确的计算，避免每次渲染时重新计算，提升性能。

### `buffer?: number`

- **类型:** `number | undefined`
- **说明:**  
  _(可选)_ 在可见视口之外渲染的额外条目数量，以提高滚动体验的流畅性。较大的缓冲区有助于在快速滚动时避免出现空白区域。

### `bufferTop?: number`

- **类型:** `number | undefined`
- **说明:**  
  _(可选)_ 指定应在可见区域上方渲染的额外条目数量，以防止向上滚动时出现闪烁或空白区域。

### `bufferBottom?: number`

- **类型:** `number | undefined`
- **说明:**  
  _(可选)_ 指定应在可见区域下方渲染的额外条目数量，以确保在快速滚动时不会因为加载而出现空白屏幕。

### `renderControl?: (begin: number, end: number) => { begin: number; end: number }`

- **类型:** `function | undefined`
- **说明:**  
  _(可选)_ 一个函数，接收第一个（`begin`）和最后一个（`end`）可见条目的索引，并返回经过调整的渲染范围。这在自定义控制每次渲染哪些条目时非常有用。

## 事件

::: details VirtualListEvent
``` ts 
enum VirtualListEvent {
  UPDATE_RENDER_RANGE = 'updateRenderRange',
  UPDATE_VIRTUAL_SIZE = 'updateVirtualSize',
  UPDATE_VIEW_RANGE = 'updateViewRange',
  UPDATE_ITEM_SIZE = 'updateItemSize',
  UPDATE_TRANSFORM_DISTANCE = 'updateTransformDistance',
  SCROLL = 'scroll',
  SCROLL_TO_TOP = 'scrollToTop',
  SCROLL_TO_BOTTOM = 'scrollToBottom',
  RENDER_LIST_CHANGE = 'renderListChange',
  SIZE_CHANGE = 'sizeChange',
}
```
:::

`VirtualListEvent` 枚举定义了虚拟列表组件中可能发生的各种事件。这些事件用于跟踪列表的渲染范围、大小变化、滚动行为等。

### `UPDATE_RENDER_RANGE`

- **类型:** `string`
- **描述:**  
  触发当可见渲染范围更新时，提供新的开始索引和结束索引。

### `UPDATE_VIRTUAL_SIZE`

- **类型:** `string`
- **描述:**  
  触发当虚拟列表的总大小更新时，提供更新后的虚拟列表大小。

### `UPDATE_VIEW_RANGE`

- **类型:** `string`
- **描述:**  
  触发当视图范围更新时，提供新的开始和结束索引。

### `UPDATE_ITEM_SIZE`

- **类型:** `string`
- **描述:**  
  触发当某一项的大小发生变化时，提供项目的 `id` 和新大小。

### `UPDATE_TRANSFORM_DISTANCE`

- **类型:** `string`
- **描述:**  
  触发当偏移量更新时，提供新的偏移距离。

### `SCROLL`

- **类型:** `string`
- **描述:**  
  触发当列表滚动时，提供当前的滚动偏移量。

### `SCROLL_TO_TOP`

- **类型:** `string`
- **描述:**  
  触发当列表滚动到顶部时，提供第一个可见的项目。

### `SCROLL_TO_BOTTOM`

- **类型:** `string`
- **描述:**  
  触发当列表滚动到底部时，提供最后一个可见的项目。

### `RENDER_LIST_CHANGE`

- **类型:** `string`
- **描述:**  
  触发当渲染列表发生变化时，提供渲染范围、渲染的列表项和列表容器元素。

### `SIZE_CHANGE`

- **类型:** `string`
- **描述:**  
  触发当虚拟列表的项的尺寸发生变化时，提供更新后的项尺寸信息。

## 回调

::: details
``` ts IVirtualListCallBack
interface IVirtualListCallBack<T> {
  [VirtualListEvent.UPDATE_RENDER_RANGE]?: (begin: number, end: number) => void;
  [VirtualListEvent.UPDATE_VIRTUAL_SIZE]?: (virtualSize: number) => void;
  [VirtualListEvent.UPDATE_VIEW_RANGE]?: (begin: number, end: number) => void;
  [VirtualListEvent.UPDATE_ITEM_SIZE]?: (id: string, size: number) => void;
  [VirtualListEvent.UPDATE_TRANSFORM_DISTANCE]?: (distance: number) => void;
  [VirtualListEvent.SCROLL]?: (offset: number) => void;
  [VirtualListEvent.SCROLL_TO_TOP]?: (firstItem: T) => void;
  [VirtualListEvent.SCROLL_TO_BOTTOM]?: (lastItem: T) => void;
  [VirtualListEvent.RENDER_LIST_CHANGE]?: (
    renderRange: { renderBegin: number; renderEnd: number },
    renderList: T[],
    clientEl: HTMLElement | Element,
  ) => void;
  [VirtualListEvent.SIZE_CHANGE]?: (sizes: IVirtualListChildrenSize) => void;
}
```
:::

`IVirtualListCallBack<T>` 接口定义了与 `VirtualListEvent` 相关的回调函数，用于处理不同事件触发时的响应逻辑。

### `[VirtualListEvent.UPDATE_RENDER_RANGE]?: (begin: number, end: number) => void`

- **类型:** `(begin: number, end: number) => void | undefined`
- **描述:**  
  当渲染范围更新时触发，提供新的开始和结束索引。

### `[VirtualListEvent.UPDATE_VIRTUAL_SIZE]?: (virtualSize: number) => void`

- **类型:** `(virtualSize: number) => void | undefined`
- **描述:**  
  当虚拟列表的总大小更新时触发，提供更新后的虚拟列表大小。

### `[VirtualListEvent.UPDATE_VIEW_RANGE]?: (begin: number, end: number) => void`

- **类型:** `(begin: number, end: number) => void | undefined`
- **描述:**  
  当视图范围更新时触发，提供新的开始和结束索引。

### `[VirtualListEvent.UPDATE_ITEM_SIZE]?: (id: string, size: number) => void`

- **类型:** `(id: string, size: number) => void | undefined`
- **描述:**  
  当某个列表项的大小发生变化时触发，提供项目 `id` 和新大小。

### `[VirtualListEvent.UPDATE_TRANSFORM_DISTANCE]?: (distance: number) => void`

- **类型:** `(distance: number) => void | undefined`
- **描述:**  
  当偏移量更新时触发，提供新的偏移距离。

### `[VirtualListEvent.SCROLL]?: (offset: number) => void`

- **类型:** `(offset: number) => void | undefined`
- **描述:**  
  当列表滚动时触发，提供当前的滚动偏移量。

### `[VirtualListEvent.SCROLL_TO_TOP]?: (firstItem: T) => void`

- **类型:** `(firstItem: T) => void | undefined`
- **描述:**  
  当列表滚动到顶部时触发，提供第一个可见的项目。

### `[VirtualListEvent.SCROLL_TO_BOTTOM]?: (lastItem: T) => void`

- **类型:** `(lastItem: T) => void | undefined`
- **描述:**  
  当列表滚动到底部时触发，提供最后一个可见的项目。

### `[VirtualListEvent.RENDER_LIST_CHANGE]?: (renderRange: { renderBegin: number; renderEnd: number }, renderList: T[], clientEl: HTMLElement | Element) => void`

- **类型:** `(renderRange: { renderBegin: number; renderEnd: number }, renderList: T[], clientEl: HTMLElement | Element) => void | undefined`
- **描述:**  
  当渲染列表发生变化时触发，提供渲染范围、渲染的列表项以及列表的容器元素。

### `[VirtualListEvent.SIZE_CHANGE]?: (sizes: IVirtualListChildrenSize) => void`

- **类型:** `(sizes: IVirtualListChildrenSize) => void | undefined`
- **描述:**  
  当虚拟列表项的尺寸发生变化时触发，提供更新后的尺寸信息。
