import { listTags } from '@ps/data-access'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  return listTags()
})
