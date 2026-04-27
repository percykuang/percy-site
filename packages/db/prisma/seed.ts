import { prisma } from '../src/index'
import { hashPassword } from '../src/password'

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com'
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD ?? 'change-me'

  await prisma.user.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      name: 'Percy Admin',
      passwordHash: hashPassword(adminPassword),
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      name: 'Percy Admin',
      passwordHash: hashPassword(adminPassword),
      role: 'ADMIN',
    },
  })

  await prisma.project.upsert({
    where: {
      slug: 'percy-site',
    },
    update: {},
    create: {
      title: 'Percy Site',
      slug: 'percy-site',
      summary: '一个基于 Nuxt、Vue 3、TypeScript 和 Prisma 的个人主页系统。',
      content: 'Percy Site 用于展示个人项目、技术文章和前端工程实践。',
      category: 'WEB_APP',
      techStack: ['Nuxt', 'Vue 3', 'TypeScript', 'Tailwind CSS', 'Prisma'],
      featured: true,
      published: true,
      publishedAt: new Date(),
    },
  })

  await prisma.post.upsert({
    where: {
      slug: 'hello-percy-site',
    },
    update: {},
    create: {
      title: 'Hello Percy Site',
      slug: 'hello-percy-site',
      excerpt: '记录 Percy Site 的设计目标和技术选型。',
      content: '这是 Percy Site 的第一篇文章。',
      published: true,
      publishedAt: new Date(),
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
