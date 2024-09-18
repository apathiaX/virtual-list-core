import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { BaseVirtualList, VirtualListEvent } from 'virtual-list-core';
import { IVirtualListProps } from '../types';

export const useVirtualList = <T extends Record<string, any>>(
  props: IVirtualListProps<T>,
) => {
  const virtualListIns = useRef<BaseVirtualList<T> | undefined>();
  const clientRefEl = useRef<HTMLDivElement | null>(null);
  const listRefEl = useRef<HTMLDivElement | null>(null);
  const headerRefEl = useRef<HTMLDivElement | null>(null);
  const footerRefEl = useRef<HTMLDivElement | null>(null);
  const stickyHeaderRefEl = useRef<HTMLDivElement | null>(null);
  const stickyFooterRefEl = useRef<HTMLDivElement | null>(null);

  const [renderList, setRenderList] = useState<T[]>([]);

  const [headerSize, setHeaderSize] = useState(0);
  const [footerSize, setFooterSize] = useState(0);
  const [stickyHeaderSize, setStickyHeaderSize] = useState(0);
  const [stickyFooterSize, setStickyFooterSize] = useState(0);
  const [clientSize, setClientSize] = useState(0);
  const [listTotalSize, setListTotalSize] = useState(0);
  const [offset, setOffset] = useState(0);

  const onRenderListChange = useCallback(
    (renderRange: { renderBegin: number; renderEnd: number }) => {
      setRenderList(
        props.list.slice(renderRange.renderBegin, renderRange.renderEnd + 1),
      );
    },
    [props.list.length],
  );

  const observerSlots = () => {
    if (headerRefEl && headerRefEl.current) {
      virtualListIns.current?.observerEl(headerRefEl.current);
    }
    if (footerRefEl && footerRefEl.current) {
      virtualListIns.current?.observerEl(footerRefEl.current);
    }
    if (stickyHeaderRefEl && stickyHeaderRefEl.current) {
      virtualListIns.current?.observerEl(stickyHeaderRefEl.current);
    }
    if (stickyFooterRefEl && stickyFooterRefEl.current) {
      virtualListIns.current?.observerEl(stickyFooterRefEl.current);
    }
  };

  function onScrollBarScroll(ratio: number) {
    const targetOffset =
      ratio * (virtualListIns.current!.listTotalSize - clientSize);
    virtualListIns.current?.scrollWithDelta(targetOffset - offset);
  }

  const scrollToIndex = (index: number) => {
    virtualListIns.current?.scrollToIndex(index);
  };

  const scrollToOffset = (offset: number) => {
    virtualListIns.current?.scrollToOffset(offset);
  };

  const scrollToTop = () => {
    virtualListIns.current?.scrollToTop();
  };

  const scrollToBottom = () => {
    virtualListIns.current?.scrollToBottom();
  };

  const scrollIntoView = (index: number) => {
    virtualListIns.current?.scrollIntoView(index);
  };

  useEffect(() => {
    if (!clientRefEl.current) return;
    virtualListIns.current = new BaseVirtualList<T>(
      {
        clientEl: clientRefEl.current as HTMLElement,
        bodyEl: listRefEl.current as HTMLElement,
        list: props.list,
        fixed: props.fixed,
        itemKey: props.itemKey,
        minSize: props.minSize,
        buffer: props.buffer,
        bufferTop: props.bufferTop,
        bufferBottom: props.bufferBottom,
        horizontal: props.horizontal,
        renderControl: props.renderControl,
      },
      {
        [VirtualListEvent.RENDER_LIST_CHANGE]: onRenderListChange,
        [VirtualListEvent.SCROLL_TO_TOP]: (firstItem: T) => {
          props.onScrollToTop?.(firstItem);
        },
        [VirtualListEvent.SCROLL_TO_BOTTOM]: (lastItem: T) => {
          props.onScrollToBottom?.(lastItem);
        },
        [VirtualListEvent.SCROLL]: (offset: number) => {
          props.onScroll?.(offset);
        },
        [VirtualListEvent.SIZE_CHANGE]: () => {
          if (!virtualListIns.current) return;

          setClientSize(virtualListIns.current.childrenSize.clientSize);
          setFooterSize(virtualListIns.current.childrenSize.footerSize);
          setHeaderSize(virtualListIns.current.childrenSize.headerSize);
          setStickyFooterSize(
            virtualListIns.current.childrenSize.stickyFooterSize,
          );
          setStickyHeaderSize(
            virtualListIns.current.childrenSize.stickyHeaderSize,
          );

          setOffset(virtualListIns.current.listState.offset);
          setListTotalSize(virtualListIns.current.listState.listTotalSize);
        },
      },
    );
    observerSlots();

    return () => {
      virtualListIns.current?.destroy?.();
    };
  }, [props.list.length]);

  const isFirstCreate = useRef(true);

  useLayoutEffect(() => {
    if (!isFirstCreate.current) return;
    isFirstCreate.current = false;

    if (props.start || props.start === 0) {
      virtualListIns.current?.scrollToIndex(props.start);
    } else if (props.offset || props.offset === 0) {
      virtualListIns.current?.scrollToOffset(props.offset);
    }
  }, [props.start, props.offset]);

  return {
    offset,
    clientSize,
    listTotalSize,
    headerSize,
    footerSize,
    stickyFooterSize,
    stickyHeaderSize,

    clientRefEl,
    listRefEl,
    headerRefEl,
    footerRefEl,
    stickyHeaderRefEl,
    stickyFooterRefEl,
    renderList,
    virtualListIns,

    onScrollBarScroll,

    scrollToIndex,
    scrollToOffset,
    scrollToTop,
    scrollToBottom,
    scrollIntoView,
  };
};
