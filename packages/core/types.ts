export interface IVirtualListOptions<T> {
  containerEl?: HTMLElement;
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

export interface IVirtualListState {
  views: number;

  // 滚动距离
  offset: number;
  // 不包含插槽的高度
  listTotalSize: number;
  // 虚拟占位尺寸，是从0到renderBegin的尺寸
  virtualSize: number;
  // 可视区的起始下标
  inViewBegin: number;
  // 可视区的结束下标
  inViewEnd: number;

  // buffer的起始下标
  renderBegin: number;
  // buffer的结束下标
  renderEnd: number;

  bufferTop: number;
  bufferBottom: number;

  transformDistance: number;
  scrollDistance: number;
}

export enum VirtualListEvent {
  UPDATE_RENDER_RANGE = 'updateRenderRange',
  UPDATE_VIRTUAL_SIZE = 'updateVirtualSize',
  UPDATE_VIEW_RANGE = 'updateViewRange',
  UPDATE_ITEM_SIZE = 'updateItemSize',
  UPDATE_TRANSFORM_DISTANCE = 'updateTransformDistance',
  SCROLL = 'scroll',
  SCROLL_TO_TOP = 'scrollToTop',
  SCROLL_TO_BOTTOM = 'scrollToBottom',
  RENDER_LIST_CHANGE = 'renderListChange',
}

export interface IVirtualListCallBack<T> {
  [VirtualListEvent.UPDATE_RENDER_RANGE]?: (begin: number, end: number) => void;
  [VirtualListEvent.UPDATE_VIRTUAL_SIZE]?: (virtualSize: number) => void;
  [VirtualListEvent.UPDATE_VIEW_RANGE]?: (begin: number, end: number) => void;
  [VirtualListEvent.UPDATE_ITEM_SIZE]?: (id: string, size: number) => void;
  [VirtualListEvent.UPDATE_TRANSFORM_DISTANCE]?: (distance: number) => void;
  [VirtualListEvent.SCROLL]?: (offset: number) => void;
  [VirtualListEvent.SCROLL_TO_TOP]?: (firstItem: T) => void;
  [VirtualListEvent.SCROLL_TO_BOTTOM]?: (lastItem: T) => void;
  [VirtualListEvent.RENDER_LIST_CHANGE]?: (
    renderList: T[],
    clientEl: HTMLElement | Element,
  ) => void;
}

export interface IVirtualListChildrenSize {
  clientSize: number;
  headerSize: number;
  footerSize: number;
  stickyHeaderSize: number;
  stickyFooterSize: number;
}

export enum ScrollDirection {
  FORWARD = 'forward',
  BACKWARD = 'backward',
}

export enum ScrollbarDirection {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export interface IScrollOptions {
  thumbEl: HTMLElement;
  trickerEl: HTMLElement;
  direction: ScrollbarDirection;
  clientSize: number;
  listSize: number;
  scrollFrom: number;
  scrollFn?: (distance: number) => void;
  thumbClass?: string;
  trickerClass?: string;
  thumbStyle?: Record<string, string | number>;
  trickerStyle?: Record<string, string | number>;
}

export interface IScrollbarState {
  clientSize: number;
  listSize: number;
  scrollFrom: number;
  thumbSize: number;
}

export const SCROLL_BAR_MAP = {
  [ScrollbarDirection.HORIZONTAL]: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  },
  [ScrollbarDirection.VERTICAL]: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  },
};

export const SCROLLBAR_MIN_SIZE = 20;
