# Percy Site 资源管理设计稿

## 1. 背景

当前项目已经支持文章图片展示，并且文章正文基于 Markdown 渲染。随着内容能力继续扩展，后续很可能需要支持：

- 图片
- 音频
- 视频
- 其他可下载文件

如果继续让资源地址直接散落在文章正文或表单字段中，后续会出现这些问题：

- 资源上传入口不统一
- 文件元数据不可追踪
- 无法知道资源被哪些文章引用
- 删除资源时容易误删线上内容
- 音视频后续接入封面、播放地址、时长等能力时没有承载域

因此需要在后台新增独立的“资源管理”能力，并将资源托管、元数据、引用关系和文章编辑联动统一收口。

## 2. 当前正式方案

当前正式方案已经明确：

```txt
资源文件由 Percy Site 自有云服务器存储
不以阿里云 OSS 作为当前或中期主线路
```

这意味着后续资源管理的设计、实现和文档，都应围绕“自有服务器文件存储”展开，而不是继续以 OSS 直传为默认前提。

## 3. 设计目标

资源管理第一阶段的目标：

- 在后台提供独立的“资源管理”导航与页面
- 支持上传并管理图片、音频、视频等多媒体资源
- 文件写入自有云服务器的受控目录
- 后台数据库保存资源记录和业务元数据
- 为文章编辑器提供可插入资源的能力
- 为后续音频、视频嵌入打基础

第一阶段不追求一次性做成完整媒资平台，不做复杂工作流堆叠。

## 4. 非目标

第一阶段暂不纳入以下能力：

- 图片裁剪、编辑、批量压缩
- 音频波形可视化编辑
- 视频时间轴剪辑
- 多版本转码工作流编排后台
- 外部公开上传接口
- 滚轮缩放、复杂媒体工作台交互

这些能力都可以在后续需求稳定后再逐步追加。

## 5. 术语与命名

产品层使用“资源管理”这个名称，符合后台用户心智。

技术域建议统一使用 `resource` 命名，而不是继续沿用当前数据库里的 `Asset`：

- 后台导航：资源管理
- Prisma 模型：`Resource`
- shared 子路径：`@ps/shared/resource`
- data-access 文件：`resources.ts`
- admin API：`/api/resources/*`

原因：

- `Asset` 语义偏窄，也容易和前端静态资源混淆
- `Resource` 更贴近后台能力本身
- 未来同时承载图片、音频、视频、附件时更自然

## 6. 存储方案

### 6.1 正式存储方式

第一阶段与中期方案统一采用：

```txt
浏览器 -> admin API -> 自有云服务器文件目录 -> 数据库落库
```

这是 Percy Site 当前最务实的方案，原因是：

- 你已经有自有云服务器
- 当前资源量可控
- 项目规模暂不需要云厂商媒资平台能力
- 可以更快把资源管理产品面做出来

### 6.2 为什么当前不继续围绕 OSS 设计

如果继续围绕 OSS 设计，会额外引入：

- STS / 签名上传
- 云厂商权限策略
- bucket / object key 管理
- 外部存储 SDK 依赖

而这些复杂度，对于当前 Percy Site 的第一阶段资源管理来说，收益不高。

当前更重要的是：

- 统一上传入口
- 统一管理资源记录
- 建立资源引用关系
- 让文章编辑可以使用资源库

### 6.3 是否需要保留 provider 抽象

当前既然已经明确“大概率以后也不会使用 OSS”，就不需要为了未来预留过重的 provider 抽象。

但是，仍然建议保留少量存储字段，让数据模型具备基本清晰度，例如：

- `storageKey`
- `url`
- `type`
- `mimeType`

也就是说：

- 不做云存储 provider 插件化
- 但仍然做正式资源建模

## 7. 文件系统目录设计

建议在服务器上使用固定的资源根目录，例如：

```txt
/var/www/percy-site/uploads
```

目录按资源类型和日期分桶：

```txt
/uploads
  /images/2026/04/
  /audio/2026/04/
  /videos/2026/04/
  /files/2026/04/
```

建议文件名不要直接使用原始文件名，推荐：

```txt
<resource-id>.<ext>
```

例如：

```txt
images/2026/04/clx123abc.webp
videos/2026/04/clx456def.mp4
```

这样有几个好处：

- 路径稳定
- 不受原始文件名中空格、中文、特殊字符影响
- 更适合服务端删除、排查、引用追踪

当前实现默认使用仓库内的开发目录：

```txt
storage/uploads
```

生产环境可以通过环境变量覆盖：

```txt
NUXT_UPLOADS_DIR=/var/www/percy-site/uploads
```

如果使用当前 Docker Compose 部署，`web` 和 `admin` 会共享同一个上传卷，
本地 compose 名称是 `uploads-data`，生产 compose 名称是 `uploads_data`，
并挂载到容器内的：

```txt
/app/storage/uploads
```

## 8. 静态访问路径设计

资源文件建议通过稳定路径对外访问，而不是走资源业务 API 回传二进制内容。
当前实现中，`/uploads/**` 是 Nuxt 服务端路由，会从 `NUXT_UPLOADS_DIR`
指向的运行时目录读取文件并返回。

