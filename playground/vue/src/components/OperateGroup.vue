<template>
  <div class="operate-wrap">
    <div class="operate">
      <div class="operate-item">
        <button class="demo-btn" @click="goScrollOffset">scrollTo(px)</button>
        <input class="demo-input" type="number" v-model="scrollToOffset" />
      </div>
      <div class="operate-item">
        <button class="demo-btn" @click="goScrollIndex">scrollTo(index)</button>
        <input class="demo-input" type="number" v-model="scrollToIndex" />
      </div>
      <div class="operate-item">
        <button class="demo-btn" @click="goScrollIntoView">show(index)</button>
        <input class="demo-input" type="number" v-model="scrollIntoViewIndex" />
        <button class="demo-btn" @click="goScrollIntoViewPrev">prev</button>
        <button class="demo-btn" @click="goScrollIntoViewNext">next</button>
      </div>
      <div class="operate-item">
        <button class="demo-btn" @click="goScrollTop">toTop</button>
      </div>
      <div class="operate-item">
        <button class="demo-btn" @click="goScrollBottom">toBottom</button>
      </div>
      <div class="operate-item">
        <button class="demo-btn" @click="toggleShow">visible/hidden</button>
      </div>
      <!-- <div class="operate-item">
        <button class="demo-btn" @click="renderIt">渲染/卸载</button>
      </div> -->
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { VirtualListIns } from 'virtual-list-vue';
import { ref } from 'vue';

const props = defineProps<{
  virtListRef: VirtualListIns | null;
  length: number;
  visible?: boolean;
}>();

const emit = defineEmits(['toggleShow']);

const scrollToIndex = ref(10);
const scrollToOffset = ref(200);
const scrollIntoViewIndex = ref(20);

async function goScrollIndex() {
  props.virtListRef?.scrollToIndex(scrollToIndex.value);
}
function goScrollOffset() {
  props.virtListRef?.scrollToOffset(scrollToOffset.value);
}
async function goScrollIntoView() {
  props.virtListRef?.scrollIntoView(scrollIntoViewIndex.value);
}
function goScrollIntoViewPrev() {
  const t = Number(scrollIntoViewIndex.value);
  scrollIntoViewIndex.value = t - 1;
  goScrollIntoView();
}
function goScrollIntoViewNext() {
  const t = Number(scrollIntoViewIndex.value);
  scrollIntoViewIndex.value = t + 1;
  goScrollIntoView();
}
async function goScrollTop() {
  await props.virtListRef?.scrollToTop();
}
async function goScrollBottom() {
  await props.virtListRef?.scrollToBottom();
}
function toggleShow() {
  emit('toggleShow');
}
// function renderIt() {
//   console.log('renderIt');
// }
</script>
<style scoped>
.operate-wrap {
  padding: 10px 0;
}
.operate {
  display: flex;
  flex-wrap: wrap;
}
.operate-item {
  user-select: none;
  display: flex;
  margin-right: 20px;
  margin-bottom: 10px;
  gap: 2px;
}
.demo-btn {
  padding: 4px 12px;
  cursor: pointer;
  border: 1px solid #ececec;
  border-radius: 4px;
  font-size: 14px;
  &:hover {
    background-color: #ececec;
  }
}
.demo-input {
  width: 60px;
  height: 100%;
  border: 1px solid #ececec;
  border-radius: 4px;
  padding: 0 8px;
}
</style>
