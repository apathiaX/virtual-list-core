# BaseVirtualList API

## Public Properties
The following are properties that can be accessed publicly on an instance of `BaseVirtualList`.

- `_list: T[]` - The current list of items being managed by the virtual list.
- `_renderList: T[]` - The list of items being rendered currently.
- `_childrenSize: IVirtualListChildrenSize` - Contains sizes for client, header, footer, sticky header, and sticky footer.

## Instance Methods

### Scroll Control
- `scrollToOffset(targetOffset: number): void`: Scrolls the list to a specific offset.
- `scrollToIndex(index: number): void`: Scrolls to the specified index.
- `scrollIntoView(index: number): void`: Ensures that a specific item is in view.
- `scrollToTop(): void`: Scrolls to the top of the list.
- `scrollToBottom(): void`: Scrolls to the bottom of the list.

### List Management
- `manualTopListChange(list: T[], isDelete = false): void`: Manually adjusts the top portion of the list when items are added or removed.

## Internal Properties
While these are marked as private, they influence the behavior and state of the virtual list:
- `_state: IVirtualListState`: Stores the current state of the list including the buffer sizes, views, offset, etc.
- `_itemKey: string`: Key used to uniquely identify each item in the list.
- `_minSize: number`: Minimum size of each item in the list.
