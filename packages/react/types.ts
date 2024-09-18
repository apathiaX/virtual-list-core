import type { CSSProperties, ReactNode } from 'react';
import { ScrollbarDirection } from 'virtual-list-core';

export interface IVirtualListProps<T> {
  list: T[];
  itemKey: string;
  minSize: number;
  start?: number;
  offset?: number;
  fixed?: boolean;
  buffer?: number;
  bufferTop?: number;
  bufferBottom?: number;
  horizontal?: boolean;
  renderControl?: (
    begin: number,
    end: number,
  ) => { begin: number; end: number };
  footer?: () => ReactNode;
  header?: () => ReactNode;
  content?: (data: T, index: number) => ReactNode;
  stickyHeader?: () => ReactNode;
  stickyFooter?: () => ReactNode;
  scrollbar?: () => ReactNode;

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

  /** virtual list callback */

  onScroll?: (offset: number) => void;
  onScrollToTop?: (firstItem: T) => void;
  onScrollToBottom?: (lastItem: T) => void;
}

export interface IObserverItemProps {
  resizeObserver?: ResizeObserver;
  id: string | number;
  customRender: () => ReactNode;
}

export enum VirtualListEmitEvents {
  SCROLL = 'onScroll',
  SCROLL_TO_TOP = 'onScrollToTop',
  SCROLL_TO_BOTTOM = 'onScrollToBottom',
}

export interface IScrollbarProps {
  direction: ScrollbarDirection;
  clientSize: number;
  listSize: number;
  scrollFrom: number;
  bgColor?: string;
  thumbClass?: string;
  trickerClass?: string;
  thumbStyle?: Record<string, string | number>;
  trickerStyle?: Record<string, string | number>;
  onScroll?: (offsetRa: number) => void;
}
