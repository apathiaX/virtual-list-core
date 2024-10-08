# Callback Events

## `UPDATE_RENDER_RANGE`

- **Type**: `(begin: number, end: number) => void`
- **Description**: Triggered when the render range is updated.
- **Parameters**:
  - `begin`: The starting index of the render range.
  - `end`: The ending index of the render range.

## `UPDATE_VIRTUAL_SIZE`

- **Type**: `(virtualSize: number) => void`
- **Description**: Triggered when the virtual list size is updated.
- **Parameters**:
  - `virtualSize`: The new size of the virtual list.

## `UPDATE_VIEW_RANGE`

- **Type**: `(begin: number, end: number) => void`
- **Description**: Triggered when the view range is updated.
- **Parameters**:
  - `begin`: The starting index of the view range.
  - `end`: The ending index of the view range.

## `UPDATE_ITEM_SIZE`

- **Type**: `(id: string, size: number) => void`
- **Description**: Triggered when an item's size is updated.
- **Parameters**:
  - `id`: The unique identifier of the item.
  - `size`: The new size of the item.

## `UPDATE_TRANSFORM_DISTANCE`

- **Type**: `(distance: number) => void`
- **Description**: Triggered when the transform distance is updated.
- **Parameters**:
  - `distance`: The new transform distance.

## `SCROLL`

- **Type**: `(offset: number) => void`
- **Description**: Triggered when a scroll event occurs.
- **Parameters**:
  - `offset`: The scroll offset.

## `SCROLL_TO_TOP`

- **Type**: `(firstItem: T) => void`
- **Description**: Triggered when scrolling to the top.
- **Parameters**:
  - `firstItem`: The first item in the list.

## `SCROLL_TO_BOTTOM`

- **Type**: `(lastItem: T) => void`
- **Description**: Triggered when scrolling to the bottom.
- **Parameters**:
  - `lastItem`: The last item in the list.

## `RENDER_LIST_CHANGE`

- **Type**: `(renderRange: { renderBegin: number; renderEnd: number }, renderList: T[], clientEl: HTMLElement | Element) => void`
- **Description**: Triggered when the render list changes.
- **Parameters**:
  - `renderRange`: An object containing the render begin and end indices.
  - `renderList`: The list of currently rendered items.
  - `clientEl`: The client element.

## `SIZE_CHANGE`

- **Type**: `(sizes: IVirtualListChildrenSize) => void`
- **Description**: Triggered when the size of list children changes.
- **Parameters**:
  - `sizes`: An object containing size information of the children.