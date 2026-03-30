<script setup>
import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
// 安全替换
import DOMPurify from "dompurify";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
const mode = "default";
const variableDialogVisible = ref(false);
const previewFullscreenVisible = ref(false);
const variableList = [
  { key: "name", label: "姓名", token: "{{name}}" },
  { key: "phone", label: "手机号", token: "{{phone}}" },
  { key: "company", label: "公司名称", token: "{{company}}" },
  { key: "position", label: "职位", token: "{{position}}" },
  { key: "date", label: "日期", token: "{{date}}" },
];
const defaultVariable = {
  name: "姚宇宸",
  phone: 13300000000,
  company: "广州商学院",
  position: "学生",
  date: "2025.5.10",
};
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref("<p>我叫姚宇宸</p>");
const safeHtml = ref(DOMPurify.sanitize(valueHtml.value));

const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };
watch(valueHtml, () => {
  const safe = DOMPurify.sanitize(valueHtml.value);
  const result = safe.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    return defaultVariable[key.trim()] || "***异常属性-请定位删除***";
  });
  safeHtml.value = result;
});
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const handleInsertVariable = (item) => {
  const editor = editorRef.value;
  if (!editor) return;
  editor.focus();
  editor.insertText(item.token);
  variableDialogVisible.value = false;
};
</script>

<template>
  <el-container class="page-wrap">
    <el-main class="page-main">
      <el-row :gutter="15">
        <el-col :xs="24" :lg="14">
          <el-card shadow="never" class="panel-card">
            <template #header>
              <div class="page-header">
                <div class="header-left">
                  <h2 class="page-title">变量富文本编辑</h2>
                </div>
                <el-button type="primary" @click="variableDialogVisible = true"
                  >插入变量</el-button
                >
              </div>
            </template>

            <div class="toolbar-placeholder">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
            </div>
            <div class="editor-placeholder">
              <Editor
                style="width: 100%"
                v-model="valueHtml"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleCreated"
              />
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :lg="10">
          <el-card shadow="never" class="panel-card">
            <template #header>
              <div class="card-header">
                <span>导出预览区域</span>
                <el-button
                  link
                  type="primary"
                  @click="previewFullscreenVisible = true"
                  >实际预览</el-button
                >
              </div>
            </template>
            <div class="preview-placeholder">
              <!-- <p>这里将展示最终导出效果（样式化内容预览）。</p>
              <p>变量会使用默认填充</p> -->
              <div v-html="safeHtml" class="content"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>

  <el-dialog
    v-model="variableDialogVisible"
    title="变量列表"
    width="460px"
    append-to-body
  >
    <div class="variable-list">
      <el-tag
        v-for="item in variableList"
        :key="item.key"
        effect="plain"
        class="var-tag"
        @click="handleInsertVariable(item)"
      >
        {{ item.label }}
      </el-tag>
    </div>
    <template #footer>
      <el-button @click="variableDialogVisible = false">关闭</el-button>
      <el-button type="primary" disabled>点击变量即可插入</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="previewFullscreenVisible"
    title="导出预览（全屏）"
    fullscreen
    append-to-body
  >
    <div
      class="preview-placeholder fullscreen-preview a4-paper-preview-placeholder"
    >
      <div class="a4-paper">
        <div v-html="safeHtml"></div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.page-wrap {
  /* background: #f5f7fa; */
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.page-subtitle {
  font-size: 13px;
  color: #909399;
}

.page-main {
  padding: 0;
  gap: 10px;
  overflow: hidden;
}

.panel-card {
  min-height: 520px;
  height: 100%;
}

.toolbar-placeholder {
  margin-bottom: 12px;
  padding: 10px 12px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  background: #fafafa;
}

.editor-placeholder {
  height: 420px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.preview-placeholder {
  min-height: 464px;
  max-height: 65vh;
  padding: 12px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
}

/* 防止 v-html 内容无限撑高：普通预览区域限制最大高度 */
.preview-placeholder .content {
  max-height: 80%;
  overflow-y: auto;
  overflow-x: hidden;
  word-break: break-word;
}
.a4-paper-preview-placeholder {
  background: #f0f2f5;
  display: flex;
  justify-content: center;
  overflow: auto;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fullscreen-preview {
  min-height: calc(100vh - 140px);
  align-items: flex-start;
  padding: 20px;
}

.a4-paper {
  width: 100%;
  max-width: 420px;
  aspect-ratio: 210 / 297;
  background: #fff;
  color: #303133;
  border: 1px solid #dcdfe6;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  padding: 24px 22px;
  box-sizing: border-box;
  line-height: 1.8;
}

.fullscreen-preview .a4-paper {
  max-width: 794px;
  /* min-height: 1123px; */
}

/* 防止全屏预览内容把页面撑爆：A4 纸内滚动 */
.fullscreen-preview .a4-paper {
  /* max-height: calc(100vh - 200px); */
  /* overflow-y: auto; */
  /* overflow-x: hidden; */
}

.variable-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.var-tag {
  cursor: pointer;
}
</style>
