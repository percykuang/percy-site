# @ps/admin

后台管理应用，部署到 admin 子域名。

## 职责

- 管理员登录
- 登录态校验
- 文章管理
- 分类与标签支撑接口
- 后台 API

## 当前正式能力

- `/login`
- `/articles`
- `/articles/new`
- `/articles/[id]`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET|POST /api/articles`
- `GET|PATCH|DELETE /api/articles/[id]`
- `GET|POST /api/categories`
- `DELETE /api/categories/[id]`
- `GET|POST /api/tags`
- `DELETE /api/tags/[id]`

`/` 当前只作为后台入口，自动跳转到 `/articles`。

## 暂未进入正式产品面的内容

- 独立标签管理页
- 项目管理页
- 联系消息管理页
- 站点设置页

如果未来恢复这些能力，应先确认是否进入正式产品面，再决定是否从保留域提升为主入口。

## 目录约定

- `app/pages`：后台页面
- `app/components`：后台业务组件
- `app/composables`：后台请求与登录态逻辑
- `app/layouts`：后台壳层和登录页布局
- `app/middleware`：前端路由守卫
- `server/api`：后台 API
- `server/utils`：鉴权、session、API 包装等服务端工具

## 与 packages 的边界

- 共享 schema / DTO / 纯工具走 `@ps/shared`
- 服务端查询和写入统一走 `@ps/data-access`
- 公共基础展示组件才进入 `@ps/ui`
- 后台表单和列表不要为了复用感强行抽到公共包

## 收敛规则

- 页面和 API 不直接写复杂 Prisma 逻辑
- 当前正式主链路围绕 `articles`
- 预留领域不要默认从主入口暴露
