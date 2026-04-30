# @ps/web

公开访问的前台应用，部署到主域名。

## 职责

- 首页展示
- 文章列表
- 文章详情
- 分类页
- 关于页
- 公开文章 API

## 当前正式能力

- `/`
- `/articles`
- `/articles/[id]`
- `/categories`
- `/about`
- `GET /api/articles`
- `GET /api/articles/[id]`

文章详情页当前采用服务端 Markdown 渲染：

- 服务端使用 `markdown-it` + `shiki` 输出 HTML
- 客户端只负责展示和代码块复制/下载交互

## 不负责的内容

- 管理员登录
- 后台 CRUD 页面
- 客户端直接访问 `@ps/data-access`
- 项目展示和联系表单的正式产品面

## 目录约定

- `app/pages`：公开页面
- `app/components`：前台业务组件
- `app/composables`：前台请求与页面复用逻辑
- `app/plugins`：前台客户端增强逻辑
- `server/api`：公开 API
- `server/utils`：服务端工具，例如 Markdown 渲染和 API 包装

## 与 packages 的边界

- 类型、schema、纯工具优先放 `@ps/shared`
- 服务端数据访问统一走 `@ps/data-access`
- 双端复用的基础展示组件才放 `@ps/ui`
- 前台专属布局和阅读体验组件留在本 app

## 收敛规则

- 页面级结构不要提前抽进 `@ps/ui`
- 路由层不要堆 Prisma 查询
- 客户端组件不要直接依赖 `@ps/db` 或 `@ps/data-access`
