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

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  Scrollbar,
  ScrollbarEvent,
  type ScrollbarDirection,
} from 'virtual-list-core';

const props = defineProps<{
  direction: ScrollbarDirection;
  clientSize: number;
  listSize: number;
  scrollFrom: number;
  bgColor?: string;
  thumbClass?: string;
  trickerClass?: string;
  thumbStyle?: Record<string, string | number>;
  trickerStyle?: Record<string, string | number>;
}>();

const emits = defineEmits<{
  (e: 'scroll', offsetRa: number): void;
}>();

const scrollbarIns = ref<Scrollbar | null>(null);

const thumbRef = ref<HTMLElement | null>(null);
const trickRef = ref<HTMLElement | null>(null);

watch(
  () => props.clientSize,
  (newSize) => {
    scrollbarIns.value?.updateClientSize(newSize);
  },
);

watch(
  () => props.listSize,
  (newSize) => {
    scrollbarIns.value?.updateListSize(newSize);
  },
);

watch(
  () => props.scrollFrom,
  (newSize) => {
    scrollbarIns.value?.updateScrollFrom(newSize);
  },
);

onMounted(() => {
  scrollbarIns.value = new Scrollbar(
    {
      thumbEl: thumbRef.value!,
      trickerEl: trickRef.value!,
      direction: props.direction,
      clientSize: props.clientSize,
      listSize: props.clientSize,
      scrollFrom: props.scrollFrom,
      bgColor: props.bgColor,
      thumbClass: props.thumbClass,
      trickerClass: props.trickerClass,
      thumbStyle: props.thumbStyle,
      trickerStyle: props.trickerStyle,
    },
    {
      [ScrollbarEvent.SCROLL]: (offsetRatio: number) =>
        emits('scroll', offsetRatio),
    },
  );
});

onBeforeUnmount(() => {
  if (scrollbarIns.value) {
    scrollbarIns.value.destroy();
  }
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
