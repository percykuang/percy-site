export type SeedArticle = {
  category: string
  categorySlug: string
  content: string[]
  excerpt: string
  publishedAt: Date
  slug: string
  tags: Array<{
    name: string
    slug: string
  }>
  title: string
}

export const seedArticles: SeedArticle[] = [
  {
    category: '前端工程',
    categorySlug: 'frontend-engineering',
    content: [
      '这是一篇专门用于检查 Markdown 渲染效果的示例文章。它会覆盖标题、段落、链接、列表、引用、表格、行内代码和代码块，方便在真实页面里观察排版节奏。',
      '## 二级标题：内容层级',
      '二级标题通常用于承载文章里的主要章节。正文需要保持稳定的阅读宽度、清晰的行高，以及足够克制的段落间距。',
      '在文章里可以插入一个链接，例如访问 [Nuxt 官方文档](https://nuxt.com/) 了解服务端渲染和 API 路由，也可以使用 `useFetch`、`defineEventHandler` 这类行内代码描述具体 API。',
      '### 三级标题：无序列表',
      '无序列表适合表达并列信息：',
      '- 保持页面结构干净，不为装饰牺牲可读性。',
      '- 让标题、段落、列表和代码块拥有一致的视觉节奏。',
      '- 把复杂交互拆成稳定、可恢复、可验证的状态。',
      '### 三级标题：有序列表',
      '有序列表更适合描述流程：',
      [
        '1. 先明确页面里的主要信息和次要信息。',
        '2. 再确定标题、正文、辅助信息之间的层级。',
        '3. 最后通过真实内容检查间距、字号和换行效果。',
      ].join('\n'),
      '#### 四级标题：嵌套内容',
      '列表中偶尔会出现更细的说明，此时需要保证缩进不会破坏整体阅读体验：',
      [
        '- 文章详情页',
        '  - 标题区要足够紧凑。',
        '  - 正文区要保证长文阅读舒适。',
        '- 文章列表页',
        '  - 日期、标题、摘要之间要有明确主次。',
        '  - 分组信息不应该抢占正文内容的注意力。',
      ].join('\n'),
      '> 好的排版不是把所有元素都做得显眼，而是让读者在需要时能够自然识别它们。',
      '##### 五级标题：表格',
      [
        '| 元素 | 使用场景 | 设计重点 |',
        '| --- | --- | --- |',
        '| 标题 | 划分内容层级 | 字重清晰，间距稳定 |',
        '| 列表 | 展示并列信息或步骤 | 缩进自然，行距舒适 |',
        '| 代码块 | 展示实现片段 | 字体清晰，工具栏克制 |',
        '| 引用 | 强调观点或补充说明 | 不抢正文层级 |',
      ].join('\n'),
      '---',
      '###### 六级标题：代码示例',
      '下面是一段 TypeScript 示例，用来检查代码块的工具栏、字体、行高和高亮效果：',
      '```ts\ntype ArticleMeta = {\n  title: string\n  category: string\n  tags: string[]\n  wordCount: number\n}\n\nfunction formatArticleMeta(meta: ArticleMeta) {\n  return `${meta.title} / ${meta.category} / ${meta.wordCount} 字`\n}\n```',
      '再看一段 Vue 示例，主要用于观察模板缩进和不同语言标签的展示：',
      '```vue\n<script setup lang="ts">\ntype Props = {\n  title: string\n  description: string\n}\n\ndefineProps<Props>()\n</script>\n\n<template>\n  <article class="space-y-3">\n    <h2>{{ title }}</h2>\n    <p>{{ description }}</p>\n  </article>\n</template>\n```',
      '最后是一段普通段落，包含 **加粗文本**、`inline code` 和链接，确保基础文本元素在同一段里也能保持协调。',
    ],
    excerpt: '用于检查文章详情页中标题、列表、链接、引用、表格和代码块等 Markdown 元素的完整示例。',
    publishedAt: new Date('2026-04-28T09:00:00.000Z'),
    slug: 'markdown-rendering-showcase',
    tags: [
      {
        name: 'Markdown',
        slug: 'markdown',
      },
      {
        name: 'UI',
        slug: 'ui',
      },
    ],
    title: 'Markdown 排版完整示例',
  },
  {
    category: '前端工程',
    categorySlug: 'frontend-engineering',
    content: [
      '## 先定义边界',
      '组件系统不是把按钮、输入框和弹窗堆在一起，而是把产品里反复出现的交互规则、视觉约束和状态表达沉淀下来。',
      '我更倾向于先在真实业务中观察重复，再决定是否抽象。过早抽象会让组件变成配置集合，真实使用时反而更难维护。',
      '```ts\ntype ButtonVariant = "primary" | "secondary" | "ghost"\n\ntype ButtonProps = {\n  variant?: ButtonVariant\n  disabled?: boolean\n}\n```',
      '## 让调用者表达意图',
      '一个稳定的组件系统应该让调用者少思考样式细节，多关注业务意图。它需要清晰的 props、稳定的状态边界，也需要和设计 token、表单校验、可访问性约定一起工作。',
    ],
    excerpt: '从真实业务出发，聊聊组件边界、状态建模和设计 token 如何共同支撑长期维护。',
    publishedAt: new Date('2026-04-28T08:00:00.000Z'),
    slug: 'building-maintainable-component-systems',
    tags: [
      {
        name: 'Components',
        slug: 'components',
      },
      {
        name: 'Design System',
        slug: 'design-system',
      },
    ],
    title: '构建一个可维护的组件系统',
  },
  {
    category: 'AI 应用',
    categorySlug: 'ai-application',
    content: [
      'AI 应用的核心不只是调用模型接口，而是把不确定的模型输出放进可理解、可恢复、可验证的产品流程里。',
      '用户需要知道系统正在做什么、为什么这样回答、失败后还能怎么继续。前端在这里承担的是反馈链路、状态表达和交互节奏的设计。',
      '```vue\n<script setup lang="ts">\nconst status = ref<"idle" | "streaming" | "done">("idle")\n</script>\n```',
      '好的 AI 产品体验通常不是更炫的动效，而是更稳定的预期：输入清晰、等待可感知、结果可编辑、错误可恢复。',
    ],
    excerpt: '模型能力不是产品体验本身，交互反馈、状态设计和工程约束才是落地关键。',
    publishedAt: new Date('2026-04-24T08:00:00.000Z'),
    slug: 'frontend-thinking-in-ai-products',
    tags: [
      {
        name: 'AI',
        slug: 'ai',
      },
      {
        name: 'Product',
        slug: 'product',
      },
    ],
    title: 'AI 产品里的前端思考',
  },
  {
    category: '产品界面',
    categorySlug: 'product-interface',
    content: [
      '极简不是删除信息，而是让信息按照更清楚的秩序出现。页面里的每一块留白、分割线和字号层级都应该服务于理解。',
      '在 B 端产品中，用户经常需要反复完成同一批任务。界面如果只追求第一眼好看，而忽略扫描效率和状态反馈，长期使用成本会很高。',
      '我喜欢克制的视觉表达：少一点装饰，多一点对齐、节奏和一致性。它看起来安静，但背后依赖很多细节判断。',
    ],
    excerpt: '极简不是少做，而是把信息、动作和状态放在更清晰的位置。',
    publishedAt: new Date('2026-04-20T08:00:00.000Z'),
    slug: 'minimal-interface-is-structured-interface',
    tags: [
      {
        name: 'UI',
        slug: 'ui',
      },
      {
        name: 'Minimal',
        slug: 'minimal',
      },
    ],
    title: '极简界面背后的信息结构',
  },
  {
    category: '性能优化',
    categorySlug: 'performance-optimization',
    content: [
      '性能优化不应该只发生在项目最后阶段。很多性能问题在组件拆分、数据请求和资源加载策略确定时就已经埋下了。',
      '前端性能的重点不是记住所有指标，而是理解用户会在哪里等待、哪里会感到卡顿，以及哪些成本可以提前避免。',
      '可持续的性能优化需要可观测、可回归、可解释。否则每一次优化都只是一次临时修补。',
    ],
    excerpt: '性能不是上线前的补救动作，而是贯穿架构、组件和数据流设计的长期约束。',
    publishedAt: new Date('2026-04-16T08:00:00.000Z'),
    slug: 'performance-is-not-the-last-step',
    tags: [
      {
        name: 'Performance',
        slug: 'performance',
      },
      {
        name: 'Web',
        slug: 'web',
      },
    ],
    title: '性能优化不是最后一步',
  },
  {
    category: '工程规范',
    categorySlug: 'engineering-standards',
    content: [
      '代码规范的价值不是统一喜好，而是降低协作成本。好的规范应该让团队在无关紧要的问题上少争论，在重要问题上更容易发现风险。',
      'TypeScript、ESLint、Prettier、Stylelint 和提交检查不是为了制造流程，而是把低级错误前置到开发阶段。',
      '规范也需要克制。如果一条规则不能提升质量、降低风险或改善协作，它就应该被重新审视。',
    ],
    excerpt: '工程规范应该服务于协作和质量，而不是变成额外的仪式感。',
    publishedAt: new Date('2026-04-12T08:00:00.000Z'),
    slug: 'engineering-rules-that-scale',
    tags: [
      {
        name: 'DX',
        slug: 'dx',
      },
      {
        name: 'Quality',
        slug: 'quality',
      },
    ],
    title: '能长期运行的前端工程规范',
  },
  {
    category: 'Nuxt',
    categorySlug: 'nuxt',
    content: [
      'Nuxt 的服务端能力让很多中小型全栈场景不再需要额外维护一层 Express 服务。对个人站、内容管理和轻量后台来说，这能显著降低复杂度。',
      '但这不意味着所有后端逻辑都应该写进页面。API 路由仍然需要保持薄，复杂数据访问应该沉淀到独立包里。',
      '好的边界不是技术栈名字决定的，而是依赖方向、运行环境和部署方式一起决定的。',
    ],
    excerpt: '聊聊 Nuxt 项目里前台、后台、server API 和数据访问包之间的边界。',
    publishedAt: new Date('2026-04-08T08:00:00.000Z'),
    slug: 'nuxt-app-boundaries',
    tags: [
      {
        name: 'Nuxt',
        slug: 'nuxt',
      },
      {
        name: 'Architecture',
        slug: 'architecture',
      },
    ],
    title: 'Nuxt 应用里的边界感',
  },
  {
    category: '设计系统',
    categorySlug: 'design-system',
    content: [
      '设计 token 的重点不是把颜色变量化，而是让视觉决策有稳定的命名和使用边界。',
      '当一个项目开始同时拥有前台、后台和公共组件包时，颜色、间距、圆角和状态表达需要逐步统一。',
      '我更喜欢从少量 token 开始，等重复模式真实出现后再扩展，而不是一开始设计一整套复杂主题。',
    ],
    excerpt: '从颜色、间距和状态表达开始，让 UI 体系更容易跨页面保持一致。',
    publishedAt: new Date('2026-04-04T08:00:00.000Z'),
    slug: 'design-token-for-small-products',
    tags: [
      {
        name: 'Token',
        slug: 'token',
      },
      {
        name: 'Tailwind',
        slug: 'tailwind',
      },
    ],
    title: '小型产品也需要设计 Token 吗',
  },
  {
    category: '复盘',
    categorySlug: 'review',
    content: [
      '个人网站是一个很适合练习产品判断的项目。它足够小，但会涉及信息架构、视觉风格、内容策略、工程配置和部署方式。',
      '我不希望它只是一个静态简历页，而是一个可以长期维护、持续写作和展示思考的空间。',
      '第一版最重要的是克制：先把身份、文章和关于页做好，项目和联系入口等内容成熟后再逐步恢复。',
    ],
    excerpt: '一个个人站也可以承载清晰的产品判断、工程边界和长期维护意识。',
    publishedAt: new Date('2026-04-01T08:00:00.000Z'),
    slug: 'personal-site-as-a-product',
    tags: [
      {
        name: 'Personal Site',
        slug: 'personal-site',
      },
      {
        name: 'Review',
        slug: 'review',
      },
    ],
    title: '把个人网站当作一个产品来做',
  },
  {
    category: 'AI 应用',
    categorySlug: 'ai-application',
    content: [
      'AI 应用开发里，提示词只是入口。真正影响体验的是上下文组织、工具调用、流式反馈和结果校正。',
      '我更关心模型能力如何被产品流程吸收：用户什么时候输入，系统什么时候追问，结果如何回到可编辑状态。',
      '如果把 AI 只当成一个接口，产品很容易变成一次性生成器；如果把它看成协作能力，界面和工程边界都会不一样。',
    ],
    excerpt: '从上下文、工具调用和可编辑结果出发，重新理解 AI 应用里的前端职责。',
    publishedAt: new Date('2025-12-18T08:00:00.000Z'),
    slug: 'ai-application-as-collaboration',
    tags: [
      {
        name: 'AI',
        slug: 'ai',
      },
      {
        name: 'Workflow',
        slug: 'workflow',
      },
    ],
    title: '把 AI 能力放进协作流程',
  },
  {
    category: '前端工程',
    categorySlug: 'frontend-engineering',
    content: [
      '稳定的前端架构通常不是靠一开始画出完美分层，而是在真实业务变化里不断修正边界。',
      '页面、组件、数据访问、类型和校验之间应该有清晰的依赖方向。边界清楚以后，重构和扩展才不会牵一发动全身。',
      '我喜欢让代码结构尽量接近业务语言，而不是把所有东西都抽象成通用工具。',
    ],
    excerpt: '边界比目录名更重要，清晰的依赖方向能让前端项目在变化中保持稳定。',
    publishedAt: new Date('2025-09-06T08:00:00.000Z'),
    slug: 'frontend-architecture-needs-clear-boundaries',
    tags: [
      {
        name: 'Architecture',
        slug: 'architecture',
      },
      {
        name: 'Frontend',
        slug: 'frontend',
      },
    ],
    title: '前端架构需要清晰的边界',
  },
  {
    category: '产品界面',
    categorySlug: 'product-interface',
    content: [
      'B 端界面的难点不是信息多，而是信息之间的优先级经常变化。一个页面需要同时支持浏览、比较、筛选和操作。',
      '这类界面不能只追求视觉干净，还要考虑用户每天重复使用时的扫描路径和操作成本。',
      '好的密度感来自层级、对齐和状态，而不是简单地把所有元素缩小。',
    ],
    excerpt: 'B 端产品需要的不是装饰感，而是能支撑长期使用的扫描效率和操作秩序。',
    publishedAt: new Date('2025-05-21T08:00:00.000Z'),
    slug: 'interface-density-for-work-tools',
    tags: [
      {
        name: 'B2B',
        slug: 'b2b',
      },
      {
        name: 'UI',
        slug: 'ui',
      },
    ],
    title: '工作型界面的信息密度',
  },
  {
    category: '工程规范',
    categorySlug: 'engineering-standards',
    content: [
      'Monorepo 的价值不是把所有项目放进一个仓库，而是让共享边界、构建流程和版本约束变得更明确。',
      '公共包应该服务于真实复用，而不是提前把所有代码都抽出去。过早共享会让包变成另一个耦合点。',
      '当 web、admin 和公共包共存时，依赖方向和脚本约定比目录结构本身更重要。',
    ],
    excerpt: 'Monorepo 不是银弹，它真正解决的是共享边界、工程流程和依赖方向的问题。',
    publishedAt: new Date('2024-11-14T08:00:00.000Z'),
    slug: 'monorepo-is-about-boundaries',
    tags: [
      {
        name: 'Monorepo',
        slug: 'monorepo',
      },
      {
        name: 'DX',
        slug: 'dx',
      },
    ],
    title: 'Monorepo 解决的是边界问题',
  },
  {
    category: '性能优化',
    categorySlug: 'performance-optimization',
    content: [
      '页面性能并不只是 Lighthouse 分数。真实体验里，用户更敏感的是首屏是否快速稳定、交互是否及时、内容是否不断跳动。',
      '我会优先关注关键内容的加载顺序、图片尺寸、客户端脚本数量和数据请求时机。',
      '性能优化最怕没有基线。没有基线时，很难判断一次改动到底是优化还是错觉。',
    ],
    excerpt: '比起追逐单个分数，更重要的是建立可解释、可回归的性能判断方式。',
    publishedAt: new Date('2024-07-09T08:00:00.000Z'),
    slug: 'web-performance-needs-a-baseline',
    tags: [
      {
        name: 'Performance',
        slug: 'performance',
      },
      {
        name: 'Web',
        slug: 'web',
      },
    ],
    title: '前端性能需要一条基线',
  },
  {
    category: '设计系统',
    categorySlug: 'design-system',
    content: [
      '组件库和设计系统经常被混在一起讨论，但它们解决的问题并不完全相同。',
      '组件库关注可复用的实现，设计系统关注更高层的视觉语言、交互原则和决策一致性。',
      '在小团队里，两者可以逐步合并，但不要把一组组件误认为完整的系统。',
    ],
    excerpt: '组件库解决实现复用，设计系统解决决策一致，它们相关但不是一回事。',
    publishedAt: new Date('2024-03-26T08:00:00.000Z'),
    slug: 'component-library-is-not-design-system',
    tags: [
      {
        name: 'Components',
        slug: 'components',
      },
      {
        name: 'Design System',
        slug: 'design-system',
      },
    ],
    title: '组件库不等于设计系统',
  },
  {
    category: '复盘',
    categorySlug: 'review',
    content: [
      '刚开始做前端时，我更容易被框架、工具和新概念吸引。后来发现，真正长期有价值的是把复杂问题讲清楚、拆清楚、落地清楚。',
      '工程能力不只是写代码，也包括理解业务、识别风险、和不同角色建立共同语言。',
      '技术会持续变化，但清晰表达、稳定交付和持续学习会一直重要。',
    ],
    excerpt: '从工具热情到工程判断，前端成长更像是不断提高问题拆解和表达质量。',
    publishedAt: new Date('2023-10-12T08:00:00.000Z'),
    slug: 'frontend-growth-from-tools-to-judgment',
    tags: [
      {
        name: 'Growth',
        slug: 'growth',
      },
      {
        name: 'Frontend',
        slug: 'frontend',
      },
    ],
    title: '从工具热情到工程判断',
  },
  {
    category: '产品界面',
    categorySlug: 'product-interface',
    content: [
      '一个按钮、一个空状态、一段错误提示，看起来都很小，但它们会决定用户是否相信这个产品是可靠的。',
      '细节不是视觉洁癖，而是产品对用户预期的回应。状态越完整，用户越不需要猜。',
      '我喜欢那些不抢戏但稳定存在的界面细节，它们让产品更像一个可依赖的工具。',
    ],
    excerpt: '界面细节的价值在于减少猜测，让用户在每个状态下都知道下一步该怎么做。',
    publishedAt: new Date('2023-04-17T08:00:00.000Z'),
    slug: 'interface-details-build-trust',
    tags: [
      {
        name: 'UI',
        slug: 'ui',
      },
      {
        name: 'Product',
        slug: 'product',
      },
    ],
    title: '界面细节如何建立信任',
  },
]
