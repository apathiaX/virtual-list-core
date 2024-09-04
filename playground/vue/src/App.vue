<script setup lang="ts">
import HelloWorld from './components/Main.vue';
</script>

<template>
  <div class="main-container">
    <HelloWorld />
  </div>
</template>

<style scoped>
.main-container {
  border: 1px solid #ccc;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
