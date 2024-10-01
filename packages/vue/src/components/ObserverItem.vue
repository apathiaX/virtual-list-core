<template>
  <div ref="itemRefEl" :data-id="id">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { type IObserverItemProps } from '../types';
import { useObserverItem } from '../hooks/useObserver';
const props = defineProps<IObserverItemProps>();

const { itemRefEl } = useObserverItem(props);
</script>
