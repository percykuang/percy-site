import { listAdminProjects } from '@ps/data-access'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  return listAdminProjects()
})
