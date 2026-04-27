import { listPublishedPosts } from '@ps/data-access'

export default defineEventHandler(() => {
  return listPublishedPosts()
})
