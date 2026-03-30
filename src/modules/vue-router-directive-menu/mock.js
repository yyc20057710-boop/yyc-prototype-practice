import { mock } from "mockjs";

const createResponse = () => ({
  code: 200,
  msg: "操作成功",
  data: null,
});

mock("/sys/menu/nav", "get", () => {
  const response = createResponse();
  response.data = {
    nav: [
      {
        title: "系统管理",
        name: "SysManager",
        icon: "el-icon-s-operation",
        component: "",
        path: "",
        children: [
          {
            name: "SysUser",
            title: "用户管理",
            icon: "el-icon-s-custom",
            path: "/projects/vue-router/sys/users",
            component: "sys/User",
            children: [],
          },
          {
            name: "SysRole",
            title: "角色管理",
            icon: "el-icon-rank",
            path: "/projects/vue-router/sys/roles",
            component: "sys/Role",
            children: [],
          },
          {
            name: "SysMenu",
            title: "菜单管理",
            icon: "el-icon-menu",
            path: "/projects/vue-router/sys/menus",
            component: "sys/Menu",
            children: [],
          },
        ],
      },
      {
        name: "SysTools",
        title: "系统工具",
        icon: "el-icon-location",
        path: "",
        component: "",
        children: [
          {
            name: "SysDict",
            title: "数字字典",
            icon: "el-icon-s-order",
            path: "/projects/vue-router/sys/dicts",
            component: "sys/Dict",
            children: [],
          },
        ],
      },
    ],
    authoritys: ["sys:user:save", "sys:user:list", "sys:user:delete"],
  };
  return response;
});
