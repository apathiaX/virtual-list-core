#  回调事件

## `UPDATE_RENDER_RANGE`

- **类型**: `(begin: number, end: number) => void`
- **描述**: 当渲染范围更新时触发。
- **参数**:
  - `begin`: 渲染开始索引。
  - `end`: 渲染结束索引。

## `UPDATE_VIRTUAL_SIZE`

- **类型**: `(virtualSize: number) => void`
- **描述**: 当虚拟列表的大小更新时触发。
- **参数**:
  - `virtualSize`: 虚拟列表的新大小。

## `UPDATE_VIEW_RANGE`

- **类型**: `(begin: number, end: number) => void`
- **描述**: 当视图范围更新时触发。
- **参数**:
  - `begin`: 视图开始索引。
  - `end`: 视图结束索引。

## `UPDATE_ITEM_SIZE`

- **类型**: `(id: string, size: number) => void`
- **描述**: 当某个条目的大小更新时触发。
- **参数**:
  - `id`: 条目的唯一标识。
  - `size`: 条目的新大小。

## `UPDATE_TRANSFORM_DISTANCE`

- **类型**: `(distance: number) => void`
- **描述**: 当变换距离更新时触发。
- **参数**:
  - `distance`: 新的变换距离。

## `SCROLL`

- **类型**: `(offset: number) => void`
- **描述**: 当滚动事件发生时触发。
- **参数**:
  - `offset`: 滚动偏移量。

## `SCROLL_TO_TOP`

- **类型**: `(firstItem: T) => void`
- **描述**: 当滚动到顶部时触发。
- **参数**:
  - `firstItem`: 列表中的第一个条目。

## `SCROLL_TO_BOTTOM`

- **类型**: `(lastItem: T) => void`
- **描述**: 当滚动到底部时触发。
- **参数**:
  - `lastItem`: 列表中的最后一个条目。

## `RENDER_LIST_CHANGE`

- **类型**: `(renderRange: { renderBegin: number; renderEnd: number }, renderList: T[], clientEl: HTMLElement | Element) => void`
- **描述**: 当渲染列表改变时触发。
- **参数**:
  - `renderRange`: 包含渲染开始和结束索引的对象。
  - `renderList`: 当前渲染的列表条目。
  - `clientEl`: 客户端元素。

## `SIZE_CHANGE`

- **类型**: `(sizes: IVirtualListChildrenSize) => void`
- **描述**: 当列表子项大小改变时触发。
- **参数**:
  - `sizes`: 包含子项大小信息的对象。
