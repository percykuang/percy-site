import { listContactMessages } from '@ps/data-access'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  return listContactMessages()
})
