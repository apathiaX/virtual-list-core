# Options

## Properties

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

- **Type:** `HTMLElement | undefined`
- **Description:**  
  _(Optional)_ The HTML element that acts as the viewport or container for the virtual list. This is the visible area through which the user interacts with the list items. If not specified, the default element might be the parent of the list.

### `bodyEl?: HTMLElement`

- **Type:** `HTMLElement | undefined`
- **Description:**  
  _(Optional)_ The HTML element that contains the actual list of items. This element holds the rendered content, while `clientEl` defines the visible area of the list.

### `list: T[]`

- **Type:** `T[]`
- **Description:**  
  The array of data entries of type `T` that will be rendered in the virtual list. This is the main dataset, where each entry corresponds to a list item.

### `itemKey: string`

- **Type:** `string`
- **Description:**  
  A string key that uniquely identifies each item in the `list`. This is useful for tracking items efficiently and preventing unnecessary re-rendering, especially when the list is updated or filtered.

### `horizontal?: boolean`

- **Type:** `boolean | undefined`
- **Description:**  
  _(Optional)_ A boolean flag that determines whether the list scrolls horizontally (`true`) or vertically (`false`, default). Use this if you need horizontal scrolling behavior in your component.

### `minSize?: number`

- **Type:** `number | undefined`
- **Description:**  
  _(Optional)_ The minimum size (in pixels) of each list item. This value helps the virtual scroller compute how many items can fit within the visible viewport, optimizing the rendering process.

### `fixed?: boolean`

- **Type:** `boolean | undefined`
- **Description:**  
  _(Optional)_ If `true`, this indicates that each item in the list has a fixed size. Fixed-size items allow the virtual scroller to make precise calculations and potentially improve performance by avoiding recalculations on each render.

### `buffer?: number`

- **Type:** `number | undefined`
- **Description:**  
  _(Optional)_ The number of extra items to render outside the visible viewport to improve the smoothness of the scrolling experience. A higher buffer helps avoid white spaces during fast scrolling.

### `bufferTop?: number`

- **Type:** `number | undefined`
- **Description:**  
  _(Optional)_ Specifies how many extra items should be rendered above the visible area to prevent any flickering or white space during upward scrolling.

### `bufferBottom?: number`

- **Type:** `number | undefined`
- **Description:**  
  _(Optional)_ Specifies how many extra items should be rendered below the visible area to ensure that fast scrolling doesn't result in a blank screen as items load.

### `renderControl?: (begin: number, end: number) => { begin: number; end: number }`

- **Type:** `function | undefined`
- **Description:**  
  _(Optional)_ A function that takes the indices of the first (`begin`) and last (`end`) visible items and returns an adjusted range of indices to control the rendering behavior. This is useful if you want custom logic for determining which items should be rendered at any given time.

## Event

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

### `UPDATE_RENDER_RANGE`

- **Type:** `string`
- **Description:**  
  Triggered when the visible render range is updated, providing the new start and end indices.

### `UPDATE_VIRTUAL_SIZE`

- **Type:** `string`
- **Description:**  
  Triggered when the total size of the virtual list is updated, providing the updated virtual list size.

### `UPDATE_VIEW_RANGE`

- **Type:** `string`
- **Description:**  
  Triggered when the view range is updated, providing the new start and end indices.

### `UPDATE_ITEM_SIZE`

- **Type:** `string`
- **Description:**  
  Triggered when the size of an individual item changes, providing the item's `id` and new size.

### `UPDATE_TRANSFORM_DISTANCE`

- **Type:** `string`
- **Description:**  
  Triggered when the transform offset is updated, providing the new offset distance.

### `SCROLL`

- **Type:** `string`
- **Description:**  
  Triggered when the list is scrolled, providing the current scroll offset.

### `SCROLL_TO_TOP`

- **Type:** `string`
- **Description:**  
  Triggered when the list scrolls to the top, providing the first visible item.

### `SCROLL_TO_BOTTOM`

- **Type:** `string`
- **Description:**  
  Triggered when the list scrolls to the bottom, providing the last visible item.

### `RENDER_LIST_CHANGE`

- **Type:** `string`
- **Description:**  
  Triggered when the render list changes, providing the render range, rendered items, and the list container element.

### `SIZE_CHANGE`

- **Type:** `string`
- **Description:**  
  Triggered when the size of the virtual list items changes, providing the updated item sizes.

## CallBack

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

### `[VirtualListEvent.UPDATE_RENDER_RANGE]?: (begin: number, end: number) => void`

- **Type:** `(begin: number, end: number) => void | undefined`
- **Description:**  
  Triggered when the render range is updated, providing the new start and end indices.

### `[VirtualListEvent.UPDATE_VIRTUAL_SIZE]?: (virtualSize: number) => void`

- **Type:** `(virtualSize: number) => void | undefined`
- **Description:**  
  Triggered when the total size of the virtual list is updated, providing the updated virtual list size.

### `[VirtualListEvent.UPDATE_VIEW_RANGE]?: (begin: number, end: number) => void`

- **Type:** `(begin: number, end: number) => void | undefined`
- **Description:**  
  Triggered when the view range is updated, providing the new start and end indices.

### `[VirtualListEvent.UPDATE_ITEM_SIZE]?: (id: string, size: number) => void`

- **Type:** `(id: string, size: number) => void | undefined`
- **Description:**  
  Triggered when the size of an individual item changes, providing the item's `id` and new size.

### `[VirtualListEvent.UPDATE_TRANSFORM_DISTANCE]?: (distance: number) => void`

- **Type:** `(distance: number) => void | undefined`
- **Description:**  
  Triggered when the transform offset is updated, providing the new offset distance.

### `[VirtualListEvent.SCROLL]?: (offset: number) => void`

- **Type:** `(offset: number) => void | undefined`
- **Description:**  
  Triggered when the list is scrolled, providing the current scroll offset.

### `[VirtualListEvent.SCROLL_TO_TOP]?: (firstItem: T) => void`

- **Type:** `(firstItem: T) => void | undefined`
- **Description:**  
  Triggered when the list scrolls to the
