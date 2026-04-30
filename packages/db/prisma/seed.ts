import { prisma } from '../src/index'
import { hashPassword } from '../src/password'
import { seedArticles } from './seed-data/articles'

const weakAdminPasswords = new Set(['change-me', 'replace-with-a-strong-password'])

function countWords(content: string) {
  const englishWords = content.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) ?? []
  const cjkCharacters = content.match(/[\u3400-\u9fff]/g) ?? []

  return englishWords.length + cjkCharacters.length
}

function createArticleId() {
  return globalThis.crypto.randomUUID().replace(/-/g, '')
}

function assertProductionAdminPassword(password: string) {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  if (weakAdminPasswords.has(password.trim())) {
    throw new Error('ADMIN_INITIAL_PASSWORD must be changed before running seed in production')
  }
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com'
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD ?? 'change-me'

  assertProductionAdminPassword(adminPassword)

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

  await prisma.article.updateMany({
    where: {
      slug: 'hello-percy-site',
    },
    data: {
      published: false,
    },
  })

  for (const article of seedArticles) {
    const category = await prisma.category.upsert({
      where: {
        name: article.category,
      },
      update: {
        slug: article.categorySlug,
      },
      create: {
        name: article.category,
        slug: article.categorySlug,
      },
    })

    for (const tag of article.tags) {
      await prisma.tag.upsert({
        where: {
          name: tag.name,
        },
        update: {
          slug: tag.slug,
        },
        create: tag,
      })
    }

    const content = article.content.join('\n\n')
    const tagConnections = article.tags.map((tag) => ({
      slug: tag.slug,
    }))

    await prisma.article.upsert({
      where: {
        slug: article.slug,
      },
      update: {
        category: {
          connect: {
            id: category.id,
          },
        },
        content,
        excerpt: article.excerpt,
        published: true,
        publishedAt: article.publishedAt,
        tags: {
          set: tagConnections,
        },
        title: article.title,
        wordCount: countWords(content),
      },
      create: {
        category: {
          connect: {
            id: category.id,
          },
        },
        content,
        excerpt: article.excerpt,
        id: createArticleId(),
        published: true,
        publishedAt: article.publishedAt,
        slug: article.slug,
        tags: {
          connect: tagConnections,
        },
        title: article.title,
        wordCount: countWords(content),
      },
    })
  }
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
