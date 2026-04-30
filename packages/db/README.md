# @ps/db

数据库基础设施包。

## 职责

- 维护 Prisma schema
- 提供 Prisma Client 导出
- 管理 migration 与 seed
- 放置数据库相关基础能力，例如密码哈希

## 适合放入的内容

- `schema.prisma`
- migration
- seed
- Prisma Client 初始化
- 数据库环境变量读取

## 不适合放入的内容

- 复杂业务查询
- 可复用业务写入逻辑
- 面向前端的 DTO 映射
- Nuxt API 路由

## 边界约束

- 复杂查询优先放到 `@ps/data-access`
- 不从本包直接向客户端暴露任何能力
- 不让 `web` / `admin` 客户端代码直接依赖本包

## 维护说明

- schema 变更必须配套 migration
- seed 需要保持可重复执行
- 如果某段逻辑已经体现明确业务意图，优先考虑上移到 `data-access`
