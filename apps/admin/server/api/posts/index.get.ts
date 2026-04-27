import { listAdminPosts } from '@ps/data-access'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  return listAdminPosts()
})
