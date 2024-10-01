import {
  ref,
  shallowReactive,
  shallowRef,
  type SetupContext,
  type ShallowRef,
  watch,
} from 'vue';
import {
  BaseVirtualList,
  VirtualListEvent,
  type IVirtualListChildrenSize,
} from 'virtual-list-core';
import {
  type IVirtualListEmits,
  type IVirtualListProps,
  VirtualListEmitEvents,
} from '../types';

export const useVirtualList = <
  T extends Record<string, any> = Record<string, any>,
>(
  props: IVirtualListProps<T>,
  emits: SetupContext<IVirtualListEmits<T>>['emit'],
) => {
  const virtualListIns = ref<BaseVirtualList<T> | null>(null);
  const clientRefEl = ref<HTMLElement | null>(null);
  const listRefEl = ref<HTMLElement | null>(null);
  const headerRefEl = ref<HTMLElement | null>(null);
  const footerRefEl = ref<HTMLElement | null>(null);
  const stickyHeaderRefEl = ref<HTMLElement | null>(null);
  const stickyFooterRefEl = ref<HTMLElement | null>(null);

  const renderList: ShallowRef<T[]> = shallowRef([]);
  const virtualListState = shallowReactive<
    IVirtualListChildrenSize & {
      listTotalSize: number;
      offset: number;
    }
  >({
    headerSize: 0,
    footerSize: 0,
    stickyHeaderSize: 0,
    stickyFooterSize: 0,
    clientSize: 0,
    listTotalSize: 0,
    offset: 0,
  });

  const onRenderListChange = (renderRange: {
    renderBegin: number;
    renderEnd: number;
  }) => {
    renderList.value = props.list.slice(
      renderRange.renderBegin,
      renderRange.renderEnd + 1,
    );
  };

  const observerSlots = () => {
    if (headerRefEl.value) {
      virtualListIns.value?.observerEl(headerRefEl.value);
    }
    if (footerRefEl.value) {
      virtualListIns.value?.observerEl(footerRefEl.value);
    }
    if (stickyHeaderRefEl.value) {
      virtualListIns.value?.observerEl(stickyHeaderRefEl.value);
    }
    if (stickyFooterRefEl.value) {
      virtualListIns.value?.observerEl(stickyFooterRefEl.value);
    }
  };

  function onScrollBarScroll(ratio: number) {
    const targetOffset =
      ratio *
      (virtualListIns.value!.listTotalSize - virtualListState.clientSize);
    virtualListIns.value?.scrollWithDelta(
      targetOffset - virtualListState.offset,
    );
  }

  const scrollToIndex = (index: number) => {
    virtualListIns.value?.scrollToIndex(index);
  };

  const scrollToOffset = (offset: number) => {
    virtualListIns.value?.scrollToOffset(offset);
  };

  const scrollToTop = () => {
    virtualListIns.value?.scrollToTop();
  };

  const scrollToBottom = () => {
    virtualListIns.value?.scrollToBottom();
  };

  const scrollIntoView = (index: number) => {
    virtualListIns.value?.scrollIntoView(index);
  };

  let isFirstCreate = true;
  watch(
    () => props.list.length,
    () => {
      if (!clientRefEl.value) return;
      virtualListIns.value?.destroy();
      virtualListIns.value = new BaseVirtualList<T>(
        {
          clientEl: clientRefEl.value as HTMLElement,
          bodyEl: listRefEl.value as HTMLElement,
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
            emits(VirtualListEmitEvents.SCROLL_TO_TOP, firstItem);
          },
          [VirtualListEvent.SCROLL_TO_BOTTOM]: (lastItem: T) => {
            emits(VirtualListEmitEvents.SCROLL_TO_BOTTOM, lastItem);
          },
          [VirtualListEvent.SCROLL]: (offset: number) => {
            virtualListState.offset = offset;
            emits(VirtualListEmitEvents.SCROLL, offset);
          },
          [VirtualListEvent.SIZE_CHANGE]: () => {
            if (!virtualListIns.value) return;
            const {
              headerSize,
              footerSize,
              stickyHeaderSize,
              stickyFooterSize,
              clientSize,
            } = virtualListIns.value.childrenSize;

            virtualListState.headerSize = headerSize;
            virtualListState.footerSize = footerSize;
            virtualListState.stickyHeaderSize = stickyHeaderSize;
            virtualListState.stickyFooterSize = stickyFooterSize;
            virtualListState.clientSize = clientSize;

            virtualListState.listTotalSize =
              virtualListIns.value.listState.listTotalSize;

            virtualListState.offset = virtualListIns.value.listState.offset;
          },
        },
      );
      observerSlots();
      if (!isFirstCreate) return;
      setTimeout(() => {
        isFirstCreate = false;
        if (props.start) {
          virtualListIns.value?.scrollToIndex(props.start);
        } else if (props.offset) {
          virtualListIns.value?.scrollToOffset(props.offset);
        }
      });
    },
    {
      immediate: true,
    },
  );

  return {
    clientRefEl,
    listRefEl,
    headerRefEl,
    footerRefEl,
    stickyHeaderRefEl,
    stickyFooterRefEl,
    renderList,
    virtualListIns,

    virtualListState,
    onScrollBarScroll,

    scrollToIndex,
    scrollToOffset,
    scrollToTop,
    scrollToBottom,
    scrollIntoView,
  };
};
