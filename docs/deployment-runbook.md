# Percy Site 生产部署手册

本文档记录 Percy Site 部署到自有服务器的约定。当前服务器还会承载其他项目，所以 Percy Site 不直接占用 `80` / `443` 端口，而是接入服务器级统一入口代理。

## 部署架构

```txt
DNS
  percy.ren        -> server ip
  admin.percy.ren  -> server ip

edge proxy Caddy
  percy.ren        -> percy-web:3000
  admin.percy.ren  -> percy-admin:3000

percy-site-prod
  db       PostgreSQL 17
  migrate  Prisma migrate deploy
  web      apps/web Nuxt server
  admin    apps/admin Nuxt server
```

`deploy/compose.prod.yml` 只包含 Percy 自己的服务，不包含 Caddy。统一入口代理通过外部 Docker 网络 `edge` 访问 `percy-web` 和 `percy-admin`。

## 服务器前置条件

服务器需要安装：

- Docker。
- Docker Compose plugin。
- 一个已经占用 `80` / `443` 的统一入口 Caddy，或者准备将现有项目内的 Caddy 迁移成统一入口 Caddy。

首次部署前创建部署目录：

```bash
mkdir -p /opt/percy-site/scripts
```

部署脚本会自动创建外部网络：

```bash
docker network create edge
```

如果网络已存在，脚本会直接复用。

## 生产环境变量

在服务器部署目录创建 `.env.prod`，不要提交到 Git。

```env
IMAGE_NAMESPACE=registry.example.com/percy
IMAGE_TAG=main-latest

POSTGRES_USER=percy_site
POSTGRES_PASSWORD=replace-with-a-strong-password
POSTGRES_DB=percy_site
DATABASE_URL=postgresql://percy_site:replace-with-a-strong-password@db:5432/percy_site?schema=public

NUXT_SESSION_SECRET=replace-with-a-long-random-secret
NUXT_PUBLIC_SITE_URL=https://percy.ren
NUXT_PUBLIC_ADMIN_URL=https://admin.percy.ren
NUXT_UPLOADS_DIR=/app/storage/uploads

ADMIN_EMAIL=admin@example.com
ADMIN_INITIAL_PASSWORD=replace-with-a-strong-password
```

注意：

- `DATABASE_URL` 的 host 必须是 `db`，这是 compose 内部服务名。
- `NUXT_SESSION_SECRET` 必须是长随机字符串，用于签名后台登录 Cookie。
- `ADMIN_INITIAL_PASSWORD` 只用于 seed 创建初始管理员。生产环境不要使用弱密码。
- 上传文件存储在 Docker volume `uploads_data`，不是数据库字段本身；资源 URL 由 `/uploads/**` 服务端路由从 `NUXT_UPLOADS_DIR` 读取并返回。

## 入口代理

服务器级 Caddy 需要加入同一个 Docker 网络 `edge`，然后添加 Percy 域名配置。

参考配置见 [deploy/edge.Caddyfile.example](../deploy/edge.Caddyfile.example)：

```caddyfile
percy.ren {
  encode zstd gzip
  reverse_proxy percy-web:3000
}

admin.percy.ren {
  encode zstd gzip
  reverse_proxy percy-admin:3000
}
```

如果服务器当前仍由另一个项目内的 Caddy 占用 `80` / `443`，需要把它调整为统一入口代理，或把该 Caddy 连接到 `edge` 网络并追加以上站点配置。不要再为 Percy Site 单独启动第二个绑定 `80` / `443` 的 Caddy。

上传资源发布后可以用下面的方式验证：

```bash
curl -I https://admin.percy.ren/uploads/images/2026/04/example.png
curl -I https://percy.ren/uploads/images/2026/04/example.png
```

正常情况下应返回 `200`，并带有对应的 `Content-Type`。

## GitHub Secrets

先在 GitHub 仓库创建生产环境：

```txt
Settings -> Environments -> New environment -> production
```

如果本地 VS Code 提示 `Value 'production' is not valid`，通常就是这个 GitHub Environment 还没有创建，或者 GitHub Actions 插件没有同步到仓库环境信息。

生产发布工作流需要以下 secrets：

```txt
PROD_SSH_HOST
PROD_SSH_PORT
PROD_SSH_USER
PROD_SSH_PRIVATE_KEY
PROD_DEPLOY_PATH
REGISTRY_HOST
REGISTRY_NAMESPACE
REGISTRY_USERNAME
REGISTRY_PASSWORD
```

含义：

- `PROD_DEPLOY_PATH`：服务器部署目录，例如 `/opt/percy-site`。
- `REGISTRY_HOST`：镜像仓库域名，例如 `ghcr.io` 或私有仓库域名。
- `REGISTRY_NAMESPACE`：镜像命名空间，例如 GitHub 用户名或组织名。

工作流会构建并推送三个镜像：

```txt
percy-site-web
percy-site-admin
percy-site-migrate
```

`main` 分支 CI 成功后会自动触发生产发布，也可以在 GitHub Actions 手动执行 `Deploy` workflow。

## 手动部署

在服务器部署目录执行：

```bash
IMAGE_NAMESPACE=registry.example.com/percy IMAGE_TAG=<git-sha> bash scripts/deploy.sh
```

脚本会执行：

1. 拉取 `web`、`admin`、`migrate` 镜像。
2. 启动 PostgreSQL。
3. 执行 `prisma migrate deploy`。
4. 启动 `web` 和 `admin`。
5. 输出 compose 服务状态。

如果需要同时拉取 PostgreSQL 基础镜像：

```bash
PULL_INFRA_IMAGES=1 IMAGE_NAMESPACE=registry.example.com/percy IMAGE_TAG=<git-sha> bash scripts/deploy.sh
```

## 回滚

回滚到某个已推送镜像 tag：

```bash
bash scripts/rollback.sh <image-tag>
```

回滚脚本本质上会用指定 `IMAGE_TAG` 重新执行部署。数据库 migration 已经执行过的变更不会自动回退，如果涉及破坏性 schema 变更，需要单独制定数据库回滚方案。

## 验收

发布后检查：

```bash
docker compose --project-name percy-site-prod --env-file .env.prod -f compose.prod.yml ps
curl -I https://percy.ren
curl -I https://admin.percy.ren
```

浏览器验证：

- `https://percy.ren` 可访问前台。
- `https://admin.percy.ren` 可访问后台登录页。
- 后台上传资源后，前台文章中的图片仍可访问。
