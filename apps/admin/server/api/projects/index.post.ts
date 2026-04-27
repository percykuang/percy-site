import { createProject } from '@ps/data-access'
import { createProjectSchema } from '@ps/shared'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const input = await readValidatedBody(event, createProjectSchema.parse)

  return createProject(input)
})
