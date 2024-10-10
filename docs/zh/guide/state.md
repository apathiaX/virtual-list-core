# BaseVirtualList 类 API

## 公共属性
以下是 `BaseVirtualList` 实例上可以公开访问的属性。

- `_list: T[]` - 当前虚拟列表管理的项目列表。
- `_renderList: T[]` - 当前正在渲染的项目列表。
- `_childrenSize: IVirtualListChildrenSize` - 包含客户端、页眉、页脚、粘性页眉和粘性页脚的尺寸信息。

## 实例方法

### 滚动控制
- `scrollToOffset(targetOffset: number): void`：将列表滚动到指定的偏移量。
- `scrollToIndex(index: number): void`：滚动到指定的索引。
- `scrollIntoView(index: number): void`：确保指定的项目可见。
- `scrollToTop(): void`：滚动到列表的顶部。
- `scrollToBottom(): void`：滚动到列表的底部。

### 列表管理
- `manualTopListChange(list: T[], isDelete = false): void`：当项目被添加或删除时，手动调整列表的顶部部分。

## 内部属性
虽然这些属性被标记为私有，但它们影响虚拟列表的行为和状态：
- `_state: IVirtualListState`：存储列表的当前状态，包括缓冲区大小、视图、偏移量等。
- `_itemKey: string`：用于唯一标识列表中每个项目的键。
- `_minSize: number`：列表中每个项目的最小尺寸。