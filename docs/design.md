# Percy Site 设计稿

## 1. 项目定位

Percy Site 是一个面向前端开发者的个人主页系统，不只是静态简历页，而是一个完整的个人品牌、作品集、技术博客和后台内容管理平台。

项目目标：

- 展示个人前端开发能力、工程化能力和产品审美。
- 第一版前台保持极简，只展示个人介绍、技术文章、分类页和关于页。
- 项目展示和联系表单暂不放入前台，后续内容成熟后再恢复。
- 第一版后台聚焦文章管理和资源管理；分类和标签作为文章元数据能力提供，不提供独立标签管理页。项目管理、联系消息管理和站点设置页暂不接入后台。
- 通过 monorepo 架构沉淀公共组件、数据访问和类型定义。
- 使用现代 Vue 技术栈，体现 Vue 3、TypeScript、Nuxt、Tailwind CSS、Prisma 和 PostgreSQL 的综合实践能力。

核心访问入口：

```txt
percy.ren          # 个人主页前台
admin.percy.ren    # 管理后台
```

补充设计文档：

- 资源管理详细设计见 `docs/resource-management.md`

## 2. 技术选型

### 2.1 前台应用

```txt
框架：Nuxt
语言：TypeScript
视图：Vue 3
样式：Tailwind CSS
组件：shadcn-vue
图标：lucide-vue-next
内容：数据库内容 + Markdown/富文本内容
部署：Vercel / Netlify / Cloudflare Pages / Node Server
```

前台使用 Nuxt 的原因：

- 支持 SSR、SSG 和混合渲染，适合个人主页、作品集和博客。
- SEO、Open Graph、Sitemap、RSS 等能力更自然。
- 可以直接通过 `server/api` 编写服务端接口，不需要额外 Express 服务。
- 与 Vue 3、TypeScript、Tailwind CSS 的组合成熟稳定。

### 2.2 后台应用

```txt
框架：Nuxt
语言：TypeScript
视图：Vue 3
样式：Tailwind CSS
组件：Ant Design Vue
图标：@ant-design/icons-vue
部署：admin 子域名
```

后台同样使用 Nuxt 的原因：

- 后台页面和后台 API 可以放在同一个应用中。
- 登录、鉴权、Cookie、服务端校验、数据库访问都可以在 Nuxt server 层完成。
- 和前台共享相同技术体系，降低维护成本。
- web 和 admin 可以作为两个独立 app 分开部署，适合两个域名的上线方式。

### 2.3 服务端方案

项目第一版不单独引入 Express。

原因：

- Nuxt 本身具备服务端 API 能力。
- web 和 admin 都可以拥有各自的 `server/api`。
- 使用独立 Express 会增加部署、CORS、环境变量、鉴权 Cookie、接口地址配置等复杂度。
- 当前项目 API 主要服务于个人主页和管理后台，Nuxt server routes 足够使用。

保留未来扩展空间：

```txt
如果后续出现独立 API 平台、移动端、WebSocket、任务队列、复杂 webhook 或多客户端统一后端需求，
可以再新增 apps/api，并使用 Express / Fastify / Hono 等服务端框架。
```

### 2.4 数据层

```txt
ORM：Prisma
数据库：PostgreSQL
数据访问：packages/data-access
数据库包：packages/db
```

Prisma 和 PostgreSQL 适合本项目：

- 数据模型清晰，适合文章、项目、标签、用户、联系消息等结构化内容。
- Prisma 类型体验好，适合 TypeScript monorepo。
- PostgreSQL 稳定可靠，后续可扩展全文检索、JSON 字段、统计分析等能力。

## 3. Monorepo 架构

项目使用 `pnpm workspace` 管理 monorepo。

推荐结构：

```txt
percy-site/
  apps/
    web/
    admin/

  packages/
    db/
    data-access/
    shared/
    ui/

  docs/
    design.md

  package.json
  pnpm-workspace.yaml
  turbo.json
  tsconfig.base.json
  .env.example
  README.md
```

