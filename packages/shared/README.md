# @ps/shared

共享的跨端领域定义包。

## 职责

- 提供 `web`、`admin`、`data-access`、`db` 可共享的 schema、类型和纯工具函数。
- 保持运行时中立，不依赖 Nuxt、Vue、Prisma 或 Node-only API。

## 当前入口

活跃域入口：

- `@ps/shared/article`
- `@ps/shared/auth`
- `@ps/shared/category`
- `@ps/shared/tag`
- `@ps/shared/pagination`

横切入口：

- `@ps/shared/api`
- `@ps/shared/utils`

## 根入口约束

`@ps/shared` 根入口只保留横切能力：

- API 包装相关能力
- 通用纯工具

不要再把文章、分类、标签、认证等领域对象重新加回根入口。

## 适合放入的内容

- Zod schema
- 可共享 DTO / 类型定义
- 与运行环境无关的纯函数
- 通用 API 响应类型

## 不适合放入的内容

- Vue 组件
- Nuxt composable
- Prisma 查询
- 数据库连接
- 依赖浏览器或 Node 专有运行时的逻辑

## 导入约束

- 优先按子路径导入具体领域，例如 `@ps/shared/article`
- 不要为图省事统一从 `@ps/shared` 根入口拿领域类型
- 新增领域时，优先增加独立子路径，而不是继续扩根入口
- 不要为未来预留而保留无消费者的 schema 或导出入口
