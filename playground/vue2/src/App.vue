<template>
  <div class="demo-editable">
    <VirtualList :list="list" :itemKey="'id'" :minSize="40">
      <template #default="{ data, index }">
        <Item :itemData="data" :index="index" />
      </template>
    </VirtualList>
  </div>
</template>

<script lang="ts">
import { VirtualList } from 'virtual-list-vue2';
import Item from './Item.vue';
import { getList } from '../utils';
export default {
  name: 'App',
  components: {
    VirtualList,
    Item,
  },
  data(): {
    list: any[];
  } {
    return {
      list: [],
    };
  },
  mounted() {
    this.list = getList(1000);
  },
};
</script>
<style scoped>
.demo-editable {
  width: 100%;
  height: 500px;
  overflow: hidden;
  border: 1px solid #ccc;
}
</style>
