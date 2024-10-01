import type { CSSProperties } from 'vue';
import VirtualList from './components/VirtualList.vue';

export interface IVirtualListProps<T extends Record<string, any>> {
  list: T[];
  itemKey: string;
  minSize: number;
  scrollDistance?: number;
  renderControl?: (
    begin: number,
    end: number,
  ) => { begin: number; end: number };

  fixed?: boolean;
  buffer?: number;
  bufferTop?: number;
  bufferBottom?: number;
  horizontal?: boolean;
  start?: number;
  offset?: number;

  listStyle?: CSSProperties;
  listClass?: string;
  itemStyle?: CSSProperties;
  itemClass?: string;
  headerClass?: string;
  headerStyle?: CSSProperties;
  footerClass?: string;
  footerStyle?: CSSProperties;
  stickyHeaderClass?: string;
  stickyHeaderStyle?: CSSProperties;
  stickyFooterClass?: string;
  stickyFooterStyle?: CSSProperties;

  /** scrollbar style props */
  disableScrollbar?: boolean;
  scrollbarBgColor?: string;
  scrollbarThumbClass?: string;
  scrollbarTrickerClass?: string;
  scrollbarThumbStyle?: Record<string, string | number>;
  scrollbarTrickerStyle?: Record<string, string | number>;
}

export interface IObserverItemProps {
  resizeObserver?: ResizeObserver;
  id: string | number;
}

export enum VirtualListEmitEvents {
  SCROLL = 'onScroll',
  SCROLL_TO_TOP = 'onScrollToTop',
  SCROLL_TO_BOTTOM = 'onScrollToBottom',
}

export interface IVirtualListEmits<T> {
  [VirtualListEmitEvents.SCROLL]: (offset: number) => void;
  [VirtualListEmitEvents.SCROLL_TO_TOP]: (firstItem: T) => void;
  [VirtualListEmitEvents.SCROLL_TO_BOTTOM]: (lastItem: T) => void;
}

export type VirtualListIns = InstanceType<typeof VirtualList>;
