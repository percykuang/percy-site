import { updateProject } from '@ps/data-access'
import { updateProjectSchema } from '@ps/shared'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRouterParam(event, 'id')
  const input = await readValidatedBody(event, updateProjectSchema.parse)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project id is required',
    })
  }

  return updateProject(id, input)
})