### 3.1 apps/web

`apps/web` 是公开访问的个人主页前台，部署到主域名。

职责：

- 首页展示。
- 文章列表和文章详情。
- 分类页。
- 关于我页面。
- SEO、Open Graph、Sitemap、RSS。
- 公开文章 API。

暂不包含：

- 项目列表和项目详情。
- 联系页和联系表单。

建议目录：

```txt
apps/web/
  app/
    app.vue
    pages/
      index.vue
      articles/
        index.vue
        [id].vue
      categories/
        index.vue
      about.vue
    components/
      layout/
    composables/
    plugins/
    assets/
      css/
        main.css

  server/
    api/
      articles.get.ts
      articles/
        [id].get.ts
    utils/
      api.ts
      markdown.ts

  public/
    images/
    resume.pdf

  nuxt.config.ts
  package.json
```

### 3.2 apps/admin

`apps/admin` 是后台管理系统，部署到 admin 子域名。

职责：

- 管理员登录。
- 文章 CRUD。
- 资源上传与管理。
- 分类与标签支撑接口。
- 后台 API。

建议目录：

```txt
apps/admin/
  app/
    app.vue
    pages/
      login.vue
      index.vue
      articles/
        index.vue
        [id].vue
        new.vue
      resources/
        index.vue
    layouts/
      default.vue
      auth.vue
    components/
      articles/
    middleware/
      auth.global.ts
    composables/

  server/
    api/
      auth/
        login.post.ts
        logout.post.ts
        me.get.ts
      articles/
        index.get.ts
        index.post.ts
        [id].get.ts
        [id].patch.ts
        [id].delete.ts
      resources/
        index.get.ts
        index.post.ts
        [id].get.ts
        [id].patch.ts
        [id].delete.ts
      tags/
        index.get.ts
        index.post.ts
        [id].delete.ts
      categories/
        index.get.ts
        index.post.ts
        [id].delete.ts
      settings/
        index.get.ts
    utils/
      require-auth.ts
      admin-session.ts
      api.ts

  public/
  nuxt.config.ts
  package.json
```

### 3.3 packages/db

`packages/db` 管理数据库基础设施。

职责：

- Prisma schema。
- Prisma migrations。
- Prisma Client。
- seed 脚本。
- 数据库连接导出。

建议目录：

```txt
packages/db/
  prisma/
    schema.prisma
    migrations/
    seed.ts

  src/
    client.ts
    index.ts

  package.json
```

示例：

```ts
// packages/db/src/client.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### 3.4 packages/data-access

`packages/data-access` 封装可复用的数据访问逻辑。

职责：

- 查询公开文章。
- 查询后台文章列表。
- 创建、更新、删除文章。

建议目录：

```txt
packages/data-access/
  src/
    articles.ts
    auth.ts
    categories.ts
    tags.ts
    index.ts

  package.json
```

设计原则：

- `apps/web` 和 `apps/admin` 的 API 路由尽量保持薄。
- 复杂 Prisma 查询放在 `data-access`。
- 根入口 `@ps/data-access` 只暴露当前活跃领域。
- 不为未来预留无消费者的数据访问壳层。
- 业务校验输入优先使用 `packages/shared` 中的 Zod schema。
- 不在客户端组件中直接引入 `data-access`。

### 3.5 packages/shared

`packages/shared` 存放前后端共享的 schema、类型和纯工具函数。

职责：

- Zod schema。
- TypeScript 类型。
- API 响应类型。
- slug、id、字数统计等纯工具函数。

建议目录：

```txt
packages/shared/
  src/
    api.ts
    article.ts
    auth.ts
    category.ts
    pagination.ts
    tag.ts
    utils.ts
    schemas/
    types/
    utils/

  package.json
