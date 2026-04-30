import { prisma, verifyPassword } from '@ps/db'
import type { LoginInput } from '@ps/shared/auth'

const adminUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const

export async function authenticateAdmin(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  })

  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export function getAdminUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: adminUserSelect,
  })
}
