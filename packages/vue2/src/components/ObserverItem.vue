<template>
  <div ref="itemRefEl" :data-id="id">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'ObserverItem',
  props: {
    id: {
      type: String,
      required: true,
    },
    resizeObserver: {
      type: ResizeObserver,
    },
  },
  mounted() {
    if (this.resizeObserver && this.$refs.itemRefEl) {
      this.resizeObserver.observe(this.$refs.itemRefEl as HTMLElement);
    }
  },
  beforeDestroy() {
    if (this.resizeObserver && this.$refs.itemRefEl) {
      this.resizeObserver.unobserve(this.$refs.itemRefEl as HTMLElement);
    }
  },
});
</script>