```

当前约束：

- `@ps/shared` 根入口只保留横切能力，例如 `api` 与 `utils`
- 具体领域对象按子路径导入，例如 `@ps/shared/article`
- 不为未来预留无消费者的 schema 入口

### 3.6 packages/ui

`packages/ui` 存放 web 和 admin 之间可复用的 Vue UI 组件。

推荐基于：

```txt
shadcn-vue
Tailwind CSS
lucide-vue-next
```

适合抽到 `packages/ui` 的组件：

- Button。
- Input。
- Textarea。
- Select。
- Checkbox。
- Dialog。
- Dropdown。
- Tooltip。
- Tabs。
- Badge。
- Card。
- EmptyState。
- ThemeToggle。
- FormField。

不建议第一版就抽象的组件：

- 首页 Hero。
- 项目展示卡片。
- 博客文章卡片。
- 后台 Layout。
- 强业务绑定组件。

原则：

```txt
先在 app 内实现，确认 web 和 admin 都需要后，再抽到 packages/ui。
```

建议目录：

```txt
packages/ui/
  src/
    components/
      button/
      input/
      textarea/
      dialog/
      dropdown-menu/
      card/
      badge/
      tabs/
      tooltip/
      empty-state/
    composables/
      use-theme.ts
    styles/
      globals.css
    index.ts

  package.json
```

## 4. 应用边界

### 4.1 web 边界

web 只处理公开访问相关能力：

```txt
公开页面
公开内容查询
SEO
分类页
站点地图
RSS
Open Graph
```

web 不做：

```txt
后台 CRUD 页面
管理员登录页面
后台权限管理
私有数据管理
```

### 4.2 admin 边界

admin 只处理后台管理：

```txt
登录
鉴权
文章管理
分类与标签支撑接口
```

admin 不直接承载公开展示页面。

### 4.3 API 边界

web API：

```txt
percy.ren/api/articles
percy.ren/api/articles/[id]
```

admin API：

```txt
admin.percy.ren/api/auth/login
admin.percy.ren/api/auth/logout
admin.percy.ren/api/auth/me
admin.percy.ren/api/articles
admin.percy.ren/api/categories
admin.percy.ren/api/tags
```

web 调用 web 自己的 API。

admin 调用 admin 自己的 API。

避免：

```txt
admin.percy.ren 调用 percy.ren/api/admin
```

这样可以减少 CORS、Cookie 跨域和鉴权复杂度。

## 5. 页面设计

## 5.1 前台页面

### 首页

首页负责在 30 秒内说明：

- 你是谁。
- 你擅长什么。
- 你关注哪些前端主题。
- 引导用户阅读文章或了解你。

页面区块：

```txt
Hero
最近文章
```

Hero 内容：

```txt
Percy
Frontend Developer

