# AGENTS.md

本文件是 Percy Site 项目的 AI 协作与开发约定。后续在本仓库中进行代码生成、重构、调试、文档编写和提交建议时，应优先遵守本文件，再结合具体任务和上下文执行。

## 通用沟通约定

- 始终使用中文与用户沟通。
- 回答要直接、具体、可执行，避免空泛建议。
- 涉及代码改动时，先阅读相关文件和项目上下文，再动手修改。
- 不要在未确认需求的情况下引入大型框架、复杂抽象或额外服务。
- 对已有设计方案有疑问时，优先参考 `docs/design.md`。
- 当涉及第三方库、框架或工具的代码编写时，自动使用 Context7 MCP 查询最新官方文档，确保代码基于当前 API，而不是过时经验。

## 特殊指令

### 用户输入 `read`

当用户只输入或明确要求 `read` 时：

1. 自动阅读当前项目结构。
2. 阅读核心文档，包括但不限于：
   - `AGENTS.md`
   - `docs/design.md`
   - `plan.md`
   - 根目录配置文件
   - `apps/*`
   - `packages/*`
3. 总结项目目标、当前实现状态、技术栈、主要目录和下一步建议。
4. 只做阅读和总结，不主动修改代码，除非用户明确要求。

### 用户输入 `git`

当用户只输入或明确要求 `git` 时：

1. 分析当前对话上下文和工作区改动。
2. 识别用户最新代码改动文件。
3. 按功能模块分批次推荐 `git add <文件>` 命令，避免一次性 `git add .`。
4. 基于改动内容生成英文 Conventional Commits 信息。
5. 如果项目中已有 commit scope 约定，必须沿用已有 scope。
6. 输出清晰、可直接复制的 Git 命令序列。

commit 格式：

```txt
<type>(<scope>): <description>
```

允许的 type：

```txt
feat
fix
docs
style
refactor
test
chore
```

description 要准确简洁，尽量不超过 50 个英文字符。

示例：

```bash
git add docs/design.md
git add AGENTS.md
git commit -m "docs(project): add architecture and agent guide"
```

## 项目定位

Percy Site 是一个前端开发者个人主页系统，包含：

- 个人主页前台。
- 管理后台。
- 项目作品集。
- 技术博客。
- 联系表单。
- 内容管理能力。
- 可复用的 monorepo 公共包。

项目不是简单静态页面，而是一个用于展示个人审美、前端能力、全栈工程能力和长期维护能力的作品。

完整设计稿见：

```txt
docs/design.md
```

## 技术栈约定

优先采用以下技术栈：

```txt
包管理：pnpm
仓库结构：pnpm workspace monorepo
任务编排：Turborepo
前端框架：Nuxt + Vue 3
语言：TypeScript
样式：Tailwind CSS
组件：shadcn-vue
图标：lucide-vue-next
数据库：PostgreSQL
ORM：Prisma
校验：Zod
测试：Vitest / Playwright
```

第一版不引入 Express。

原因：

- Nuxt 具备 `server/api` 服务端接口能力。
- `apps/web` 和 `apps/admin` 可以分别拥有自己的服务端 API。
- web 和 admin 后续会部署到不同域名，两个 Nuxt app 更适合独立管理和部署。
- 独立 Express 服务会增加 CORS、部署、Cookie、环境变量和 API 地址配置复杂度。

只有在后续出现独立 API 平台、多客户端统一后端、复杂队列、WebSocket、复杂 webhook 或需要完全控制 HTTP server 时，才考虑新增 `apps/api`。

## 目标目录结构

目标架构：

```txt
apps/
  web/          # Nuxt 个人主页，部署到主域名
  admin/        # Nuxt 管理后台，部署到 admin 子域名

packages/
  db/           # Prisma schema/client/migrations
  data-access/  # 共享数据访问逻辑
  shared/       # 类型、Zod schema、常量、纯工具函数
  ui/           # 公共 Vue 组件

docs/
  design.md     # 项目完整设计稿
```

根目录推荐保留：

```txt
package.json
pnpm-workspace.yaml
turbo.json
tsconfig.base.json
.env.example
README.md
AGENTS.md
```

## 应用边界

### apps/web

`apps/web` 是公开个人主页，部署到主域名。

职责：

- 首页。
- 项目列表。
- 项目详情。
- 博客列表。
- 博客详情。
- 关于页。
- 联系页。
- SEO。
- Open Graph。
- Sitemap。
- RSS。
- 公开 API。

