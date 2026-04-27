import { listPublishedProjects } from '@ps/data-access'

export default defineEventHandler(() => {
  return listPublishedProjects()
})