专注于构建高质量 Web 应用、设计系统、交互体验和前端工程化。
我喜欢把复杂业务做成清晰、稳定、可维护的界面。
```

主要操作：

```txt
阅读文章
关于我
```

### 项目列表页，后续恢复

功能：

- 展示所有公开项目。
- 支持按类型筛选。
- 支持精选标记。
- 支持项目技术栈标签。

项目分类：

```txt
All
Web App
Open Source
UI Experiment
AI
Tooling
```

项目卡片内容：

```txt
项目封面
项目名称
项目摘要
技术栈标签
在线预览链接
GitHub 链接
详情入口
```

### 项目详情页，后续恢复

页面结构：

```txt
项目标题
一句话介绍
项目截图 / 视频
项目背景
我的职责
技术栈
核心功能
技术亮点
难点与解决方案
结果
链接
```

项目详情页要突出工程判断，而不是只罗列功能。

示例亮点：

```txt
使用流式渲染优化 AI 回复体验
抽象通用表单组件
使用 Playwright 覆盖核心流程
使用 Nuxt server routes 简化数据提交
```

### 文章列表页

功能：

- 展示文章列表。
- 当前为时间序展示。
- 展示发布时间和文章字数。

### 文章详情页

功能：

- Markdown 展示。
- 代码高亮。
- 代码块复制和下载。
- 文章字数。
- Open Graph。

当前实现约束：

```txt
Markdown 在服务端渲染为 HTML
代码高亮由 Shiki 生成
客户端只负责增强交互和样式呈现
```

### 分类页

功能：

- 按分类聚合展示文章。
- 展示每个分类下的文章数量。
- 从分类页进入文章详情时保留返回语义。

### 关于页

页面结构：

```txt
我是谁
我擅长什么
我的工作方式
经历
技术偏好
简历下载
```

示例文案：

```txt
我是一名前端开发者，关注 Web 应用的体验质量和工程可维护性。
我擅长使用 Vue、Nuxt、TypeScript 和 Tailwind CSS 构建稳定、清晰、可扩展的产品界面。
相比堆叠视觉效果，我更重视真实用户流程、组件边界、性能和长期维护成本。
```

### 联系页，后续恢复

功能：

- 邮箱。
- GitHub。
- 社交链接。
- 简历下载。
- 联系表单。

联系表单字段：

```txt
姓名
邮箱
主题
消息
```

## 5.2 后台页面

### 登录页

功能：

- 邮箱 / 用户名登录。
- 密码输入。
- 登录错误提示。
- 登录成功后跳转文章管理页。

安全要求：

- 使用 HttpOnly Cookie。
- 不把 token 放到 localStorage。
- 密码使用哈希存储。
- 登录接口限流，后续实现。

### 后台入口

展示：

- 登录后默认进入文章管理页。
- `/` 作为后台入口路径，自动跳转到 `/articles`。

### 文章管理

功能：

- 文章列表。
- 新建文章。
- 编辑文章。
- 删除文章。
- 发布日期设置。
- 分类单选，支持从数据库选项中选择、临时创建和删除。
- 标签多选，支持从数据库选项中选择、临时创建和删除。

字段：

```txt
标题
摘要
内容
分类
标签
发布日期
```

### 分类管理

功能：

- 当前不提供独立分类管理页面。
- 分类在文章编辑流程中按需输入、选择和删除。
- 标签同样不提供独立页面，作为文章元数据能力存在。

## 6. 数据模型设计

初版核心模型：

```txt
User
Project
Article
Tag
Asset
ContactMessage
SiteConfig
```

### 6.1 User

用途：后台管理员。

字段：

```txt
id
email
name
passwordHash
role
createdAt
updatedAt
```

### 6.2 Project

用途：项目展示和后台管理。

字段：

```txt
id
title
slug
summary
content
coverImage
category
techStack
demoUrl
repoUrl
featured
published
publishedAt
createdAt
updatedAt
```

说明：

- `techStack` 可以第一版使用 JSON 字段。
- 后续如果需要更复杂筛选，可以拆为 ProjectTech 表。

### 6.3 Article

用途：博客文章。

字段：

```txt
id
title
slug
category
excerpt
content
coverImage
wordCount
published
publishedAt
createdAt
updatedAt
```

说明：

- `category` 用于文章列表和详情页展示文章方向，例如前端工程、AI 应用、产品界面。
- 后台维护独立的 Category 字典表，文章保存时会同步创建或复用分类选项。
- `wordCount` 存储文章总字数，创建或更新文章时由服务端根据正文计算。
- 第一版 seed 会写入一组公开文章数据，前台通过公开文章 API 获取；后续后台发布流程完善后再移除 seed 模拟内容。

### 6.4 Category

用途：后台文章分类选项。

字段：

```txt
id
name
slug
createdAt
updatedAt
```

### 6.5 Tag

用途：文章和项目标签。

字段：

```txt
id
name
slug
createdAt
updatedAt
```

关系：

```txt
Article <-> Tag
Project <-> Tag
```

### 6.6 Asset

用途：媒体资源。

字段：

```txt
id
url
name
mimeType
size
alt
createdAt
updatedAt
```

### 6.6 ContactMessage

用途：联系表单消息。

字段：

```txt
id
name
email
subject
message
read
createdAt
updatedAt
```

### 6.7 SiteConfig

用途：站点配置。

字段：

```txt
id
key
value
createdAt
updatedAt
```

第一版也可以直接用 JSON 存储站点配置。

## 7. API 设计

### 7.1 web API

公开文章：

```txt
GET /api/articles
GET /api/articles/[id]
```

### 7.2 admin API

认证：

```txt
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