web API 示例：

```txt
GET  /api/projects
GET  /api/projects/[slug]
GET  /api/articles
GET  /api/articles/[id]
POST /api/contact
```

web 不负责：

- 后台 CRUD 页面。
- 管理员登录页面。
- 后台权限管理。
- 私有数据管理。

### apps/admin

`apps/admin` 是后台管理系统，部署到 admin 子域名。

职责：

- 登录。
- 文章管理。
- 媒体管理。
- 站点配置。
- 后台 API。

当前第一版 admin 不提供项目管理、联系消息管理和独立标签管理页面；标签仍作为文章元数据在文章编辑表单中维护。相关数据模型与 data-access 可保留，等后续需求恢复时再接入页面和 API。

admin API 示例：

```txt
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
GET    /api/articles
POST   /api/articles
PATCH  /api/articles/[id]
DELETE /api/articles/[id]
GET    /api/tags
GET    /api/settings
```

admin 不承载公开展示页面。

## packages 边界

### packages/db

只放数据库基础设施：

- Prisma schema。
- migrations。
- seed。
- Prisma Client。
- 数据库连接导出。

不要在 `packages/db` 中堆太多业务查询逻辑。复杂业务查询应放到 `packages/data-access`。

### packages/data-access

放共享数据访问逻辑：

- `listPublishedProjects`
- `getPublishedProjectBySlug`
- `listAdminProjects`
- `createProject`
- `updateProject`
- `deleteProject`
- articles、tags、messages、settings 等同理。

原则：

- Nuxt `server/api` 路由层保持薄。
- 复杂 Prisma 查询和复用逻辑放在 data-access。
- 根入口 `@ps/data-access` 只暴露当前 web/admin 正在使用的稳定领域 API。
- 预留但尚未接入产品面的领域能力，应通过显式次级入口暴露，避免污染当前公共导出面。
- data-access 只能在服务端代码中使用。
- 客户端 Vue 组件不要直接引入 data-access。

### packages/shared

放前后端可共享且不依赖运行环境的内容：

- Zod schema。
- TypeScript 类型。
- 枚举。
- 常量。
- API 响应类型。
- 日期、slug、字符串等纯工具函数。

shared 不应该依赖：

- Nuxt。
- Vue。
- Prisma Client。
- Node-only API。
- apps 下的任何文件。

### packages/ui

放 web 和 admin 都会复用的 Vue UI 组件。

适合放入：

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

不建议过早放入：

- 首页 Hero。
- 项目展示卡片。
- 博客文章卡片。
- 后台 Layout。
- 强业务绑定组件。

原则：

```txt
先在 app 内实现，确认 web 和 admin 都需要后，再抽到 packages/ui。
```

## 依赖方向

必须保持单向依赖：

```txt
apps/web   -> packages/ui
apps/web   -> packages/shared
apps/web   -> packages/data-access  # 仅 server 侧

apps/admin -> packages/ui
apps/admin -> packages/shared
apps/admin -> packages/data-access  # 仅 server 侧

packages/data-access -> packages/db
packages/data-access -> packages/shared

packages/ui -> packages/shared，可选

packages/db -> 不依赖 apps
packages/shared -> 不依赖 apps
```

禁止：

```txt
packages/* -> apps/*
packages/shared -> packages/db
packages/shared -> Nuxt/Vue/Prisma
客户端组件 -> packages/db
客户端组件 -> packages/data-access
```

## API 设计规则

- web 调用 web 自己的 API。
- admin 调用 admin 自己的 API。
- 避免 `admin.percy.dev` 调用 `percy.dev/api/admin`。
- 避免不必要的 CORS 和跨站 Cookie。
- API 输入必须使用 Zod schema 校验。
- API 错误返回格式保持统一。
- 路由层只做：
  - 鉴权。
  - 读取输入。
  - schema 校验。
  - 调用 data-access。
  - 返回结果。

推荐结构：

```ts
export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const body = await readValidatedBody(event, createProjectSchema.parse)

  return createProject(body)
})
```

## 鉴权与安全

后台登录优先使用服务端 Session 或安全 Cookie 方案。

要求：

- Cookie 必须 `HttpOnly`。
- 生产环境 Cookie 必须 `Secure`。
- `SameSite` 推荐使用 `Lax`。
- 不要把 token 存到 `localStorage`。
- admin 登录态默认只作用于 `admin.percy.dev`。
- 密码必须哈希存储。
- 敏感环境变量不能暴露到客户端。
- 只有以 `NUXT_PUBLIC_` 开头的变量可以作为公开变量。

