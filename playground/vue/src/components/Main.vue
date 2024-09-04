<template>
  <div class="main">
    <Operate :virtListRef="virtListRef" :length="list.length"></Operate>
    <div class="demo-editable">
      <VirtualList ref="virtListRef" :list="list" itemKey="id" :minSize="20">
        <template #stickyHeader>
          <div style="background-color: bisque; color: red">stickyHeader</div>
        </template>
        <template #header>
          <div style="background-color: rgb(15, 116, 210); color: red">
            header
          </div>
        </template>
        <template #default="{ data, index }">
          <Item :itemData="data" :index="index" />
        </template>
        <template #stickyFooter>
          <div style="background-color: bisque; color: red">stickyFooter</div>
        </template>
        <template #footer>
          <div style="background-color: rgb(11, 152, 72); color: red">
            footer
          </div>
        </template>
      </VirtualList>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { VirtualList, VirtualListIns } from 'virtual-list-vue';
import { getList } from '../utils';
import Item from './Item.vue';
import Operate from './OperateGroup.vue';

const list = ref<
  {
    index: number;
    id: string;
    text: string;
  }[]
>([]);

const virtListRef = ref<VirtualListIns | null>(null);

onMounted(() => {
  list.value = getList(1000);
});
</script>

<style scoped>
.demo-editable {
  width: 100%;
  height: 500px;
  background-color: var(--vp-sidebar-bg-color);
  overflow: hidden;
  border: 1px solid var(--vp-c-border);
}
</style>
