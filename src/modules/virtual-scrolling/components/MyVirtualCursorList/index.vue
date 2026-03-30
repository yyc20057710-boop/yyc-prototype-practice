<script setup>
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import useVirtualComputed from "./composable";

const items = ref([]);
const ITEM_HEIGHT = 52;
const PAGE_SIZE = 50;
const LOAD_THRESHOLD_ITEMS = 15;
const scollRef = ref(null);
let nextCursor = null;
const hasMore = ref(true);
const loading = ref(false);
const error = ref(null);

const rowVirtualizer = useVirtualComputed(
  computed(() => ({
    count: items.value.length,
    getScrollElement: () => scollRef.value,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 12,
    getItemKey: (index) => items.value[index]?.id ?? index,
    onChange: (instance) => {
      scheduleLoadCheck(instance);
    },
  })),
);

let loadCheckRaf = 0;
function scheduleLoadCheck(instance) {
  if (loadCheckRaf) cancelAnimationFrame(loadCheckRaf);
  loadCheckRaf = requestAnimationFrame(() => {
    loadCheckRaf = 0;
    const range = instance.range;
    const total = items.value.length;
    if (!range || total === 0) return;
    const triggerIndex = Math.max(0, total - LOAD_THRESHOLD_ITEMS);
    if (range.endIndex >= triggerIndex && hasMore.value && !loading.value)
      loadMore();
  });
}

async function loadMore() {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  error.value = null;
  const params = { limit: PAGE_SIZE };
  if (nextCursor) params.cursor = Number(nextCursor);
  try {
    const res = await axios.get("/api/items", { params });
    const data = res?.data || {};
    items.value.push(...(Array.isArray(data.items) ? data.items : []));
    nextCursor = data.nextCursor;
    hasMore.value = Boolean(data.hasMore);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "加载失败";
  } finally {
    loading.value = false;
  }
}

function formatTime(time) {
  try {
    return new Date(time).toLocaleString();
  } catch {
    return String(time);
  }
}

onMounted(() => {
  loadMore();
});
</script>

<template>
  <div class="panel">
    <header class="header"><h1>自己实现的virtual</h1></header>
    <div ref="scollRef" class="scroll">
      <div
        :style="{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }"
      >
        <div
          v-for="v in rowVirtualizer.getVirtualItems()"
          :key="v.key"
          class="row"
          :style="{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${v.size}px`,
            transform: `translateY(${v.start}px)`,
          }"
        >
          <template v-if="items[v.index]">
            <span class="id">#{{ items[v.index].id }}</span>
            <span class="title">{{ items[v.index].title }}</span>
            <span class="meta">{{ formatTime(items[v.index].createdAt) }}</span>
          </template>
        </div>
      </div>
    </div>
    <footer class="footer">
      <span v-if="loading" class="status">加载中…</span>
      <span v-else-if="!hasMore && items.length > 0" class="status muted"
        >已加载全部</span
      >
      <span v-else class="status muted">{{
        error || `已加载 ${items.length} 条`
      }}</span>
    </footer>
  </div>
</template>

<style scoped>
.panel {
  max-width: 720px;
  min-width: 560px;
  margin: 0 auto;
  padding: 1.25rem;
  font-family: system-ui, sans-serif;
}
.header h1 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}
.scroll {
  height: 560px;
  overflow: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}
.row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
}
.id {
  flex: 0 0 4.5rem;
  color: #888;
  font-variant-numeric: tabular-nums;
}
.title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta {
  flex: 0 0 auto;
  color: #666;
  font-size: 0.8rem;
}
.footer {
  margin-top: 0.75rem;
  min-height: 1.5rem;
  font-size: 0.85rem;
}
.status.muted {
  color: #777;
}
</style>