## 数据与隐私

- 只收集当前功能真正需要的数据。
- 联系表单只保存必要字段，例如姓名、邮箱、主题和消息。
- 不保存用户不知情的敏感个人信息。
- 不在前端埋点中记录邮箱、手机号、Cookie、IP 原文、完整 User-Agent 或消息正文等敏感信息。
- 如果后续接入访问统计，优先选择隐私友好的方案，并在文档中说明采集范围。
- 后台列表展示联系消息时，默认不暴露不必要的技术信息。
- 导出数据、删除数据或批量操作必须有明确确认步骤。
- 日志中不得输出密码、token、session、Cookie、数据库连接串、完整联系消息正文。

## UI 与交互规范

整体视觉方向：

- 干净。
- 克制。
- 工程感。
- 信息密度适中。
- 细节完整。

前台要求：

- 不做模板化营销页。
- 首页第一屏要清晰说明身份和价值。
- 项目截图要清晰可见。
- 博客阅读体验优先。
- 移动端必须认真适配。
- SEO 和分享信息要完整。

后台要求：

- 安静、稳定、高效。
- 信息结构清楚。
- 表单状态完整。
- 错误提示明确。
- 列表支持分页、搜索或筛选。

组件库策略：

- 默认使用 `shadcn-vue`。
- 默认使用 `lucide-vue-next` 图标。
- 不优先使用 Element Plus / Naive UI / PrimeVue。
- 如果后台复杂表格、上传、筛选能力明显增多，再考虑 PrimeVue / Volt / TanStack Table。

Tailwind 规则：

- 优先使用语义化组件和设计 token。
- 避免到处散落不可维护的魔法数。
- 不要创建整站单一色相的视觉方案。
- 深色模式需要保证对比度和可读性。

## 可访问性规范

- 交互控件必须使用语义化 HTML，按钮用 `button`，链接跳转用 `a`。
- 图标按钮必须提供可访问名称，例如 `aria-label` 或可见文本。
- 表单控件必须有关联 label，错误信息应能被辅助技术识别。
- 弹窗、下拉菜单、命令面板、抽屉必须考虑焦点管理和键盘关闭。
- 页面应保持合理标题层级，每页只保留一个主要 `h1`。
- 文本和背景对比度必须满足基本可读性要求，深色模式也要检查。
- 不用颜色作为唯一状态表达，错误、成功、警告状态应有文本或图标辅助。
- 动画和过渡不应影响阅读和操作，后续如支持 `prefers-reduced-motion` 应尊重用户设置。
- 后台核心流程必须可通过键盘完成基础操作。

## 内容与 SEO 规范

前台页面应具备：

- title。
- description。
- Open Graph。
- canonical。
- sitemap。
- robots。
- RSS，后续实现。

重点页面：

```txt
/
/projects
/projects/[slug]
/articles
/articles/[id]
/about
/contact
```

项目详情页应突出：

- 项目背景。
- 我的职责。
- 技术栈。
- 核心功能。
- 技术亮点。
- 难点与解决方案。
- 结果和链接。

博客详情页应优先保证：

- 阅读宽度合适。
- 标题层级清晰。
- 代码高亮。
- 目录导航，后续实现。
- 移动端可读。

## 性能规范

前台性能优先级高于视觉炫技。

- 首页首屏必须尽快展示核心身份信息和主要行动入口。
- 图片必须使用合适尺寸、压缩格式和懒加载策略。
- 项目截图、头像、OG 图片等资源应放在明确目录，并避免提交无压缩的大图。
- 不为装饰效果引入大型动画库、3D 库或重型依赖。
- 客户端 JavaScript 应保持克制，能在服务端完成的数据准备不要强行放到客户端。
- 列表页应避免一次性渲染过多内容，必要时分页或按需加载。
- 后台表格默认分页，避免全量加载大数据。
- 新增依赖或大资源时，应考虑包体积、缓存和首屏影响。
- 构建后如果出现明显体积增长，应说明原因并给出优化方向。

## 编码规范

### 基础原则

- 使用 TypeScript 编写业务代码。
- 代码优先追求清晰、稳定、可维护，不为了炫技使用复杂写法。
- 避免过早抽象，只有在真实重复、职责清晰、边界稳定后再抽公共模块。
- 不在一个改动中混入无关重构、格式化或目录调整。
- 不写无意义注释，复杂业务规则、边界条件和非显然取舍可以添加简短注释说明原因。
- 新增代码应尽量符合当前文件和模块的已有风格。

