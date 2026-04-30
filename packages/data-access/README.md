# @ps/data-access

服务端共享数据访问层。

## 职责

- 封装可复用的 Prisma 查询和写操作。
- 给 `web` / `admin` 的 server API 提供稳定的数据访问接口。
- 保持路由层轻量，把复杂查询和写入编排放在这里。

## 当前入口

活跃入口：

- `@ps/data-access`
  - `articles`
  - `auth`
  - `categories`
  - `tags`

## 适合放入的内容

- Prisma 查询封装
- 数据写入逻辑
- 事务编排
- 面向 API 的稳定返回映射

## 不适合放入的内容

- Nuxt `defineEventHandler`
- Vue 组件或 composable
- UI 格式化逻辑
- 浏览器侧状态管理

## 导入约束

- 只能在服务端代码中使用
- 客户端组件禁止直接依赖本包
- 当前能力统一从 `@ps/data-access` 根入口导入

## 设计约束

- `db` 只负责数据库基础设施，本包负责业务级查询
- 新增领域时，先确认它是否已经是当前 web/admin 的正式能力
- 尚未进入正式产品面的领域，不要预先在本包中保留无消费者壳代码