推荐两种路径方案：

### 8.1 推荐方案

独立静态子域名：

```txt
https://static.percy.ren/uploads/images/2026/04/clx123abc.webp
```

优点：

- 静态资源和业务域解耦
- 更适合后续缓存控制
- 未来如接 CDN，迁移成本更低

### 8.2 简化方案

挂在主站域名下：

```txt
https://percy.ren/uploads/images/2026/04/clx123abc.webp
```

第一阶段如果部署和域名管理还没拆开，可以先用这个方案。

## 9. 上传链路设计

### 9.1 推荐方案

推荐：

```txt
浏览器 -> admin API 上传文件 -> 服务端写入本地目录 -> 服务端落库 -> 返回资源 DTO
```

链路拆分如下：

1. 后台前端选择文件
2. 调用 `POST /api/resources`
3. admin 服务端校验登录态、文件类型、大小
4. admin 服务端生成资源 id 和目标目录
5. admin 服务端将文件写入服务器目录
6. admin 服务端读取或推断元数据
7. admin 服务端写入数据库资源记录
8. 返回可用于后台展示和文章插入的资源 DTO

### 9.2 为什么当前不需要前端直传

当前资源正式存储在你自己的服务器上，因此前端直传云对象存储的链路没有必要。

现阶段直接由 admin API 处理上传的好处是：

- 实现更直接
- 上传策略更集中
- 目录规则更容易统一
- 更适合第一阶段快速上线

### 9.3 未来边界

如果未来视频文件明显变大、上传体验成为瓶颈，再考虑升级为分片上传或专门的媒资处理链路。

当前第一阶段不需要为此提前复杂化。

## 10. 资源数据模型设计

当前 Prisma 中已有一个 `Asset` 模型，但字段过少，只能表达非常基础的图片/文件信息，无法支撑资源中心。

建议第一阶段把它升级或迁移为 `Resource` 模型。

### 10.1 建议字段

```prisma
enum ResourceType {
  IMAGE
  AUDIO
  VIDEO
  FILE
}

enum ResourceStatus {
  READY
  PROCESSING
  FAILED
  DELETED
}

model Resource {
  id               String         @id @default(cuid())
  type             ResourceType
  status           ResourceStatus @default(READY)
  storageKey       String         @unique
  url              String
  originalFilename String
  title            String?
  alt              String?
  mimeType         String
  extension        String?
  size             Int
  width            Int?
  height           Int?
  durationMs       Int?
  coverUrl         String?
  checksum         String?
  createdBy        String?
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  @@index([type, status, createdAt])
  @@index([createdBy, createdAt])
}
```

### 10.2 字段说明

- `type`：资源类型，决定 UI 展示和后续处理流
- `status`：可用、处理中、失败、删除等状态
- `storageKey`：服务器内的相对路径，例如 `images/2026/04/clx123.webp`
- `url`：最终可访问的资源地址
- `title` / `alt`：后台录入的展示元数据
- `width` / `height`：图片或视频封面尺寸
- `durationMs`：音频、视频时长
- `coverUrl`：音频封面或视频封面
- `checksum`：后续用于查重或重复上传检测

## 11. 引用关系设计

资源管理如果只保存资源记录，不记录引用关系，后续删除资源时会非常危险。

建议增加资源引用关系表。

```prisma
enum ResourceRefType {
  ARTICLE_CONTENT
  ARTICLE_COVER
}

model ResourceReference {
  id         String          @id @default(cuid())
  resourceId String
  refType    ResourceRefType
  refId      String
  createdAt  DateTime        @default(now())

  resource   Resource        @relation(fields: [resourceId], references: [id], onDelete: Cascade)

  @@index([resourceId, refType])
  @@index([refType, refId])
}
```

第一阶段至少要覆盖：

- 文章封面引用
- 文章正文中的图片引用

这样后台资源页才能支持：

- 判断资源是否已被引用
- 查看被哪些文章使用
- 阻止误删

## 12. Markdown 与资源的关系

### 12.1 图片

图片第一阶段可以继续走标准 Markdown：

```md
![图片说明](https://static.percy.ren/uploads/images/2026/04/clx123.webp '图片标题')
```

这是当前最省成本、兼容性最好的方式。

### 12.2 音频与视频

音频和视频不能简单照搬图片方案。

原因：

- 当前项目使用 `markdown-it`
- 当前渲染器配置 `html: false`
- 这意味着不能依赖文章作者直接写原生 `<audio>` 或 `<video>` HTML

所以如果后续要在文章正文里插入音频、视频，推荐新增受控的资源短码语法，而不是直接开放原始 HTML。

推荐的第二阶段方向：

```md
{{ resource:image:res_xxx }}
{{ resource:audio:res_xxx }}
{{ resource:video:res_xxx }}
```

由服务端 Markdown 渲染层在 `server/utils/markdown.ts` 中解析这些短码，并渲染为统一的 HTML 结构。

这样做的好处：

- 可以直接引用资源 id，而不是把服务器静态地址写死在正文里
- 后续替换资源、迁移静态域名都更容易
- 有利于维护资源引用关系