### TypeScript 规范

- 禁止默认使用 `any`，确有必要时应优先使用 `unknown`，并在收窄类型后再使用。
- 公共函数、API 输入输出、跨包数据结构必须有明确类型。
- 优先从 Zod schema 推导输入类型，避免 schema 和 type 双写后不一致。
- 类型命名使用 PascalCase，例如 `ProjectItem`、`CreatePostInput`。
- 函数和变量命名使用 camelCase，例如 `listPublishedProjects`。
- 常量命名使用 camelCase；真正的全局不可变枚举式常量可以使用 SCREAMING_SNAKE_CASE。
- 避免滥用类型断言 `as`，只有在边界明确且无法由 TypeScript 推断时使用。
- 避免使用非空断言 `!`，优先通过显式判断处理空值。
- 不把服务端类型直接泄漏给客户端展示层，必要时定义 DTO 或 select 需要字段。

示例：

```ts
import { createProjectSchema } from '@ps/shared'

export default defineEventHandler(async (event) => {
  const input = await readValidatedBody(event, createProjectSchema.parse)

  return createProject(input)
})
```

### Vue 与 Nuxt 规范

- Vue 组件默认使用 `<script setup lang="ts">`。
- 组件文件使用 PascalCase 命名，例如 `ProjectCard.vue`、`SiteHeader.vue`。
- 页面文件遵循 Nuxt 路由约定，使用 `index.vue`、`[slug].vue`、`[id].vue`。
- 组件 props 使用 `defineProps`，复杂 props 应抽出类型。
- 组件事件使用 `defineEmits`，事件名使用 kebab-case。
- 页面级数据请求优先使用 Nuxt 提供的 `useFetch`、`useAsyncData` 或 server API。
- 只在确实需要客户端状态共享时使用全局状态，不要把简单页面状态提前放入 store。
- 服务端代码只能放在 `server/`、server-only composable 或 packages 的服务端包中。
- 客户端组件不能直接引入 `packages/db` 或 `packages/data-access`。
- 需要访问环境变量时，服务端使用 `useRuntimeConfig`，客户端只读取明确公开的 public config。

组件结构建议：

```vue
<script setup lang="ts">
type Props = {
  title: string
  summary: string
}

defineProps<Props>()
</script>

<template>
  <article>
    <h2>{{ title }}</h2>
    <p>{{ summary }}</p>
  </article>
</template>
```

### 组件设计规范

- 组件职责保持单一。
- 业务组件优先放在对应 app 内。
- 只有 web 和 admin 都复用的基础组件才放到 `packages/ui`。
- 组件 props 应表达业务或 UI 意图，避免传入过多低层样式开关。
- 组件内部不要直接请求远程数据，除非它本身就是明确的数据容器组件。
- 列表组件必须提供空状态。
- 表单组件必须考虑 loading、disabled、error、success 等状态。
- 弹窗、抽屉、下拉、菜单等交互组件必须考虑键盘操作和焦点管理。
- 图标优先使用 `lucide-vue-next`，不要随手内联复杂 SVG。

### 样式规范

- 样式优先使用 Tailwind CSS。
- 全局样式只放基础 reset、CSS variables、字体、主题 token，不写大量页面样式。
- 可复用视觉规则优先沉淀为组件或 Tailwind preset，不到处复制长 class。
- class 顺序尽量保持可读：布局、盒模型、排版、颜色、状态、响应式。
- 不使用负 letter-spacing。
- 不使用随 viewport 宽度线性缩放的字体大小。
- 固定格式 UI 元素要有稳定尺寸，避免 hover、loading、图标切换导致布局跳动。
- 按钮、输入框、卡片等组件要处理移动端窄屏文本换行或截断。
- 深色模式下必须检查文本、边框、背景、代码块和表单控件对比度。
- 不引入大面积装饰性渐变、光斑、噪声背景或无意义动画。

### API 与服务端编码规范

