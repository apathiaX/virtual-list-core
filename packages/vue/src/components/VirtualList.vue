<template>
  <div class="virtual-list__client" ref="clientRefEl" data-id="client">
    <div class="list-body__container">
      <div
        v-if="$slots.stickyHeader"
        ref="stickyHeaderRefEl"
        :class="`virtual-list__sticky-header ${stickyHeaderClass}`"
        :style="stickyHeaderStyle"
        data-id="stickyHeader"
      >
        <slot name="stickyHeader"></slot>
      </div>
      <div class="virtual-list-body" ref="listRefEl">
        <div
          v-if="$slots.header"
          ref="headerRefEl"
          :class="headerClass"
          :style="headerStyle"
          data-id="header"
        >
          <slot name="header"></slot>
        </div>
        <div class="list-body__content">
          <ObserverItem
            v-for="(item, index) in renderList"
            :key="item[itemKey]"
            :id="item[itemKey]"
            :resizeObserver="virtualListIns?.resizeObserver"
          >
            <template #default>
              <slot
                :data="item"
                :index="virtualListIns!.listState.renderBegin + index"
              ></slot>
            </template>
          </ObserverItem>
        </div>
        <div
          v-if="$slots.footer"
          ref="footerRefEl"
          :class="footerClass"
          :style="footerStyle"
          data-id="footer"
        >
          <slot name="footer"></slot>
        </div>
      </div>
      <div
        v-if="$slots.stickyFooter"
        ref="stickyFooterRefEl"
        :class="`virtual-list__sticky-footer ${stickyFooterClass}`"
        :style="stickyFooterStyle"
        data-id="stickyFooter"
      >
        <slot name="stickyFooter"></slot>
      </div>
    </div>
    <Scrollbar
      v-if="!disableScrollbar"
      :direction="
        horizontal ? ScrollbarDirection.HORIZONTAL : ScrollbarDirection.VERTICAL
      "
      :clientSize="virtualListState.clientSize"
      :listSize="
        virtualListState.listTotalSize +
        virtualListState.headerSize +
        virtualListState.footerSize
      "
      :scrollFrom="
        virtualListState.offset /
        (virtualListState.listTotalSize +
          virtualListState.headerSize +
          virtualListState.footerSize -
          virtualListState.clientSize)
      "
      :onScroll="onScrollBarScroll"
      :bgColor="scrollbarBgColor"
      :thumbClass="scrollbarThumbClass"
      :trickerClass="scrollbarTrickerClass"
      :thumbStyle="scrollbarThumbStyle"
      :trickerStyle="scrollbarTrickerStyle"
    ></Scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ScrollbarDirection } from 'virtual-list-core';
import ObserverItem from './ObserverItem.vue';
import Scrollbar from './Scrollbar.vue';
import { useVirtualList } from '../hooks/useVirtualList';
import type { IVirtualListProps, VirtualListEmitEvents } from '../types';

const props = withDefaults(
  defineProps<IVirtualListProps<Record<string, any>>>(),
  {
    itemKey: 'id',
  },
);
const emits = defineEmits<{
  (e: VirtualListEmitEvents.SCROLL, offset: number): void;
  (
    e: VirtualListEmitEvents.SCROLL_TO_TOP,
    firstItem: Record<string, any>,
  ): void;
  (
    e: VirtualListEmitEvents.SCROLL_TO_BOTTOM,
    lastItem: Record<string, any>,
  ): void;
}>();

const {
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
} = useVirtualList(props, emits);

defineExpose<{
  scrollToIndex: (index: number) => void;
  scrollToOffset: (offset: number) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
  scrollIntoView: (index: number) => void;
  virtualListIns: typeof virtualListIns;
}>({
  scrollToIndex,
  scrollToOffset,
  scrollToTop,
  scrollIntoView,
  scrollToBottom,
  virtualListIns,
});
</script>

<style scoped>
.virtual-list__client {
  width: 100%;
  height: 100%;
  position: relative;
}
.list-body__container {
  height: 100%;
  width: 100%;
  overflow: auto hidden;
}
.virtual-list-body {
  will-change: transform;
}
.virtual-list__sticky-header {
  position: sticky;
  top: 0;
  z-index: 2;
}
.virtual-list__sticky-footer {
  position: sticky;
  bottom: 0;
  z-index: 2;
}
</style>