### 12.3 第一阶段建议

第一阶段先不急着把音频、视频正文嵌入做完。

更合理的是：

- 资源模型和上传链路先支持图片、音频、视频
- 编辑器先只提供图片插入
- 音频、视频展示语法在第二阶段设计并实现

## 13. 后台页面设计

建议在后台主导航新增：

```txt
/resources
```

页面名称：资源管理

### 13.1 第一阶段页面能力

- 资源上传
- 资源列表
- 按类型筛选
- 搜索文件名 / 标题
- 复制资源地址
- 删除资源
- 预览图片
- 查看基础元数据

### 13.2 列表字段建议

- 缩略图 / 文件类型图标
- 文件名
- 资源类型
- MIME Type
- 文件大小
- 尺寸 / 时长
- 上传时间
- 引用状态
- 操作列

### 13.3 操作列建议

- 复制地址
- 复制 Markdown 图片语法
- 查看详情
- 删除

### 13.4 文章编辑页联动

文章编辑页后续建议补一个资源选择器：

- 从资源库选图
- 一键插入 Markdown 图片语法
- 封面图从资源库选择

这样可以避免用户每次都手动粘贴 URL。

## 14. Admin API 设计

推荐新增接口：

```txt
POST   /api/resources
GET    /api/resources
GET    /api/resources/[id]
PATCH  /api/resources/[id]
DELETE /api/resources/[id]
GET    /api/resources/[id]/references
```

### 14.1 接口职责

- `POST /api/resources`
  - 校验登录态
  - 校验文件大小、类型
  - 生成资源路径
  - 写入服务器目录
  - 落库并返回资源 DTO

- `GET /api/resources`
  - 列表查询
  - 支持分页、类型筛选、关键词搜索

- `PATCH /api/resources/[id]`
  - 编辑 `title`、`alt` 等元数据

- `DELETE /api/resources/[id]`
  - 默认只允许删除未引用资源
  - 删除数据库记录前同步删除本地文件，或先软删除再异步清理

## 15. 包与模块落位

### 15.1 packages/shared

建议新增：

- `@ps/shared/resource`
  - `createResourceSchema`
  - `updateResourceSchema`
  - `resourceTypeSchema`
  - `resourceStatusSchema`
  - `adminResourceItem`

### 15.2 packages/data-access

建议新增：

- `resources.ts`
  - `createResourceRecord`
  - `listResources`
  - `getResourceById`
  - `updateResource`
  - `deleteResource`
  - `listResourceReferences`
  - `upsertArticleResourceReferences`

### 15.3 apps/admin

建议新增：

- 页面：`app/pages/resources/index.vue`
- 组件：`app/components/resources/*`
- API：`server/api/resources/*`
- 服务端存储工具：`server/utils/resource-storage.ts`

### 15.4 apps/web

第一阶段前台无需新增资源中心页面。

前台只需要：

- 正常消费图片 URL
- 后续在文章渲染层支持资源短码解析

## 16. 安全与权限

资源上传要特别注意这几件事：

- 只允许登录管理员上传
- 服务端必须校验允许上传的 MIME type 和大小
- 文件扩展名不能只信客户端传值
- 路径不能由客户端自由指定
- 删除资源前必须校验引用关系

### 16.1 建议限制

第一阶段建议至少加这些限制：

- 图片：
  - `image/jpeg`
  - `image/png`
  - `image/webp`
  - 可选 `image/gif`
- 音频：
  - `audio/mpeg`
  - `audio/wav`
  - `audio/ogg`
- 视频：
  - `video/mp4`
  - `video/webm`

并加大小限制，例如：

- 图片：`<= 10MB`
- 音频：`<= 30MB`
- 视频：`<= 100MB`

如果当前阶段想更克制，可以先只开放图片上传。

## 17. 备份与运维

既然资源文件正式存储在自有服务器上，就必须把备份和恢复纳入正式设计。

建议至少具备：

- 上传目录定时备份
- 数据库定时备份
- 备份文件异机保存或同步到冷存储

否则一旦服务器磁盘损坏，数据库中的资源记录还在，但实际文件已经丢失。

## 18. 分阶段落地建议

### 阶段一：资源中心基础版

- 新增 `Resource` 模型
- 服务端本地上传
- 后台资源列表与上传
- 文章插入图片
- 资源引用关系记录

### 阶段二：音视频能力版

- 音频/视频元数据提取
- 音频/视频正文短码语法
- 视频封面

### 阶段三：增强版

- 静态资源独立子域名
- 缓存策略
- 查重
- 资源替换
- 更多引用关系
- 批量上传

## 19. 当前建议结论

对于 Percy Site，当前最合适的方案不是继续围绕 OSS 或完整媒资平台设计，而是：

```txt
后台新增资源管理
第一阶段以自有云服务器存储 + 资源落库 + 图片插入为主
数据库与 API 按图片/音频/视频统一建模
音视频正文嵌入能力放到第二阶段
```

这条路线最平衡：

- 能尽快解决当前图片管理问题
- 架构和实现成本都更低
- 不会为了未来场景过度设计
- 与当前项目规模和运维条件更匹配