- Nuxt API 路由层保持薄，只负责鉴权、读取输入、校验、调用业务函数和返回结果。
- API 输入必须使用 Zod 校验。
- API 返回结构应保持稳定，错误格式应统一。
- 需要管理员权限的 API 必须显式调用 `requireAuth(event)` 或等价函数。
- 不在 API 路由中散落复杂 Prisma 查询，复用查询放到 `packages/data-access`。
- 不在日志中输出密码、session、token、Cookie、数据库连接串等敏感信息。
- 服务端函数命名应表达业务动作，例如 `publishPost`、`markMessageAsRead`。

推荐 API 结构：

```ts
export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRouterParam(event, 'id')
  const input = await readValidatedBody(event, updateProjectSchema.parse)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project id is required',
    })
  }

  return updateProject(id, input)
})
```

### Prisma 与数据访问规范

- Prisma Client 只在服务端使用。
- Prisma 查询优先写在 `packages/data-access`。
- 公开查询必须过滤 `published: true`。
- 查询列表时应显式指定排序。
- 返回给客户端的数据应只选择需要字段，避免暴露内部字段。
- 写操作函数命名使用动词开头，例如 `createProject`、`updateArticle`、`deleteTag`。
- 多步骤写入需要考虑事务，必要时使用 `prisma.$transaction`。
- 捕获数据库错误时不要吞掉异常，应转换为明确业务错误或继续抛出。

### 文件与目录命名

- Vue 组件文件使用 PascalCase：`ProjectCard.vue`。
- composable 使用 camelCase，并以 `use` 开头：`useTheme.ts`。
- 普通工具文件使用 kebab-case 或领域名：`date.ts`、`slug.ts`、`api-response.ts`。
- schema 文件按领域命名：`project.ts`、`article.ts`、`auth.ts`。
- data-access 文件按领域命名：`projects.ts`、`articles.ts`、`messages.ts`。
- API 路由遵循 Nuxt 文件路由约定：`index.get.ts`、`[id].patch.ts`。
- 测试文件与被测文件相邻或放在统一测试目录，命名为 `*.test.ts` 或 `*.spec.ts`。

### 导入与导出规范

- 优先使用 workspace 包名导入公共模块，例如 `@ps/shared`。
- 同一模块内相对导入可以使用相对路径，跨包禁止深层相对路径。
- 公共包通过 `src/index.ts` 统一导出稳定 API。
- 避免从公共包内部深路径导入不稳定实现，除非该路径被明确设计为公开入口。
- 删除未使用导入，不保留临时代码。

### 错误处理规范

- 用户可恢复错误要给出明确提示。
- API 错误要带合适 HTTP 状态码。
- 表单错误应定位到字段或表单级错误区域。
- 不在 UI 中直接展示原始数据库错误、堆栈或敏感异常。
- 异步操作必须处理 loading 和 error 状态。

### 测试编码规范

- 核心纯函数、schema、数据转换逻辑优先写单元测试。
- 关键 API 要覆盖成功、非法输入、未登录、无权限、资源不存在等路径。
- 核心用户流程用 Playwright 覆盖，例如登录、创建项目、发布文章、前台展示。
- 测试命名应描述行为，而不是实现细节。
- 不为实现细节写脆弱测试。

## 数据库规范

- schema 变更必须通过 Prisma migration 管理。
- seed 数据应保持可重复执行。
- 公开查询必须过滤 `published: true`。
- 删除操作优先考虑业务影响，必要时使用软删除。
- 项目 slug 必须唯一；文章公开访问使用服务端生成的 `id`。
- 需要发布状态的模型，其发布时间应与发布状态保持一致。

## 环境变量规范

根目录维护 `.env.example`。

推荐变量：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/percy_site"

NUXT_SESSION_SECRET="change-me"
NUXT_PUBLIC_SITE_URL="http://localhost:3000"
NUXT_PUBLIC_ADMIN_URL="http://localhost:3001"

