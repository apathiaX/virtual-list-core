export interface IVirtualListOptions<T> {
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

  offset: number;
  listTotalSize: number;
  virtualSize: number;
  inViewBegin: number;
  inViewEnd: number;

  renderBegin: number;
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
  SIZE_CHANGE = 'sizeChange',
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
    renderRange: { renderBegin: number; renderEnd: number },
    renderList: T[],
    clientEl: HTMLElement | Element,
  ) => void;
  [VirtualListEvent.SIZE_CHANGE]?: (sizes: IVirtualListChildrenSize) => void;
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
  bgColor?: string;
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

export enum ScrollbarEvent {
  SCROLL = 'scroll',
}

export interface IScrollbarCallBack {
  [ScrollbarEvent.SCROLL]?: (offsetRatio: number) => void;
}

export interface IScrollbarStyleKeys {
  offset: 'offsetWidth' | 'offsetHeight';
  scroll: 'scrollLeft' | 'scrollTop';
  scrollSize: 'scrollWidth' | 'scrollHeight';
  size: 'width' | 'height';
  key: 'horizontal' | 'vertical';
  axis: 'X' | 'Y';
  client: 'clientX' | 'clientY';
  direction: 'left' | 'top';
}

export interface IRenderThumbStyleParams {
  bar: {
    size: 'height' | 'width';
    axis?: 'X' | 'Y';
  };
  size?: string;
  move?: number;
  direction?: 'vertical' | 'horizontal';
}

export const SCROLL_BAR_STATE_MAP: Record<
  ScrollbarDirection,
  IScrollbarStyleKeys
> = {
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

export interface IScrollbarStyleOptions {
  thumbClass?: string;
  trickerClass?: string;
  thumbStyle?: Record<string, string | number>;
  trickerStyle?: Record<string, string | number>;
  bgColor?: string;
}

export const SCROLLBAR_MIN_SIZE = 20;

export type GenericFunction<Args extends any[] = [], R = any> = (
  ...args: Args
) => R;

export const DEFAULT_LIST_ITEM_KEY = 'id';

export enum DEFAULT_LIST_ITEM_OBSERVER_ID {
  CLIENT = 'client',
  HEADER = 'header',
  FOOTER = 'footer',
  STICKY_HEADER = 'stickyHeader',
  STICKY_FOOTER = 'stickyFooter',
}
