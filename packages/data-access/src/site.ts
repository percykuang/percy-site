import { prisma } from '@ps/db'

export function getSiteConfig() {
  return prisma.siteConfig.findMany({
    orderBy: {
      key: 'asc',
    },
  })
}