ADMIN_EMAIL="admin@example.com"
ADMIN_INITIAL_PASSWORD="change-me"
```

规则：

- 不提交真实 `.env`。
- 不提交真实密码、token、密钥。
- 服务端变量不加 `NUXT_PUBLIC_`。
- 客户端可见变量必须确认可以公开。

## 依赖管理规范

- 使用 `pnpm` 管理依赖，不混用 `npm`、`yarn` 或其他包管理器。
- 新增第三方依赖前必须确认已有依赖或平台能力是否已经满足需求。
- 新增涉及 Nuxt、Vue、Tailwind、Prisma、Zod、shadcn-vue 等库的代码前，使用 Context7 查询最新官方文档。
- 优先选择维护活跃、类型完善、生态稳定、体积合理的依赖。
- 不为了单个简单函数引入大型工具库。
- 依赖应安装到实际使用它的 workspace 包中，不随意装到根目录。
- 只有多个包都需要的开发工具才放到 workspace root。
- 不手动编辑 lockfile 中的具体依赖解析内容。
- 不提交临时实验依赖。
- 如果替换组件库、ORM、认证库、测试框架等核心依赖，必须同步更新 `docs/design.md` 和本文件。

## 资源与生成文件规范

- 静态资源应按用途归类，例如头像、项目截图、文章封面、OG 图片。
- 图片文件命名使用小写 kebab-case，例如 `portfolio-dashboard-cover.webp`。
- 优先使用 WebP、AVIF 或经过压缩的 PNG/JPEG。
- 不提交本地构建产物、缓存目录、日志文件或临时截图。
- 不提交 `.nuxt`、`.output`、`dist`、`coverage`、`node_modules`。
- 自动生成文件应在文件头或文档中说明来源，避免手动修改后被覆盖。
- Prisma migration 文件可以提交，Prisma Client 生成产物不提交。
- 大型媒体资源如果影响仓库体积，应考虑外部存储或后续接入对象存储。

## 推荐脚本

根目录脚本建议：

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
    "lint:fix": "turbo lint:fix",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "stylelint": "stylelint \"**/*.{css,vue}\"",
    "stylelint:fix": "stylelint \"**/*.{css,vue}\" --fix",
    "spellcheck": "cspell .",
    "commitlint": "commitlint",
    "check": "pnpm format:check && pnpm lint && pnpm stylelint && pnpm spellcheck && pnpm typecheck",
    "db:generate": "pnpm --filter=@ps/db db:generate",
    "db:up": "docker compose up -d postgres",
    "db:down": "docker compose stop postgres",
    "db:migrate": "pnpm --filter=@ps/db db:migrate",
    "db:deploy": "docker compose run --build --rm migrate",
    "db:deploy:local": "pnpm --filter=@ps/db db:deploy",
    "db:studio": "pnpm --filter=@ps/db db:studio",
    "db:seed": "docker compose run --build --rm migrate pnpm --filter @ps/db db:seed",
    "db:seed:local": "pnpm --filter=@ps/db db:seed"
  }
}
```

## 测试与验证

根据改动范围选择验证方式：

- 文档改动：检查 Markdown 结构和链接。
- 类型或 schema 改动：运行 typecheck。
- UI 组件改动：运行对应 app，并使用浏览器检查桌面和移动端。
- API 改动：验证成功、失败、未登录、非法输入等路径。
- 数据库改动：验证 Prisma generate、migration 和 seed。
- 核心流程改动：补充或运行 Playwright E2E。

推荐命令：

```bash
pnpm check
pnpm format:check
pnpm lint
pnpm stylelint
pnpm spellcheck
pnpm typecheck
pnpm test
pnpm build
```

如果项目尚未初始化对应脚本，不要假装已经运行成功，应明确说明未运行原因。

## 变更边界与评审规范

- 每次改动应围绕一个清晰目标展开。
- 不把文档、格式化、重构、功能开发、依赖升级混在一个无边界改动中。
- 修改公共包时，要检查所有引用方影响。
- 修改 `packages/shared` 的 schema 或类型时，要同步检查 web、admin、data-access。
- 修改 Prisma schema 时，要同步考虑 migration、seed、data-access、API 和前端展示。
- 修改鉴权、Cookie、环境变量、部署配置时，要特别说明影响范围。
- 删除文件、字段、API 或公共导出前，先搜索引用。
- 遇到与当前任务无关的既有问题，可以记录或提醒，不要顺手大改。
- 如果发现 `docs/design.md` 与实际实现冲突，应明确指出并建议更新其中之一。

## 文档维护

需要同步更新文档的场景：

- 架构决策变化。
- 新增 app 或 package。
- 数据模型变化。
- API 边界变化。
- 部署方式变化。
- 技术栈变化。
- 重要开发命令变化。

主要文档：

```txt
AGENTS.md        # AI 协作与开发约定
docs/design.md  # 产品和技术设计稿
README.md       # 面向开发者的项目说明，后续补充
```

## 当前架构结论

本项目当前推荐方案：

```txt
apps/
  web/
  admin/

packages/
  db/
  data-access/
  shared/
  ui/
```

当前不推荐新增：

```txt
apps/api
Express
```

除非后续需求明确要求独立后端服务。
