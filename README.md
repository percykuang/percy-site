# Percy Site

Percy Site 是我的个人主页与内容管理系统。

它用来承载个人介绍、技术文章、资源管理和长期维护的产品化实验。项目关注干净的界面、稳定的工程结构，以及从内容创作到发布上线的完整链路。

当前生产环境中，Percy Site 只负责自身应用、数据库和上传资源，不直接托管公网入口代理；域名入口统一由独立的 `edge-proxy` 服务接管，再通过 Docker `edge` 网络转发到 `percy-web` 和 `percy-admin`。

主页链接：https://percy.ren

## Links

- [产品与架构设计](docs/design.md)
- [内容表达规范](docs/content-guidelines.md)
- [开发指南](docs/development.md)
- [资源管理设计](docs/resource-management.md)
- [生产部署手册](docs/deployment-runbook.md)
- [AI 协作约定](AGENTS.md)
