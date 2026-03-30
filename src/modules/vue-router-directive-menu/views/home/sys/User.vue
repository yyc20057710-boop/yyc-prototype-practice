<script setup>
import { computed, onMounted, ref } from "vue";
import usePerStore from "../../../stores/per";

const perStore = usePerStore();

const permissionOptions = [
  { label: "保存按钮", value: "sys:user:save" },
  { label: "添加按钮", value: "sys:user:add" },
  { label: "删除按钮", value: "sys:user:delete" },
  { label: "列表查询", value: "sys:user:list" },
];

const selectedPermissions = ref([]);
const renderTick = ref(0);

const permissionSummary = computed(() =>
  selectedPermissions.value.length > 0
    ? selectedPermissions.value.join(", ")
    : "无权限",
);

function syncPermissions() {
  perStore.setPerList(selectedPermissions.value);
  renderTick.value += 1;
}

onMounted(async () => {
  if (perStore.perList.length === 0) {
    await perStore.initPer();
  }
  selectedPermissions.value = [...perStore.perList];
  syncPermissions();
});
</script>

<template>
  <el-card :key="renderTick" shadow="never">
    <template #header>
      <div class="head">
        <span>用户管理</span>
        <el-tag type="info">权限指令演示</el-tag>
      </div>
    </template>
    <el-alert type="success" show-icon :closable="false" class="mb12">
      当前权限：{{ permissionSummary }}
    </el-alert>

    <el-card shadow="never" class="panel mb12">
      <template #header>权限开关</template>
      <el-checkbox-group
        v-model="selectedPermissions"
        @change="syncPermissions"
      >
        <el-checkbox
          v-for="item in permissionOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}（{{ item.value }}）
        </el-checkbox>
      </el-checkbox-group>
    </el-card>

    <el-card shadow="never" class="panel">
      <template #header>按钮可见性（v-per）</template>
      <el-space>
        <el-button v-per="'sys:user:save'" type="primary">保存</el-button>
        <el-button v-per="'sys:user:add'" type="success">添加</el-button>
        <el-button v-per="'sys:user:delete'" type="danger">删除</el-button>
        <el-button type="info" plain>查看</el-button>
      </el-space>
    </el-card>
  </el-card>
</template>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mb12 {
  margin-bottom: 12px;
}

.panel :deep(.el-card__body) {
  display: grid;
  gap: 8px;
}
</style>
