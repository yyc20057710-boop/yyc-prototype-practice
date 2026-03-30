# yyc-prototype-practice

这是本人在 **动手做业务功能之前**，把各能力点拆成的 **具体最小实现**：先跑通最短链路，再按需叠加复杂度。

本仓库是一个 **Vue 3 + Vite** 的聚合原型：多个场景以路由页面并列，便于本地对照代码与效果。

**后续计划**：使用 [**Vue Flow**](https://vueflow.dev/) 与 [**Vue Draggable Plus**](https://github.com/Alfred-Skyblue/vue-draggable-plus) 补上一版 **最小可跑的审批流程 + 表单**（流程编排、拖拽与基础交互），仍保持「能看懂、能改」为优先。

## 包含内容

| 模块 | 说明 |
|------|------|
| 富文本 | wangEditor：变量占位、预览与安全处理等 |
| 路由与权限示意 | 动态菜单、`addRoute`、导航守卫、指令级权限（`v-per`）、Mock 数据 |
| ECharts | 饼图、雷达、柱状、折线等示例 |
| 虚拟滚动 | TanStack 方案与自研列表对照；本地 Mock 分页接口 |
| 壳层 | 顶栏汉堡菜单切换子项目路由，`Element Plus` 统一 UI |

## 技术栈

Vue 3、Vite、Vue Router、Pinia、Element Plus、ECharts、Axios、MockJS（以实际 `package.json` 为准）。

## 推荐开发环境

- [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 本地运行

```sh
npm install
npm run dev
```

```sh
npm run build
```

```sh
npm run preview
```

更多构建选项见 [Vite 配置说明](https://vite.dev/config/)。

## 说明

当前仓库中的 Mock 与演示数据只服务于最小实现验证；后续用于真实业务使用。
