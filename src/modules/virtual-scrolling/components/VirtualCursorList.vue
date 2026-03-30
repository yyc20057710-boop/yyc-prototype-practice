<script setup>
import axios from "axios";
import CursorVirtualList from "./CursorVirtualList.vue";

async function loadPage({ cursor, limit }) {
  const params = { limit: Number(limit) };
  if (cursor != null && cursor !== "") {
    params.cursor = Number(cursor);
  }
  const res = await axios.get("/api/items", { params });
  const data = res?.data || {};
  return {
    items: Array.isArray(data.items) ? data.items : [],
    nextCursor: data.nextCursor,
    hasMore: data.hasMore,
  };
}

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}
</script>

<template>
  <div class="panel">
    <CursorVirtualList :load-page="loadPage">
      <template #header>
        <h1>tanstack virtual（CursorVirtualList）</h1>
      </template>
      <template #default="{ item }">
        <div v-if="item" class="row">
          <span class="id">#{{ item.id }}</span>
          <span class="title">{{ item.title }}</span>
          <span class="meta">{{ formatTime(item.createdAt) }}</span>
        </div>
      </template>
    </CursorVirtualList>
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
.row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
  height: 100%;
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
</style>
