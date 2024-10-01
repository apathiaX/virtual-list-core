<template>
  <div class="virtual-list__client" ref="clientRefEl" data-id="client">
    <div class="list-body__container">
      <div
        v-if="$slots.stickyHeader"
        ref="stickyHeaderRefEl"
        :class="`virtual-list__sticky-header ${stickyHeaderClass}`"
        :style="stickyHeaderStyle"
        :data-id="'stickyHeader'"
      >
        <slot name="stickyHeader"></slot>
      </div>
      <div class="list-body" ref="listRefEl">
        <div
          v-if="$slots.header"
          ref="headerRefEl"
          :class="headerClass"
          :style="headerStyle"
          :data-id="'header'"
        >
          <slot name="header"></slot>
        </div>
        <div class="list-body__content">
          <ObserverItem
            v-for="(item, index) in renderList"
            :key="item.id"
            :id="item.id"
            :resizeObserver="resizeObserver"
          >
            <template #default>
              <slot :data="item" :index="renderBegin + index"></slot>
            </template>
          </ObserverItem>
        </div>
        <div
          v-if="$slots.footer"
          ref="footerRefEl"
          :class="footerClass"
          :style="footerStyle"
          :data-id="'footer'"
        >
          <slot name="footer"></slot>
        </div>
      </div>
      <div
        v-if="$slots.stickyFooter"
        ref="stickyFooterRefEl"
        :class="`virtual-list__sticky-footer ${stickyFooterClass}`"
        :style="stickyFooterStyle"
        :data-id="'stickyFooter'"
      >
        <slot name="stickyFooter"></slot>
      </div>
    </div>
    <slot name="scrollbar">
      <Scrollbar
        :direction="
          horizontal
            ? ScrollbarDirection.HORIZONTAL
            : ScrollbarDirection.VERTICAL
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
        @scroll="onScrollBarScroll"
      ></Scrollbar>
    </slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Scrollbar from './Scrollbar.vue';
