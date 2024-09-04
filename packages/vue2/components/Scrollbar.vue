<template>
  <div
    :class="`scrollbar-container ${trickerClass}`"
    :style="trickerStyle"
    ref="trickRef"
  >
    <div
      :class="`scrollbar-item ${thumbClass}`"
      :style="thumbStyle"
      ref="thumbRef"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  Scrollbar,
  ScrollbarEvent,
  type ScrollbarDirection,
} from 'virtual-list-core';

export default Vue.extend({
  name: 'Scrollbar',
  props: {
    direction: {
      type: String as PropType<ScrollbarDirection>,
      required: true,
    },
    listSize: {
      type: Number,
      required: true,
    },
    clientSize: {
      type: Number,
      required: true,
    },
    scrollFrom: {
      type: Number,
      required: true,
    },
    bgColor: {
      type: String,
    },
    thumbClass: {
      type: String,
    },
    trickerClass: {
      type: String,
    },
    thumbStyle: {
      type: Object,
    },
    trickerStyle: {
      type: Object,
    },
  },
  data(): {
    scrollbarIns: Scrollbar | null;
  } {
    return {
      scrollbarIns: null,
    };
  },
  watch: {
    clientSize: function (nv: number) {
      this.scrollbarIns?.updateClientSize(nv);
    },
    listSize: function (nv: number) {
      this.scrollbarIns?.updateListSize(nv);
    },
    scrollFrom: function (nv: number) {
      this.scrollbarIns?.updateScrollFrom(nv);
    },
  },
  mounted() {
    this.scrollbarIns = new Scrollbar(
      {
        thumbEl: this.$refs.thumbRef as HTMLElement,
        trickerEl: this.$refs.trickRef as HTMLElement,
        direction: this.direction,
        clientSize: this.clientSize,
        listSize: this.listSize,
        scrollFrom: this.scrollFrom,
        bgColor: this.bgColor,
        thumbClass: this.thumbClass,
        trickerClass: this.trickerClass,
        thumbStyle: this.thumbStyle,
        trickerStyle: this.trickerStyle,
      },
      {
        [ScrollbarEvent.SCROLL]: (offsetRatio: number) =>
          this.$emit('scroll', offsetRatio),
      },
    );
  },
  beforeDestroy() {
    if (this.scrollbarIns) {
      this.scrollbarIns.destroy();
    }
  },
});
</script>
<style scoped>
.scrollbar-container .scrollbar-item {
  position: absolute;
  border-radius: 5px;
  z-index: 11;
  opacity: 0.3;
}
.scrollbar-container .scrollbar-item:hover {
  opacity: 0.5;
  cursor: pointer;
}
</style>
