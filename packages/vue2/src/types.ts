import Vue from 'vue';
import { BaseVirtualList, ScrollbarDirection } from 'virtual-list-core';
import VirtualList from './components/VirtualList.vue';

export interface IVirtualListProps<
  T extends Record<string, any> = Record<string, any>,
> {
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

  listStyle?: CSSStyleDeclaration;
  listClass?: string;
  itemStyle?: CSSStyleDeclaration;
  itemClass?: string;
  headerClass?: string;
  headerStyle?: CSSStyleDeclaration;
  footerClass?: string;
  footerStyle?: CSSStyleDeclaration;
  stickyHeaderClass?: string;
  stickyHeaderStyle?: CSSStyleDeclaration;
  stickyFooterClass?: string;
  stickyFooterStyle?: CSSStyleDeclaration;

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

declare module 'vue' {
  export interface VirtualList<V extends Vue> {
    props?: IVirtualListProps;
    data?(this: V): {
      virtualListIns: BaseVirtualList<Record<string, any>> | null;
      renderList: Record<string, any>[];
      virtualListState: {
        headerSize: number;
        footerSize: number;
        stickyHeaderSize: number;
        stickyFooterSize: number;
        clientSize: number;
        listTotalSize: number;
        offset: number;
      };
      ScrollbarDirection: typeof ScrollbarDirection;
    };
    methods?: {
      onRenderListChange: (renderRange: {
        renderBegin: number;
        renderEnd: number;
      }) => void;
      onScrollBarScroll: (ratio: number) => void;
    };
    computed?: {
      listLength: () => number;
      renderBegin: () => number;
      resizeObserver: () => ResizeObserver;
    };
    mounted?(): void;
  }
}
