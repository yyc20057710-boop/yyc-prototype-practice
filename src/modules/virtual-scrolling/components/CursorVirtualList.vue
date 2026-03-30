<script setup>
import { computed, onMounted, ref, useSlots } from "vue";
import { useVirtualizer } from "@tanstack/vue-virtual";

const props = defineProps({
  loadPage: { type: Function, required: true },
  getItemKey: { type: Function, default: null },
  itemHeight: { type: Number, default: 52 },
  pageSize: { type: Number, default: 50 },
  loadThresholdItems: { type: Number, default: 15 },
  overscan: { type: Number, default: 12 },
  scrollHeight: { type: String, default: "560px" },
  autoLoad: { type: Boolean, default: true },
});

const emit = defineEmits(["load-error"]);
const slots = useSlots();
const parentRef = ref(null);
const items = ref([]);
const nextCursor = ref(null);
const hasMore = ref(true);
const loading = ref(false);
const error = ref(null);
let loadCheckRaf = 0;

function scheduleLoadCheck(instance) {
  if (loadCheckRaf) cancelAnimationFrame(loadCheckRaf);
  loadCheckRaf = requestAnimationFrame(() => {
    loadCheckRaf = 0;
    const range = instance.range;
    const total = items.value.length;
    if (!range || total === 0) return;
    const triggerIndex = Math.max(0, total - props.loadThresholdItems);
    if (range.endIndex >= triggerIndex && hasMore.value && !loading.value)
      loadMore();
  });
}

async function loadMore() {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  error.value = null;
  try {
    const page = await props.loadPage({
      cursor: nextCursor.value,
      limit: props.pageSize,
    });
    const pageItems = Array.isArray(page?.items) ? page.items : [];
    items.value.push(...pageItems);
    nextCursor.value = page?.nextCursor ?? null;
    hasMore.value = Boolean(page?.hasMore);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "加载失败";
    emit("load-error", e);
  } finally {
    loading.value = false;
  }
}

function retry() {
  error.value = null;
  loadMore();
}

const rowVirtualizer = useVirtualizer(
  computed(() => ({
    count: items.value.length,
    getScrollElement: () => parentRef.value,
    estimateSize: () => props.itemHeight,
    overscan: props.overscan,
    getItemKey: (index) => {
      const item = items.value[index];
      if (props.getItemKey && item != null) return props.getItemKey(item);
      return item?.id ?? index;
    },
    onChange: (instance) => scheduleLoadCheck(instance),
  })),
);

onMounted(() => {
  if (props.autoLoad) loadMore();
});
</script>

<template>
  <div class="vl-root">
    <div v-if="slots.header" class="vl-header"><slot name="header" /></div>
    <div v-if="error && items.length === 0" class="vl-error-banner">
      {{ error }}
      <button type="button" class="vl-btn" @click="retry">重试</button>
    </div>
    <div
      ref="parentRef"
      class="vl-scroll"
      :style="{ height: scrollHeight }"
      tabindex="0"
    >
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
          class="vl-row"
          :style="{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${v.size}px`,
            transform: `translateY(${v.start}px)`,
          }"
        >
          <slot
            name="default"
            :item="items[v.index]"
            :index="v.index"
            :virtual-item="v"
          />
        </div>
      </div>
    </div>
    <div class="vl-footer">
      <span v-if="loading" class="vl-status">加载中…</span>
      <span
        v-else-if="error && items.length > 0"
        class="vl-status vl-status-error"
      >
        {{ error }}
        <button type="button" class="vl-btn vl-btn-link" @click="retry">
          重试
        </button>
      </span>
      <span
        v-else-if="!hasMore && items.length > 0"
        class="vl-status vl-status-muted"
        >已加载全部</span
      >
      <span v-else class="vl-status vl-status-muted"
        >已加载 {{ items.length }} 条</span
      >
    </div>
  </div>
</template>

<style scoped>
.vl-root {
  font-family: system-ui, sans-serif;
}
.vl-header :deep(h1) {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}
.vl-scroll {
  overflow: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}
.vl-row {
  box-sizing: border-box;
}
.vl-footer {
  margin-top: 0.75rem;
  min-height: 1.5rem;
  font-size: 0.85rem;
}
.vl-status-muted {
  color: #777;
}
.vl-error-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  margin-bottom: 0.75rem;
  background: #ffe8e8;
  border-radius: 6px;
  color: #8b0000;
}
.vl-status-error {
  color: #b00020;
}
.vl-btn {
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.25rem 0.65rem;
  background: #fff;
  font-size: 0.85rem;
}
.vl-btn-link {
  border: none;
  padding: 0;
  margin-left: 0.35rem;
  background: none;
  color: #06c;
  text-decoration: underline;
}
</style>
