<script setup>
import "@/modules/virtual-scrolling/mock";
import VirtualCursorList from "@/modules/virtual-scrolling/components/VirtualCursorList.vue";
import MyVirtualCursorList from "@/modules/virtual-scrolling/components/MyVirtualCursorList/index.vue";
</script>

<template>
  <section class="wrap">
    <div class="grid">
      <VirtualCursorList />
      <MyVirtualCursorList />
    </div>
  </section>
</template>

<style scoped>
.wrap {
  width: 100%;
}
.grid {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  overflow-x: auto;
}
</style>
