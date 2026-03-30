<script setup>
const props = defineProps(["name", "title", "path", "children"]);
</script>

<template>
  <el-sub-menu v-if="props.children.length > 0" :index="props.name">
    <template #title>{{ props.title }}</template>
    <ForItem
      v-for="item in props.children"
      :key="item.name"
      :name="item.name"
      :title="item.title"
      :path="item.path"
      :children="item.children"
    />
  </el-sub-menu>
  <el-menu-item v-else :index="props.path">
    {{ props.title }}
  </el-menu-item>
</template>