文章：

```txt
GET    /api/articles
POST   /api/articles
GET    /api/articles/[id]
PATCH  /api/articles/[id]
DELETE /api/articles/[id]
```

资源：

```txt
GET    /api/resources
POST   /api/resources
GET    /api/resources/[id]
PATCH  /api/resources/[id]
DELETE /api/resources/[id]
GET    /api/resources/[id]/references
```

分类与标签支撑：

```txt
GET    /api/categories
POST   /api/categories
DELETE /api/categories/[id]
GET    /api/tags
POST   /api/tags
DELETE /api/tags/[id]
```

## 8. 鉴权设计

后台使用 Cookie Session 或 JWT Session，推荐第一版使用服务端 Session。

当前实现采用数据库管理员账号 + 签名 HttpOnly Cookie：

```txt
管理员账号来自 User 表
seed 根据 ADMIN_EMAIL / ADMIN_INITIAL_PASSWORD 创建初始管理员
密码使用 scrypt 哈希存储
Cookie 保存签名后的 userId 和过期时间
后台 API 通过 requireAuth(event) 校验 Cookie 签名和用户是否存在
```

要求：

```txt
Cookie 必须 HttpOnly
生产环境 Cookie 必须 Secure
SameSite 使用 Lax
不在 localStorage 存储 token
admin 域名独立维护登录态
```

推荐 Cookie 策略：

```txt
Domain: 不设置，默认只作用于 admin.percy.ren
Path: /
HttpOnly: true
Secure: true
SameSite: Lax
```

登录流程：

```txt
1. 用户访问 admin.percy.ren/login
2. 提交邮箱和密码
3. server/api/auth/login 校验密码
4. 创建 session
5. 设置 HttpOnly Cookie
6. 跳转文章管理页
```

鉴权流程：

```txt
1. 后台页面通过 middleware 检查登录态
2. 后台 API 通过 requireAuth(event) 校验登录态
3. 未登录返回 401 或跳转登录页
```

## 9. UI 与视觉设计

整体风格：

```txt
干净
克制
工程感
信息密度适中
注重细节
```

设计原则：

- 页面本身要体现前端开发者的审美和工程质量。
- 不做传统营销页。
- 不堆叠无意义动效。
- 不使用过重的装饰背景。
- 项目截图要清晰可见。
- 博客阅读体验优先。
- 管理后台要高效、安静、可扫描。

字体建议：

```txt
正文：Segoe UI / PingFang SC / Hiragino Sans GB / sans-serif
后台正文：Segoe UI / PingFang SC / Hiragino Sans GB / Microsoft YaHei / sans-serif
代码：ui-monospace / SFMono-Regular / Menlo / Monaco / Consolas / Liberation Mono / Courier New
```

颜色建议：

```txt
背景：白色 / 浅灰 / 深色近黑
文本：高对比中性色
边框：低对比中性色
主色：蓝绿色、青色、绿色或中性强调色
状态色：成功、警告、错误保持语义明确
```

避免：

```txt
整站紫色渐变
大面积深蓝卡片
过度霓虹效果
模板化后台风格
大量滚动视差
影响阅读的动画
```

## 10. 组件库策略

首选组件库：

```txt
shadcn-vue
```

原因：

- 与 Tailwind CSS 匹配。
- 组件代码可以放进项目中维护。
- 定制能力强。
- 适合个人主页和轻量后台。
- 不容易产生强烈模板感。

辅助库：

```txt
lucide-vue-next    # 图标
zod                # schema 校验
vee-validate       # 表单，可选
TanStack Query     # 客户端数据请求，可选
TanStack Table     # 后台表格，可选
```

