import { listPublishedArticles } from '@ps/data-access'
import { ok } from '../utils/api'

export default defineEventHandler(() => {
  return listPublishedArticles().then(ok)
})
