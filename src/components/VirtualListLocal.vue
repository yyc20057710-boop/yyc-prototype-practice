<script setup>
import { computed, onMounted, ref } from "vue";

const rowHeight = 48;
const viewportHeight = 520;
const overscan = 8;
const cursor = ref(0);
const loading = ref(false);
const hasMore = ref(true);
const items = ref([]);
const scrollTop = ref(0);
const scrollerRef = ref(null);

async function loadMore() {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  await new Promise((r) => setTimeout(r, 0));
  const batch = Array.from({ length: 60 }, (_, i) => {
    const id = cursor.value + i + 1;
    return {
      id,
      title: `第 ${id} 条数据`,
      createdAt: Date.now() - id * 5000,
    };
  });
  items.value.push(...batch);
  cursor.value += batch.length;
  hasMore.value = cursor.value < 1200;
  loading.value = false;
}

const totalHeight = computed(() => items.value.length * rowHeight);
const start = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / rowHeight) - overscan),
);
const end = computed(() =>
  Math.min(
    items.value.length,
    Math.ceil((scrollTop.value + viewportHeight) / rowHeight) + overscan,
  ),
);
const visibleItems = computed(() => items.value.slice(start.value, end.value));
const offsetY = computed(() => start.value * rowHeight);

function onScroll() {
  const el = scrollerRef.value;
  if (!el) return;
  scrollTop.value = el.scrollTop;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - rowHeight * 10) {
    loadMore();
  }
}

onMounted(() => {
  loadMore();
});
</script>

<template>
  <div class="box">
    <div ref="scrollerRef" class="scroller" @scroll="onScroll">
      <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
        <div :style="{ transform: `translateY(${offsetY}px)` }">
          <div v-for="item in visibleItems" :key="item.id" class="row">
            <span>#{{ item.id }}</span>
            <span>{{ item.title }}</span>
            <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
    <p class="tip">{{ loading ? "加载中..." : `已加载 ${items.length} 条` }}</p>
  </div>
</template>

<style scoped>
.box {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
}
.scroller {
  height: 520px;
  overflow: auto;
  border: 1px solid #eee;
}
.row {
  height: 48px;
  display: grid;
  grid-template-columns: 80px 1fr 220px;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid #f2f2f2;
}
.tip {
  color: #666;
  font-size: 13px;
  margin: 8px 0 0;
}
</style>
