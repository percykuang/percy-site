# Percy Site

Percy Site 是一个基于 Nuxt、Vue 3、TypeScript、Tailwind CSS、Prisma 和 PostgreSQL 的个人主页与后台管理系统。

完整设计见 [docs/design.md](docs/design.md)，项目协作约定见 [AGENTS.md](AGENTS.md)。

## 目录

```txt
apps/
  web      # 个人主页前台
  admin    # 管理后台

packages/
  db           # Prisma schema/client/migrations
  data-access  # 共享数据访问逻辑
  shared       # 类型、Zod schema、常量、工具
  ui           # 公共 Vue 组件
  config       # 共享工程配置
```

## 常用命令

推荐本地环境：

```txt
Node.js >= 22.12.0
pnpm >= 10.18.2
```

项目提供 `.node-version`、`.npmrc`、`.editorconfig`、`.gitattributes` 和 `.vscode` workspace 配置，用于统一 Node 版本、pnpm 行为、编辑器格式、换行符和 VS Code 推荐插件。

```bash
pnpm install
pnpm db:generate
pnpm db:up
pnpm db:deploy
pnpm db:seed
pnpm dev
pnpm dev:web
pnpm dev:admin
pnpm format
pnpm format:check
pnpm lint
pnpm lint:fix
pnpm stylelint
pnpm spellcheck
pnpm check
pnpm db:migrate
pnpm typecheck
pnpm build
```

本地首次启动建议流程：

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:up
pnpm db:deploy
pnpm db:seed
pnpm dev:web
pnpm dev:admin
```

质量检查约定：

- `pnpm format`：使用 Prettier 格式化全仓库，并自动排序 Tailwind class。
- `pnpm lint` / `pnpm lint:fix`：使用 ESLint 检查 TypeScript、Vue 和 Nuxt 代码。
- `pnpm stylelint` / `pnpm stylelint:fix`：检查 CSS 和 Vue style。
- `pnpm spellcheck`：使用 CSpell 检查英文拼写和项目词典。
- `pnpm check`：提交或合并前的全量检查入口。
- Git hooks 会在提交前运行 `lint-staged`，并在提交信息阶段运行 commitlint。

本地执行数据库相关命令前，先启动 PostgreSQL：

```bash
pnpm db:up
pnpm db:deploy
pnpm db:seed
```

健康检查接口：

```txt
web:   GET http://localhost:3000/api/health
admin: GET http://localhost:3001/api/health
```

CI 会在 push 到 `main` 或创建 Pull Request 时运行：

```bash
pnpm install --frozen-lockfile
pnpm db:generate
pnpm check
pnpm build
```

## Docker 部署

当前 Docker 配置包含：

- `postgres`：PostgreSQL 17 数据库。
- `migrate`：执行 `prisma migrate deploy`。
- `web`：个人主页前台，默认映射到 `3000`。
- `admin`：管理后台，默认映射到 `3001`。

复制 Docker 环境变量示例：

```bash
cp .env.docker.example .env
```

启动 PostgreSQL、迁移任务、前台和后台：

```bash
pnpm docker:up
```

首次启动会自动执行 `packages/db/prisma/migrations` 下的数据库迁移。需要在 Docker 网络内初始化演示数据或管理员账号时，可在服务启动后执行：

```bash
docker compose run --rm migrate pnpm --filter @ps/db db:seed
```

后台管理员账号由 seed 根据 `.env` 中的 `ADMIN_EMAIL` 和 `ADMIN_INITIAL_PASSWORD` 创建，密码会以哈希形式写入数据库。未执行 seed 前，后台登录页无法登录。

默认访问地址：

```txt
web:   http://localhost:3000
admin: http://localhost:3001
```

单独构建镜像：

```bash
pnpm docker:build:web
pnpm docker:build:admin
```

也可以直接指定要构建的应用：

```bash
docker build --target runner --build-arg APP=web -t percy-site-web .
docker build --target runner --build-arg APP=admin -t percy-site-admin .
```

停止服务：

```bash
pnpm docker:down
```

注意：生产环境必须替换 `.env` 中的 `POSTGRES_PASSWORD`、`DATABASE_URL`、`NUXT_SESSION_SECRET`、`ADMIN_INITIAL_PASSWORD` 等敏感配置。