import ObserverItem from './ObserverItem.vue';
import {
  BaseVirtualList,
  VirtualListEvent,
  ScrollbarDirection,
} from 'virtual-list-core';
export default Vue.extend({
  name: 'VirtualList',
  components: {
    ObserverItem,
    Scrollbar,
  },
  props: {
    list: {
      type: Array<any>,
      default: () => [],
    },
    itemKey: {
      type: [String, Number],
      required: true,
    },
    minSize: {
      type: Number,
      default: 20,
      required: true,
    },
    renderControl: {
      type: Function,
      default: undefined,
    },
    fixed: {
      type: Boolean,
      default: false,
    },
    buffer: {
      type: Number,
      default: 0,
    },
    bufferTop: {
      type: Number,
      default: 0,
    },
    bufferBottom: {
      type: Number,
      default: 0,
    },
    // 滚动距离阈值
    scrollDistance: {
      type: Number,
      default: 0,
    },
    // 是否为水平移动
    horizontal: {
      type: Boolean,
      default: false,
    },
    // 起始下标
    start: {
      type: Number,
      default: 0,
    },
    // 起始偏移量
    offset: {
      type: Number,
      default: 0,
    },
    listStyle: {
      type: String,
      default: '',
    },
    listClass: {
      type: String,
      default: '',
    },
    itemStyle: {
      type: String,
      default: '',
    },
    itemClass: {
      type: String,
      default: '',
    },
    headerClass: {
      type: String,
      default: '',
    },
    headerStyle: {
      type: String,
      default: '',
    },
    footerClass: {
      type: String,
      default: '',
    },
    footerStyle: {
      type: String,
      default: '',
    },
    stickyHeaderClass: {
      type: String,
      default: '',
    },
    stickyHeaderStyle: {
      type: String,
      default: '',
    },
    stickyFooterClass: {
      type: String,
      default: '',
    },
    stickyFooterStyle: {
      type: String,
      default: '',
    },
  },
  data(): {
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
  } {
    return {
      virtualListIns: null,
      renderList: [],
      virtualListState: {
        headerSize: 0,
        footerSize: 0,
        stickyHeaderSize: 0,
        stickyFooterSize: 0,
        clientSize: 0,
        listTotalSize: 0,
        offset: 0,
      },
      ScrollbarDirection,
    };
  },
  methods: {
    onRenderListChange(renderRange: {
      renderBegin: number;
      renderEnd: number;
    }) {
      this.$data.renderList = this.$props.list.slice(
        renderRange.renderBegin,
        renderRange.renderEnd + 1,
      );
    },
    onScrollBarScroll(ratio: number) {
      const targetOffset =
        ratio *
        (this.virtualListIns!.listTotalSize - this.virtualListState.clientSize);

      this.virtualListIns?.scrollWithDelta(
        targetOffset - this.virtualListState.offset,
      );
    },
  },
  computed: {
    listLength(): number {
      return this.$props.list.length;
    },
    renderBegin(): number {
      return this.$data.virtualListIns!.listState.renderBegin;
    },
    resizeObserver(): ResizeObserver {
      return this.$data.virtualListIns?.resizeObserver;
    },
  },
  watch: {
    listLength: function () {
      if (!this.$refs.clientRefEl) return;
      this.$data.virtualListIns?.destroy();
      this.$data.virtualListIns = new BaseVirtualList(
        {
          clientEl: this.$refs.clientRefEl as HTMLElement,
          bodyEl: this.$refs.listRefEl as HTMLElement,
          list: this.$props.list,
          fixed: this.$props.fixed,
          itemKey: this.$props.itemKey,
          minSize: this.$props.minSize,
          buffer: this.$props.buffer,
          bufferTop: this.$props.bufferTop,
          bufferBottom: this.$props.bufferBottom,
          horizontal: this.$props.horizontal,
          renderControl: this.$props.renderControl,
        },
        {
          [VirtualListEvent.RENDER_LIST_CHANGE]: this.onRenderListChange,
          [VirtualListEvent.SCROLL_TO_TOP]: (firstItem: any) => {
            this.$emit('scrollToTop', firstItem);
          },
          [VirtualListEvent.SCROLL_TO_BOTTOM]: (lastItem: any) => {
            this.$emit('scrollToBottom', lastItem);
          },
          [VirtualListEvent.SCROLL]: (offset: number) => {
            this.virtualListState.offset = offset;
            this.$emit('scroll', offset);
          },
          [VirtualListEvent.SIZE_CHANGE]: () => {
            if (!this.$data.virtualListIns) return;
            const {
              headerSize,
              footerSize,
              stickyHeaderSize,
              stickyFooterSize,
              clientSize,
            } = this.$data.virtualListIns.childrenSize;

            this.$data.virtualListState.headerSize = headerSize;
            this.$data.virtualListState.footerSize = footerSize;
            this.$data.virtualListState.stickyHeaderSize = stickyHeaderSize;
            this.$data.virtualListState.stickyFooterSize = stickyFooterSize;
            this.$data.virtualListState.clientSize = clientSize;

            this.$data.virtualListState.listTotalSize =
              this.$data.virtualListIns.listState.listTotalSize;

            this.$data.virtualListState.offset =
              this.$data.virtualListIns.listState.offset;
          },
        },
      );
      if (this.$refs.headerRefEl) {
        this.virtualListIns?.observerEl(this.$refs.headerRefEl as HTMLElement);
      }
      if (this.$refs.footerRefEl) {
        this.virtualListIns?.observerEl(this.$refs.footerRefEl as HTMLElement);
      }
      if (this.$refs.stickyHeaderRefEl) {
        this.virtualListIns?.observerEl(
          this.$refs.stickyHeaderRefEl as HTMLElement,
        );
      }
      if (this.$refs.stickyFooterRefEl) {
        this.virtualListIns?.observerEl(
          this.$refs.stickyFooterRefEl as HTMLElement,
        );
      }
    },
  },
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
.list-body {
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
