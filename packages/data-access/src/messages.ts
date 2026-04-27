import { prisma } from '@ps/db'
import type { CreateContactMessageInput } from '@ps/shared'

export function createContactMessage(input: CreateContactMessageInput) {
  return prisma.contactMessage.create({
    data: input,
  })
}

export function listContactMessages() {
  return prisma.contactMessage.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export function markContactMessageAsRead(id: string) {
  return prisma.contactMessage.update({
    where: {
      id,
    },
    data: {
      read: true,
    },
  })
}