后台第一版也使用 `shadcn-vue`，保持视觉和代码风格统一。

如果后续后台数据表格、筛选、上传、复杂 CRUD 明显增多，可以再考虑：

```txt
PrimeVue / Volt
```

## 11. 环境变量

根目录维护 `.env.example`。

示例：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/percy_site"

NUXT_SESSION_SECRET="change-me"
NUXT_PUBLIC_SITE_URL="http://localhost:3000"
NUXT_PUBLIC_ADMIN_URL="http://localhost:3001"

ADMIN_EMAIL="admin@example.com"
ADMIN_INITIAL_PASSWORD="change-me"
```

生产环境：

```txt
DATABASE_URL 只配置在服务端环境
SESSION_SECRET 必须使用强随机值
公开变量必须使用 NUXT_PUBLIC_ 前缀
敏感变量不能暴露到客户端
```

## 12. 开发脚本设计

根目录 `package.json` 建议脚本：

```json
{
  "scripts": {
    "dev": "turbo dev",
    "dev:web": "turbo dev --filter=@ps/web",
    "dev:admin": "turbo dev --filter=@ps/admin",
    "build": "turbo build",
    "build:web": "turbo build --filter=@ps/web",
    "build:admin": "turbo build --filter=@ps/admin",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "format": "prettier --write .",
    "db:generate": "pnpm --filter=@ps/db db:generate",
    "db:migrate": "pnpm --filter=@ps/db db:migrate",
    "db:deploy": "docker compose run --build --rm migrate",
    "db:deploy:local": "pnpm --filter=@ps/db db:deploy",
    "db:studio": "pnpm --filter=@ps/db db:studio",
    "db:seed": "docker compose run --build --rm migrate pnpm --filter @ps/db db:seed",
    "db:seed:local": "pnpm --filter=@ps/db db:seed"
  }
}
```

包命名：

```txt
@ps/web
@ps/admin
@ps/db
@ps/data-access
@ps/shared
@ps/ui
```

`pnpm-workspace.yaml`：

```yaml
packages:
  - apps/*
  - packages/*
```

## 13. 部署方案

### 13.1 域名规划

```txt
percy.ren
www.percy.ren
admin.percy.ren
```

推荐：

```txt
percy.ren       -> apps/web
www.percy.ren   -> redirect to percy.ren
admin.percy.ren -> apps/admin
```

### 13.2 部署边界

web 和 admin 独立部署：

```txt
apps/web
  独立 build
  独立域名
  公开访问

apps/admin
  独立 build
  独立域名
  需要登录
```

数据库共用：

```txt
PostgreSQL
  apps/web server API 读取公开数据
  apps/admin server API 管理数据
```

### 13.3 部署平台

当前生产环境采用：

```txt
GitHub Actions
  build percy-site-web image
  build percy-site-admin image
  build percy-site-migrate image
  push to image registry
  ssh trigger server deploy

Self-hosted server
  Docker Compose 管理 Percy Site 应用、数据库、迁移任务和上传文件 volume
  独立 edge-proxy 统一占用 80 / 443
  Percy Site 通过外部 Docker 网络 edge 接入 edge-proxy
```

原因：

- 当前服务器会同时承载多个项目，不能让每个项目各自启动一个绑定 `80` / `443` 的 Caddy。
- 统一入口代理应作为独立部署单元维护，避免把代理配置散落在具体业务项目仓库里。
- web 和 admin 仍然独立构建、独立容器运行，符合双域名部署边界。
- PostgreSQL 和上传文件 volume 由 Percy Site 自己的 compose 管理，避免和其他项目的数据边界混在一起。
- 发布流程与同服务器上的既有项目保持一致：镜像构建、远程拉取、迁移、健康检查、启动服务。

可选平台仍然包括：

```txt
Vercel
Netlify
Cloudflare Pages + server runtime
Railway
Render
自建 VPS + Docker
```

如果使用 Prisma + PostgreSQL + Nuxt server API，部署平台需要支持服务端运行时。

生产部署操作手册见：

```txt
docs/deployment-runbook.md
```

## 14. SEO 与内容分发

web 应用需要支持：

- 每页 title。
- 每页 description。
- Open Graph。
- Twitter Card。
- canonical URL。
- sitemap.xml。
- robots.txt。
- RSS。
- 项目和文章详情页动态元信息。

重点页面：

```txt
/
/articles
/articles/[id]
/about
```

文章详情页需要支持单独分享图。

第一版可以使用默认 OG 图，后续支持动态生成。

## 15. 性能要求

前台性能目标：

```txt
首屏内容尽快展示
图片使用合适尺寸和懒加载
项目截图压缩
代码分割
字体加载优化
减少不必要的客户端 JS
```

后台性能目标：

```txt
列表分页
搜索和筛选尽量服务端处理
表单提交有 loading 状态
错误提示清晰
```

## 16. 测试策略

第一版测试重点：

```txt
类型检查
核心工具函数单元测试
API schema 校验
后台登录流程
文章 CRUD 流程
前台文章展示
```

推荐工具：

```txt
Vitest
Playwright
TypeScript
ESLint
Prettier
```

测试脚本：

```txt
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
```

## 17. 阶段计划

### 第一阶段：项目基础

目标：搭好 monorepo 和基础应用。

任务：

```txt
创建 pnpm workspace
创建 apps/web
创建 apps/admin
创建 packages/db
创建 packages/shared
创建 packages/data-access
创建 packages/ui
配置 TypeScript
配置 Tailwind CSS
配置 Nuxt
配置 Prisma
连接 PostgreSQL
```

交付：

```txt
web 可以启动
admin 可以启动
Prisma 可以连接数据库
基础 UI 可以使用
```

### 第二阶段：前台 MVP

目标：完成可公开访问的个人主页。

任务：

```txt
首页
博客列表
博客详情
关于页
SEO 基础配置
响应式适配
```

交付：

```txt
percy.ren 可以上线展示
```

### 第三阶段：后台 MVP

目标：完成基础内容管理。

任务：

```txt
登录
文章 CRUD
```

交付：

```txt
admin.percy.ren 可以登录并管理内容
```

### 第四阶段：体验增强

目标：提升前台和后台体验。

任务：

```txt
深色模式
命令面板
全站搜索
文章目录
代码高亮
图片上传
Toast
表单体验优化
```

### 第五阶段：品牌与工程增强

目标：提升个人品牌和工程完整度。

任务：

```txt
RSS
Sitemap
动态 Open Graph
访问统计
项目 Case Study 模板
简历 PDF
中英文切换，可选
Playwright E2E
部署流水线
```

## 18. 最终推荐方案

最终架构：

```txt
apps/
  web/          # Nuxt 个人主页，主域名
  admin/        # Nuxt 管理后台，admin 子域名

packages/
  db/           # Prisma schema/client/migrations
  data-access/  # 共享数据访问逻辑
  shared/       # 类型、Zod schema、常量、工具
  ui/           # 公共 Vue 组件
```

最终技术栈：

```txt
Nuxt
Vue 3
TypeScript
Tailwind CSS
shadcn-vue
Prisma
PostgreSQL
pnpm workspace
Turborepo
```

不引入 Express 作为第一版依赖。

理由：

- Nuxt 已经能承载页面和服务端 API。
- web 和 admin 可以独立部署到两个域名。
- 公共数据库能力通过 packages/db 和 packages/data-access 复用。
- 类型、schema、工具通过 packages/shared 复用。
- UI 通过 packages/ui 复用。
- 架构清晰，复杂度可控，后续也能扩展为独立 API 服务。

这个设计可以同时满足：

- 个人主页展示。
- 后台内容管理。
- 分域名部署。
- monorepo 工程化。
- Vue 技术栈实践。
- 后续扩展能力。
